using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.ARCA.Dto;
using Kiltex.SistemaGestion.Services.ARCA.Dto.Response;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography.Pkcs;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace Kiltex.SistemaGestion.Services.ARCA.Services
{
    public class ArcaBaseService : BaseService
    {
        #region Config
        protected readonly HttpClient _httpClient;
        protected readonly ArcaConfig _arcaConfig;
        protected readonly IConfiguration _configuration;
        private IWebHostEnvironment _Env;

        public ArcaBaseService(ErrorManager logger, DBContext context, IMapper mapper, IConfiguration configuration, ArcaConfig arcaConfig, IWebHostEnvironment env, HttpClient? httpClient = null) : base(logger, context, mapper, configuration)
        {
            _httpClient = httpClient ?? new HttpClient();
            _arcaConfig = arcaConfig;
            _configuration = configuration;
            _Env = env;
        }
        #endregion

        #region Public Methods
        public async Task<LoginTicketResponseDto> ObtenerLoginTicketAsync(CancellationToken ct = default)
        {
            DtoRequestIntegrationLog integrationLog = new();

            string pfxPassword = _arcaConfig.PfxPassword;
            string pfxPath = Path.Combine(_Env.ContentRootPath, "Assets", _arcaConfig.PfxPath);
            string wsaaUrl = _arcaConfig.URLLogin;
            string service = "wsfe";

            TimeZoneInfo argentinaTz = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            DateTimeOffset ahora = TimeZoneInfo.ConvertTime(DateTimeOffset.UtcNow, argentinaTz);

            IntegrationLog? existingLog = await _contextSql.IntegrationLogs.FirstOrDefaultAsync(l => (l.Success == true && l.GenerationTime.Value <= ahora.DateTime && l.ExpirationTime.Value >= ahora.DateTime)).ConfigureAwait(false);

            if (existingLog != null)
            {
                return new LoginTicketResponseDto
                {
                    UniqueId = existingLog.UniqueId ?? 0,
                    GenerationTime = existingLog.GenerationTime,
                    ExpirationTime = existingLog.ExpirationTime,
                    Token = existingLog.Token ?? string.Empty,
                    Sign = existingLog.Sign ?? string.Empty,
                    XmlRequest = existingLog.Request ?? string.Empty,
                    XmlResponse = existingLog.Response ?? string.Empty
                };
            }

            long uniqueId = long.Parse(ahora.ToString("ddHHmmss"));
            DateTimeOffset generationTime = ahora.AddMinutes(-10);
            DateTimeOffset expirationTime = ahora.AddHours(12);

            var xmlRequest = BuildLoginTicketRequestXml(uniqueId, generationTime, expirationTime, service);
            var cmsFirmadoBase64 = SignXmlCmsBase64(xmlRequest, pfxPath, pfxPassword);

            integrationLog = CreateLog(wsaaUrl, xmlRequest, uniqueId, generationTime, expirationTime);

            string loginCmsResponseContent = string.Empty;

            try
            {
                using var content = new StringContent(BuildLoginCmsSoapEnvelope(cmsFirmadoBase64), Encoding.UTF8, "text/xml");
                content.Headers.Add("SOAPAction", "\"loginCms\"");

                using var resp = await _httpClient.PostAsync(wsaaUrl, content, ct);
                loginCmsResponseContent = await resp.Content.ReadAsStringAsync(ct);
                var innerXml = ExtractInnerLoginCmsReturn(loginCmsResponseContent);

                var dto = ParseLoginTicketResponse(innerXml ?? loginCmsResponseContent);
                dto.XmlRequest = xmlRequest;
                dto.XmlResponse = loginCmsResponseContent;

                integrationLog.Success = resp.IsSuccessStatusCode;
                integrationLog.Token = dto.Token;
                integrationLog.Sign = dto.Sign;

                return dto;
            }
            catch (Exception ex)
            {
                integrationLog.Success = false;
                SaveIntegrationLog(integrationLog);
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                throw;
            }
            finally
            {
                integrationLog.Response = loginCmsResponseContent;
                SaveIntegrationLog(integrationLog);
            }

        }

        #endregion

        #region Private Methods

        private static string BuildLoginTicketRequestXml(long uniqueId, DateTimeOffset generationTime, DateTimeOffset expirationTime, string service)
        {
            string genTime = generationTime.ToString("s");
            string expTime = expirationTime.ToString("s");
            var doc = new XDocument(
                new XElement("loginTicketRequest",
                    new XElement("header",
                        new XElement("uniqueId", uniqueId),
                        new XElement("generationTime", genTime),
                        new XElement("expirationTime", expTime)
                    ),
                    new XElement("service", service)
                )
            );

            return doc.ToString(SaveOptions.DisableFormatting);
        }

        private static string SignXmlCmsBase64(string xml, string pfxPath, string pfxPassword)
        {
            var cert = new X509Certificate2(File.ReadAllBytes(pfxPath), pfxPassword, X509KeyStorageFlags.UserKeySet | X509KeyStorageFlags.PersistKeySet | X509KeyStorageFlags.Exportable);

            if (!cert.HasPrivateKey) throw new InvalidOperationException("El certificado no contiene clave privada.");
            if (DateTime.UtcNow < cert.NotBefore.ToUniversalTime() || DateTime.UtcNow > cert.NotAfter.ToUniversalTime())
                throw new InvalidOperationException("El certificado está fuera de vigencia.");

            var contentBytes = Encoding.UTF8.GetBytes(xml);
            var contentInfo = new ContentInfo(contentBytes);
            var signedCms = new SignedCms(contentInfo, detached: false);
            var signer = new CmsSigner(cert) { IncludeOption = X509IncludeOption.EndCertOnly };
            signedCms.ComputeSignature(signer);
            var encoded = signedCms.Encode();
            return Convert.ToBase64String(encoded);
        }

        private static string BuildLoginCmsSoapEnvelope(string cmsBase64)
        {
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace wsaa = "http://wsaa.view.sua.dvadac.desein.afip.gov";

            var doc = new XDocument(
                new XElement(soapenv + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv),
                    new XAttribute(XNamespace.Xmlns + "wsaa", wsaa),
                    new XElement(soapenv + "Header"),
                    new XElement(soapenv + "Body",
                        new XElement(wsaa + "loginCms",
                            new XElement(wsaa + "in0", cmsBase64)
                        )
                    )
                )
            );

            return doc.ToString(SaveOptions.DisableFormatting);
        }

        private string? ExtractInnerLoginCmsReturn(string soapResponse)
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
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                return null;
            }
        }

        private static LoginTicketResponseDto ParseLoginTicketResponse(string xmlResponse)
        {
            var dto = new LoginTicketResponseDto();
            var doc = new XmlDocument();
            doc.LoadXml(xmlResponse);
            var nsManager = new XmlNamespaceManager(doc.NameTable);

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

        private void SaveIntegrationLog(DtoRequestIntegrationLog log)
        {
            try
            {
                IntegrationLog integration = _mapper.Map<IntegrationLog>(log);

                var existing = _contextSql.IntegrationLogs.FirstOrDefault();

                if (existing != null)
                {
                    _contextSql.IntegrationLogs.Add(integration);
                }
                else
                {
                    _contextSql.Entry(existing).State = EntityState.Detached;
                    _contextSql.IntegrationLogs.Update(integration);
                }
                _contextSql.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
            }
        }

        private static DtoRequestIntegrationLog CreateLog(string url, string xmlRequest, long? uniqueId, DateTimeOffset generationTime, DateTimeOffset expirationTime)
        {
            return new DtoRequestIntegrationLog
            {
                Id = 0,
                Endpoint = url,
                CreatedOn = DateTimeOffset.Now,
                Request = xmlRequest,
                UniqueId = uniqueId,
                GenerationTime = generationTime.DateTime,
                ExpirationTime = expirationTime.DateTime,
            };
        }

        #endregion
    }
}
