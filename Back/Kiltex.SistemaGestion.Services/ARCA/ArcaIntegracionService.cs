using Kiltex.SistemaGestion.Services.ARCA.Dto.Response;
using Kiltex.SistemaGestion.Services.ARCA.Interface;
using System.Security.Cryptography.Pkcs;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Xml;

namespace Kiltex.SistemaGestion.Services.ARCA
{
    public class ArcaIntegracionService : IArcaIntegracion
    {
        private static long _globalUniqueId = DateTime.UtcNow.Ticks;
        public ArcaIntegracionService()
        {
        }

        public async Task<LoginTicketResponseDto> ObtenerLoginTicketAsync(string pfxPath, string pfxPassword, string service, string wsaaUrl, CancellationToken ct = default)
        {
            // 1) Generar LoginTicketRequest XML
            var uniqueId = Interlocked.Increment(ref _globalUniqueId);
            var generationTime = DateTime.UtcNow.AddMinutes(-10);
            var expirationTime = DateTime.UtcNow.AddMinutes(10);

            var xmlRequest = BuildLoginTicketRequestXml(uniqueId, generationTime, expirationTime, service);

            // 2) Firmar con PFX -> PKCS#7 en base64
            var cmsFirmadoBase64 = SignXmlCmsBase64(xmlRequest, pfxPath, pfxPassword);

            // 3) Llamar al WSAA (reusa proxy generado si lo tienes).
            // Aquí se muestra un patrón simple: si tienes un proxy SOAP generado, llama su método loginCms(cmsFirmadoBase64).
            // Si no, tendrías que construir el envelope SOAP y postear con HttpClient.
            string loginTicketResponseXml;
            try
            {
                // TODO: reemplaza con tu proxy generado. Ejemplo de uso si tienes ClienteLoginCms_CS.Wsaa.LoginCMSService:
                // var client = new ClienteLoginCms_CS.Wsaa.LoginCMSService();
                // client.Url = wsaaUrl;
                // loginTicketResponseXml = client.loginCms(cmsFirmadoBase64);
                // --- Si no usas proxy, implementar HttpClient SOAP POST aquí.
                throw new NotImplementedException("Sustituir con llamada al proxy WSAA o HttpClient SOAP.");
            }
            catch (Exception ex)
            {
                throw new Exception("Error llamando WSAA: " + ex.Message, ex);
            }

            // 4) Parsear respuesta
            var dto = ParseLoginTicketResponse(loginTicketResponseXml);
            dto.XmlRequest = xmlRequest;
            dto.XmlResponse = loginTicketResponseXml;
            return dto;
        }

        private static string BuildLoginTicketRequestXml(long uniqueId, DateTime generationTime, DateTime expirationTime, string service)
        {
            // Plantilla simple
            var doc = new XmlDocument();
            var xml = $@"<loginTicketRequest version=""1.0"">
    <header>
        <uniqueId>{uniqueId}</uniqueId>
        <generationTime>{generationTime:yyyy-MM-ddTHH:mm:ss}</generationTime>
        <expirationTime>{expirationTime:yyyy-MM-ddTHH:mm:ss}</expirationTime>
    </header>
    <service>{service}</service>
</loginTicketRequest>";
            doc.LoadXml(xml);
            return doc.OuterXml;
        }

        private static string SignXmlCmsBase64(string xml, string pfxPath, string pfxPassword)
        {
            var cert = new X509Certificate2(File.ReadAllBytes(pfxPath), pfxPassword, X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.PersistKeySet);
            var contentBytes = Encoding.UTF8.GetBytes(xml);
            var contentInfo = new ContentInfo(contentBytes);
            var signedCms = new SignedCms(contentInfo, detached: false);
            var signer = new CmsSigner(cert) { IncludeOption = X509IncludeOption.EndCertOnly };
            signedCms.ComputeSignature(signer);
            var encoded = signedCms.Encode();
            return Convert.ToBase64String(encoded);
        }

        private static LoginTicketResponseDto ParseLoginTicketResponse(string xmlResponse)
        {
            var dto = new LoginTicketResponseDto();
            var doc = new XmlDocument();
            doc.LoadXml(xmlResponse);

            // Nodos típicos: /loginTicketResponse/header/{uniqueId,generationTime,expirationTime} /loginTicketResponse/sign /loginTicketResponse/token
            var nsManager = new XmlNamespaceManager(doc.NameTable);
            // si hay namespaces en la respuesta, agrégalos al nsManager antes de usar SelectSingleNode

            var uniqueIdNode = doc.SelectSingleNode("//uniqueId");
            if (uniqueIdNode != null && long.TryParse(uniqueIdNode.InnerText, out var u)) dto.UniqueId = u;

            var genNode = doc.SelectSingleNode("//generationTime");
            if (genNode != null && DateTime.TryParse(genNode.InnerText, out var g)) dto.GenerationTime = g;

            var expNode = doc.SelectSingleNode("//expirationTime");
            if (expNode != null && DateTime.TryParse(expNode.InnerText, out var e)) dto.ExpirationTime = e;

            var tokenNode = doc.SelectSingleNode("//token");
            if (tokenNode != null) dto.Token = tokenNode.InnerText.Trim();

            var signNode = doc.SelectSingleNode("//sign");
            if (signNode != null) dto.Sign = signNode.InnerText.Trim();

            return dto;
        }
    }
}
