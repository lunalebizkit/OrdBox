using Kiltex.SistemaGestion.Services.ARCA.Dto;
using Kiltex.SistemaGestion.Services.ARCA.Dto.Response;
using Kiltex.SistemaGestion.Services.ARCA.Interface;
using System.Security;
using System.Security.Cryptography.Pkcs;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Xml;

namespace Kiltex.SistemaGestion.Services.ARCA
{
    public class ArcaIntegracionService : IArcaIntegracion
    {
        private static long _globalUniqueId = DateTime.UtcNow.Second;
        private readonly HttpClient _httpClient;
        private readonly ArcaConfig _arcaConfig;

        public ArcaIntegracionService(ArcaConfig arcaConfig, HttpClient? httpClient = null)
        {
            _httpClient = httpClient ?? new HttpClient();
            _arcaConfig = arcaConfig;
        }

        public async Task<LoginTicketResponseDto> ObtenerLoginTicketAsync(string pfxPath, string pfxPassword, string service, string wsaaUrl, CancellationToken ct = default)
        {
            pfxPassword = _arcaConfig.PfxPassword;
            pfxPath = _arcaConfig.PfxPath;
            wsaaUrl = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms";
            service = "wsfe";

            TimeZoneInfo argentinaTz = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            DateTimeOffset ahora = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, argentinaTz);
            long uniqueId = long.Parse(ahora.ToString("ddHHmmss"));
            DateTimeOffset generationTime = ahora.AddMinutes(-10);
            DateTimeOffset expirationTime = ahora.AddMinutes(10);

            var xmlRequest = BuildLoginTicketRequestXml(uniqueId, generationTime, expirationTime, service);
            var cmsFirmadoBase64 = SignXmlCmsBase64(xmlRequest, pfxPath, pfxPassword);

            string loginCmsResponseContent;
            try
            {
                using var content = new StringContent(BuildLoginCmsSoapEnvelope(cmsFirmadoBase64), Encoding.UTF8, "text/xml");
                content.Headers.Add("SOAPAction", "\"loginCms\"");

                using var resp = await _httpClient.PostAsync(wsaaUrl, content, ct);
                loginCmsResponseContent = await resp.Content.ReadAsStringAsync(ct);
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("Error llamando al WSAA: " + ex.Message, ex);
            }

            var innerXml = ExtractInnerLoginCmsReturn(loginCmsResponseContent);
            var dto = ParseLoginTicketResponse(innerXml ?? loginCmsResponseContent);
            dto.XmlRequest = xmlRequest;
            dto.XmlResponse = loginCmsResponseContent;
            return dto;
        }

        #region Private

        private static string BuildLoginTicketRequestXml(long uniqueId, DateTimeOffset generationTime, DateTimeOffset expirationTime, string service)
        { 
            var xml = $@"<loginTicketRequest>
    <header>
        <uniqueId>{uniqueId}</uniqueId>
        <generationTime>{generationTime.ToString("s")}</generationTime>
        <expirationTime>{expirationTime.ToString("s")}</expirationTime>
    </header>
    <service>{service}</service>
</loginTicketRequest>";

            return xml;
        }

        private static string SignXmlCmsBase64(string xml, string pfxPath, string pfxPassword)
        {
            var cert = new X509Certificate2(
     File.ReadAllBytes(pfxPath),
     pfxPassword,
     X509KeyStorageFlags.UserKeySet |
     X509KeyStorageFlags.PersistKeySet |
     X509KeyStorageFlags.Exportable
 );
            if (!cert.HasPrivateKey) throw new InvalidOperationException("El certificado no contiene clave privada.");
            if (DateTime.UtcNow < cert.NotBefore.ToUniversalTime() || DateTime.UtcNow > cert.NotAfter.ToUniversalTime())
                throw new InvalidOperationException("El certificado está fuera de vigencia.");

            var contentBytes = Encoding.UTF8.GetBytes(xml);
            var contentInfo = new ContentInfo(contentBytes);
            // Atención: revisa el manual WSAA si requiere detached = true/false. Aquí uso detached = true (común en ejemplos).
            var signedCms = new SignedCms(contentInfo, detached: false);
            var signer = new CmsSigner(cert) { IncludeOption = X509IncludeOption.EndCertOnly };
            signedCms.ComputeSignature(signer);
            var encoded = signedCms.Encode();
            return Convert.ToBase64String(encoded);
        }

        private static string BuildLoginCmsSoapEnvelope(string cmsBase64)
        {
            return $@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/""
                  xmlns:wsaa=""http://wsaa.view.sua.dvadac.desein.afip.gov"">
  <soapenv:Header/>
  <soapenv:Body>
    <wsaa:loginCms>
      <wsaa:in0>{SecurityElement.Escape(cmsBase64)}</wsaa:in0>
    </wsaa:loginCms>
  </soapenv:Body>
</soapenv:Envelope>";
        }

        private static string? ExtractInnerLoginCmsReturn(string soapResponse)
        {
            try
            {
                var doc = new XmlDocument();
                doc.LoadXml(soapResponse);
                var ns = new XmlNamespaceManager(doc.NameTable);
                ns.AddNamespace("soapenv", "http://schemas.xmlsoap.org/soap/envelope/");
                ns.AddNamespace("afip", "http://wsaa.view.sua.dvadac.desein.afip.gov");
                var returnNode = doc.SelectSingleNode("//afip:loginCmsReturn", ns);
                string innerXmlEscaped = returnNode.InnerText;

                // Desescapar el XML interno
                var innerDoc = new XmlDocument();
                innerDoc.LoadXml(innerXmlEscaped);
                return string.IsNullOrWhiteSpace(innerXmlEscaped) ? null : innerXmlEscaped;
            }
            catch
            {
                return null;
            }
        }

        private static LoginTicketResponseDto ParseLoginTicketResponse(string xmlResponse)
        {
            var dto = new LoginTicketResponseDto();
            var doc = new XmlDocument();
            doc.LoadXml(xmlResponse);

            // Nodos típicos: /loginTicketResponse/header/{uniqueId,generationTime,expirationTime} /loginTicketResponse/sign /loginTicketResponse/token
            var nsManager = new XmlNamespaceManager(doc.NameTable);
            // si hay namespaces en la respuesta, agrégalos al nsManager antes de usar SelectSingleNode

            var uniqueIdNode = doc.SelectSingleNode("//uniqueId", nsManager);
            if (uniqueIdNode != null && long.TryParse(uniqueIdNode.InnerText, out var u)) dto.UniqueId = u;

            var genNode = doc.SelectSingleNode("//generationTime", nsManager);
            if (genNode != null && DateTime.TryParse(genNode.InnerText, out var g)) dto.GenerationTime = g;

            var expNode = doc.SelectSingleNode("//expirationTime", nsManager);
            if (expNode != null && DateTime.TryParse(expNode.InnerText, out var e)) dto.ExpirationTime = e;

            var tokenNode = doc.SelectSingleNode("//token", nsManager);
            if (tokenNode != null) dto.Token = tokenNode.InnerText.Trim();

            var signNode = doc.SelectSingleNode("//sign", nsManager);
            if (signNode != null) dto.Sign = signNode.InnerText.Trim();

            return dto;
        }

        #endregion
    }
}
