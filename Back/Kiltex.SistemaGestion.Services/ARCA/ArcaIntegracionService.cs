using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.ARCA.Dto;
using Kiltex.SistemaGestion.Services.ARCA.Dto.Response;
using Kiltex.SistemaGestion.Services.ARCA.Enum;
using Kiltex.SistemaGestion.Services.ARCA.Interface;
using Kiltex.SistemaGestion.Services.ARCA.Services;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Xml.Linq;

namespace Kiltex.SistemaGestion.Services.ARCA
{
    public class ArcaIntegracionService : ArcaBaseService, IArcaIntegracion
    {
        #region Config
        private static string _requestUltimoComprobante = string.Empty;
        private static string _responseUltimoComprobante = string.Empty;

        public ArcaIntegracionService(ErrorManager logger, DBContext context, IMapper mapper, IConfiguration configuration, ArcaConfig arcaConfig, IWebHostEnvironment env, HttpClient? httpClient = null) : base(logger, context, mapper, configuration, arcaConfig, env, httpClient)
        {
        }
        #endregion
        public async Task<FEParamGetTiposDocResponseDto> ObtenerTiposDocumentoAsync(CancellationToken ct = default)
        {
            try
            {
                var auth = await ObtenerLoginTicketAsync(ct);
                string soapRequest = BuildGetTipoDocumentoRequestXml(auth.Token, auth.Sign, _configuration.GetSection("Pdf:Cuit").Value, "FEParamGetTiposDoc");
                var httpContent = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
                httpContent.Headers.Clear();
                httpContent.Headers.Add("Content-Type", "text/xml; charset=utf-8");
                httpContent.Headers.Add("SOAPAction", "http://ar.gov.afip.dif.FEV1/FEParamGetTiposDoc");
                var response = await _httpClient.PostAsync(_arcaConfig.URLCAEBase, httpContent, ct);
                string soapResponse = await response.Content.ReadAsStringAsync(ct);

                return ParseDocumentTypesResponse(soapResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                throw;
            }
        }

        public async Task<FEParamGetTiposDocResponseDto> ObtenerTiposIvaAsync(CancellationToken ct = default)
        {
            try
            {
                string wsaaUrl = _arcaConfig.URLCAEBase;
                var auth = await ObtenerLoginTicketAsync(ct);
                string soapRequest = BuildGetTipoDocumentoRequestXml(auth.Token, auth.Sign, _configuration.GetSection("Pdf:Cuit").Value, "FEParamGetTiposIva");
                var httpContent = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
                httpContent.Headers.Clear();
                httpContent.Headers.Add("Content-Type", "text/xml; charset=utf-8");
                httpContent.Headers.Add("SOAPAction", "http://ar.gov.afip.dif.FEV1/FEParamGetTiposIva");
                var response = await _httpClient.PostAsync(wsaaUrl, httpContent, ct);

                response.EnsureSuccessStatusCode();
                string soapResponse = await response.Content.ReadAsStringAsync(ct);
                return ParseIvaTypesResponse(soapResponse);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                throw;
            }
        }

        public async Task<DtoResponseARCAInvoice> CrearComprobanteAsync(DtoRequestInvoice invoice, CancellationToken ct = default)
        {
            IntegrationLogInvoice integrationLog = new IntegrationLogInvoice
            {
                CreatedOn = DateTimeOffset.Now,
                Endpoint = _arcaConfig.URLCAEBase,
                InvoiceId = invoice.Id
            };
            try
            {
                var auth = await ObtenerLoginTicketAsync(ct);

                var ultimoComprobante = await ConsultarUltimoComprobanteAsync(invoice.Type, auth.Token, auth.Sign, ct);

                if (ultimoComprobante.CbteNro != null && ultimoComprobante.Errores.Any() == false)
                {
                    invoice.InvoiceNumber = int.Parse(ultimoComprobante.CbteNro) + 1;
                }
                else
                {
                    integrationLog.Request = _requestUltimoComprobante;
                    integrationLog.Success = false;
                    integrationLog.Response = _responseUltimoComprobante;
                    return new DtoResponseARCAInvoice
                    {
                        Resultado = "Error",
                        Errores = new List<string> { "No se pudo obtener el último número de comprobante autorizado." }
                    };
                }

                string soapRequest = BuildSoapRequest(invoice, auth.Token, auth.Sign);

                integrationLog.Request = soapRequest;

                var httpContent = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
                httpContent.Headers.Clear();
                httpContent.Headers.Add("Content-Type", "text/xml; charset=utf-8");
                httpContent.Headers.Add("SOAPAction", "http://ar.gov.afip.dif.FEV1/FECAESolicitar");
                var response = await _httpClient.PostAsync(_arcaConfig.URLCAEBase, httpContent, ct);
                string soapResponse = await response.Content.ReadAsStringAsync();

                integrationLog.Success = response.IsSuccessStatusCode;
                integrationLog.Response = soapResponse;

                if (!response.IsSuccessStatusCode)
                {
                    integrationLog.Success = false;
                    throw new Exception($"AFIP devolvió error {response.StatusCode}: {soapResponse}");
                }

                return ParseSoapResponse(soapResponse, invoice.InvoiceNumber);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                throw;
            }
            finally
            {
                SaveIntegrationLogInvoice(integrationLog);
            }
        }

        public async Task<DtoResponseArcaUltimoComprobante> ConsultarUltimoComprobanteAsync(int docType, string token, string sign, CancellationToken ct = default)
        {
            try
            {
                string wsaaUrl = _arcaConfig.URLCAEBase;
                string soapRequest = BuildGetUltimoComprobanteRequestXml(token, sign, _configuration.GetSection("Pdf:Cuit").Value, docType);
                _requestUltimoComprobante = soapRequest;

                var httpContent = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
                httpContent.Headers.Clear();
                httpContent.Headers.Add("Content-Type", "text/xml; charset=utf-8");
                httpContent.Headers.Add("SOAPAction", "http://ar.gov.afip.dif.FEV1/FECompUltimoAutorizado");
                var response = await _httpClient.PostAsync(wsaaUrl, httpContent, ct);
                string soapResponse = await response.Content.ReadAsStringAsync(ct);
                _responseUltimoComprobante = soapResponse;

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error {response.StatusCode}: {soapResponse}");
                    throw new Exception($"AFIP devolvió error {response.StatusCode}: {soapResponse}");
                }

                return ParseSoapUltimoComprobanteResponse(soapResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                throw;
            }
        }
        
        public async Task<DtoResponseArcaUltimoComprobante> ConsultarPuntodeVentaAsync(string token, string sign, CancellationToken ct = default)
        {
            try
            {
                string wsaaUrl = _arcaConfig.URLCAEBase;
                string soapRequest = BuildGetPuntoDeVentaRequestXml(token, sign, _configuration.GetSection("Pdf:Cuit").Value);
                _requestUltimoComprobante = soapRequest;

                var httpContent = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
                httpContent.Headers.Clear();
                httpContent.Headers.Add("Content-Type", "text/xml; charset=utf-8");
                httpContent.Headers.Add("SOAPAction", "http://ar.gov.afip.dif.FEV1/FEParamGetPtosVenta");
                var response = await _httpClient.PostAsync(wsaaUrl, httpContent, ct);
                string soapResponse = await response.Content.ReadAsStringAsync(ct);
                _responseUltimoComprobante = soapResponse;

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error {response.StatusCode}: {soapResponse}");
                    throw new Exception($"AFIP devolvió error {response.StatusCode}: {soapResponse}");
                }

                return ParseSoapUltimoComprobanteResponse(soapResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                throw;
            }
        }        

        public async Task<List<DtoResponseArcaCondicionIvaReceptor>> ObtenerCondicionFrenteIvaReceptorAsync(string token, string sign, long cuit, CancellationToken ct = default)
        {
            try
            {
                string wsaaUrl = _arcaConfig.URLCAEBase;
                string soapRequest = BuildGetCondicionFrenteIvaReceptorRequestXml(token, sign, cuit, "FEParamGetCondicionFrenteIvaReceptor");

                var httpContent = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
                httpContent.Headers.Clear();
                httpContent.Headers.Add("Content-Type", "text/xml; charset=utf-8");
                httpContent.Headers.Add("SOAPAction", "http://ar.gov.afip.dif.FEV1/FEParamGetCondicionIvaReceptor");
                var response = await _httpClient.PostAsync(wsaaUrl, httpContent, ct);
                string soapResponse = await response.Content.ReadAsStringAsync(ct);

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error {response.StatusCode}: {soapResponse}");
                    throw new Exception($"AFIP devolvió error {response.StatusCode}: {soapResponse}");
                }

                return ParseSoapCondicionFrenteIvaReceptorResponse(soapResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                throw;
            }
        }

        #region Nota de Crédito y Débito

        public async Task<DtoResponseARCAInvoice> CreateCreditNoteAsync(DtoRequestCreditMemo data, CancellationToken ct = default)
        {

           IntegrationLogCredit integrationLog = new()
            {
                CreatedOn = DateTimeOffset.Now,
                Endpoint = _arcaConfig.URLCAEBase,
                CreditId = data.Id
            };
            try
            {
                var auth = await ObtenerLoginTicketAsync(ct);

                var ultimoComprobante = await ConsultarUltimoComprobanteAsync(MapCreditDocumentType(data.Type), auth.Token, auth.Sign, ct);

                if (ultimoComprobante.CbteNro != null && ultimoComprobante.Errores.Any() == false)
                {
                    data.CreditMemoNumber = int.Parse(ultimoComprobante.CbteNro) + 1;
                }
                else
                {
                    integrationLog.Request = _requestUltimoComprobante;
                    integrationLog.Success = false;
                    integrationLog.Response = _responseUltimoComprobante;
                    return new DtoResponseARCAInvoice
                    {
                        Resultado = "Error",
                        Errores = new List<string> { "No se pudo obtener el último número de comprobante autorizado." }
                    };
                }

                string soapRequest = BuildCreditSoapRequest(data, auth.Token, auth.Sign);

                integrationLog.Request = soapRequest;

                var httpContent = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
                httpContent.Headers.Clear();
                httpContent.Headers.Add("Content-Type", "text/xml; charset=utf-8");
                httpContent.Headers.Add("SOAPAction", "http://ar.gov.afip.dif.FEV1/FECAESolicitar");
                var response = await _httpClient.PostAsync(_arcaConfig.URLCAEBase, httpContent, ct);
                string soapResponse = await response.Content.ReadAsStringAsync();

                integrationLog.Success = response.IsSuccessStatusCode;
                integrationLog.Response = soapResponse;

                if (!response.IsSuccessStatusCode)
                {
                    integrationLog.Success = false;
                    throw new Exception($"AFIP devolvió error {response.StatusCode}: {soapResponse}");
                }

                return ParseSoapResponse(soapResponse, data.CreditMemoNumber);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                throw;
            }
            finally
            {
                SaveIntegrationLog(integrationLog);
            }
        }

        public async Task<DtoResponseARCAInvoice> CreateDebitNoteAsync(DtoRequestDebitMemo data, CancellationToken ct = default)
        {
            IntegrationLogDebit integrationLog = new()
            {
                CreatedOn = DateTimeOffset.Now,
                Endpoint = _arcaConfig.URLCAEBase,
                DebitId = data.Id
            };
            try
            {
                var auth = await ObtenerLoginTicketAsync(ct);

                var ultimoComprobante = await ConsultarUltimoComprobanteAsync(MapDebitDocumentType(data.Type), auth.Token, auth.Sign, ct);

                if (ultimoComprobante.CbteNro != null && ultimoComprobante.Errores.Any() == false)
                {
                    data.DebitMemoNumber = int.Parse(ultimoComprobante.CbteNro) + 1;
                }
                else
                {
                    integrationLog.Request = _requestUltimoComprobante;
                    integrationLog.Success = false;
                    integrationLog.Response = _responseUltimoComprobante;
                    return new DtoResponseARCAInvoice
                    {
                        Resultado = "Error",
                        Errores = new List<string> { "No se pudo obtener el último número de comprobante autorizado." }
                    };
                }

                string soapRequest = BuildDebitSoapRequest(data, auth.Token, auth.Sign);

                integrationLog.Request = soapRequest;

                var httpContent = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
                httpContent.Headers.Clear();
                httpContent.Headers.Add("Content-Type", "text/xml; charset=utf-8");
                httpContent.Headers.Add("SOAPAction", "http://ar.gov.afip.dif.FEV1/FECAESolicitar");
                var response = await _httpClient.PostAsync(_arcaConfig.URLCAEBase, httpContent, ct);
                string soapResponse = await response.Content.ReadAsStringAsync();

                integrationLog.Success = response.IsSuccessStatusCode;
                integrationLog.Response = soapResponse;

                if (!response.IsSuccessStatusCode)
                {
                    integrationLog.Success = false;
                    throw new Exception($"AFIP devolvió error {response.StatusCode}: {soapResponse}");
                }

                return ParseSoapResponse(soapResponse, data.DebitMemoNumber);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
                throw;
            }
            finally
            {
                SaveIntegrationLog(integrationLog);
            }
        }

        #endregion

        #region Private
        #endregion


        #region Parseo de respuestas SOAP
        private DtoResponseARCAInvoice ParseSoapResponse(string xml,long invoiceNumber)
        {
            var doc = XDocument.Parse(xml);
            XNamespace ns = "http://ar.gov.afip.dif.FEV1/";

            var resultado = doc.Descendants(ns + "Resultado").FirstOrDefault()?.Value;
            var cae = doc.Descendants(ns + "CAE").FirstOrDefault()?.Value;
            var fechaVto = doc.Descendants(ns + "CAEFchVto").FirstOrDefault()?.Value;

            var observaciones = doc.Descendants(ns + "Obs")
                                   .Select(o => o.Element("Msg")?.Value ?? o.Value)
                                   .Where(s => !string.IsNullOrEmpty(s))
                                   .ToList();

            var errores = doc.Descendants(ns + "Err")
                            .Select(e => e.Element("Msg")?.Value ?? e.Value)
                            .ToList();

            return new DtoResponseARCAInvoice
            {
                InvoiceNumber = invoiceNumber,
                Resultado = resultado,
                Cae = cae,
                FechaVencimientoCae = string.IsNullOrEmpty(fechaVto) ? null : DateTime.ParseExact(fechaVto, "yyyyMMdd", null),
                Observaciones = observaciones,
                Errores = errores
            };
        }

        private DtoResponseArcaUltimoComprobante ParseSoapUltimoComprobanteResponse(string xml)
        {
            var doc = XDocument.Parse(xml);
            XNamespace ns = "http://ar.gov.afip.dif.FEV1/";

            var result = doc.Descendants(ns + "FECompUltimoAutorizadoResult").FirstOrDefault();

            var errores = result?.Descendants(ns + "Err")
                                 .Select(e => $"{e.Element(ns + "Code")?.Value} - {e.Element(ns + "Msg")?.Value}")
                                 .ToList() ?? new List<string>();

            var eventos = result?.Descendants(ns + "Evt")
                                 .Select(e => $"{e.Element(ns + "Code")?.Value} - {e.Element(ns + "Msg")?.Value}")
                                 .ToList() ?? new List<string>();

            return new DtoResponseArcaUltimoComprobante
            {
                CbteNro = result?.Element(ns + "CbteNro")?.Value,
                Errores = errores,
                Observaciones = eventos
            };
        }

        private FEParamGetTiposDocResponseDto ParseDocumentTypesResponse(string xml)
        {
            var doc = XDocument.Parse(xml);
            XNamespace ns = "http://ar.gov.afip.dif.FEV1/";
            var response = new FEParamGetTiposDocResponseDto
            {
                DocumentTypes = doc.Descendants(ns + "DocTipo")
                           .Select(td => new DtoResponseDocumentType
                           {
                               Id = td.Element(ns + "Id")?.Value,
                               Descripcion = td.Element(ns + "Desc")?.Value,
                               FchDesde = td.Element(ns + "FchDesde")?.Value,
                               FchHasta = td.Element(ns + "FchHasta")?.Value,
                           })
                           .ToList(),
                Errors = doc.Descendants(ns + "Err")
                    .Select(err => new DtoResponseError
                    {
                        Code = err.Element(ns + "Code")?.Value,
                        Msg = err.Element(ns + "Msg")?.Value,
                    })
                    .ToList(),

                Events = doc.Descendants(ns + "Evt")
                    .Select(evt => new DtoResponseError
                    {
                        Code = evt.Element(ns + "Code")?.Value,
                        Msg = evt.Element(ns + "Msg")?.Value,
                    })
                    .ToList()
            };

            return response;
        }

        private FEParamGetTiposDocResponseDto ParseIvaTypesResponse(string xml)
        {
            var doc = XDocument.Parse(xml);
            XNamespace ns = "http://ar.gov.afip.dif.FEV1/";
            var response = new FEParamGetTiposDocResponseDto
            {
                DocumentTypes = doc.Descendants(ns + "IvaTipo")
                           .Select(td => new DtoResponseDocumentType
                           {
                               Id = td.Element(ns + "Id")?.Value,
                               Descripcion = td.Element(ns + "Desc")?.Value,
                               FchDesde = td.Element(ns + "FchDesde")?.Value,
                               FchHasta = td.Element(ns + "FchHasta")?.Value,
                           })
                           .ToList(),
                Errors = doc.Descendants(ns + "Err")
                    .Select(err => new DtoResponseError
                    {
                        Code = err.Element(ns + "Code")?.Value,
                        Msg = err.Element(ns + "Msg")?.Value,
                    })
                    .ToList(),

                Events = doc.Descendants(ns + "Evt")
                    .Select(evt => new DtoResponseError
                    {
                        Code = evt.Element(ns + "Code")?.Value,
                        Msg = evt.Element(ns + "Msg")?.Value,
                    })
                    .ToList()
            };

            return response;
        }

        private List<DtoResponseArcaCondicionIvaReceptor> ParseSoapCondicionFrenteIvaReceptorResponse(string xml)
        {
            var doc = XDocument.Parse(xml);
            XNamespace ns = "http://ar.gov.afip.dif.FEV1/";

            var condiciones = doc.Descendants(ns + "CondicionIvaReceptor")
                         .Select(c => new DtoResponseArcaCondicionIvaReceptor
                         {
                             Id = c.Element(ns + "Id")?.Value,
                             Desc = c.Element(ns + "Desc")?.Value,
                             Cmp_Clase = c.Element(ns + "Cmp_Clase")?.Value
                         })
                         .ToList();

            return condiciones;
        }

        #endregion

        #region Create XML Requests, Firmar y Logueo

        private string BuildSoapRequest(DtoRequestInvoice dto, string token, string sign)
        {
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace ar = "http://ar.gov.afip.dif.FEV1/";
            string cuitEmisor = _configuration.GetSection("Pdf:Cuit").Value;

            var doc = new XDocument(
                new XElement(soapenv + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv),
                    new XAttribute(XNamespace.Xmlns + "ar", ar),
                    new XElement(soapenv + "Header"),
                    new XElement(soapenv + "Body",
                        new XElement(ar + "FECAESolicitar",
                            new XElement(ar + "Auth",
                                new XElement(ar + "Token", token),
                                new XElement(ar + "Sign", sign),
                                new XElement(ar + "Cuit", cuitEmisor.Replace("-", ""))
                            ),
                            new XElement(ar + "FeCAEReq",
                                new XElement(ar + "FeCabReq",
                                    new XElement(ar + "CantReg", 1),
                                    new XElement(ar + "PtoVta", CustomizationConstant.PuntoDeVenta),
                                    new XElement(ar + "CbteTipo", MapDocumentType(dto.Type))
                                ),
                                new XElement(ar + "FeDetReq",
                                    new XElement(ar + "FECAEDetRequest",
                                        new XElement(ar + "Concepto", (int)EConcepto.Productos),
                                        new XElement(ar + "DocTipo", MapPersonIdentificationType(dto.CustomerCuit)),
                                        new XElement(ar + "DocNro", dto.CustomerCuit),
                                        new XElement(ar + "CbteDesde", dto.InvoiceNumber),
                                        new XElement(ar + "CbteHasta", dto.InvoiceNumber),
                                        new XElement(ar + "CbteFch", dto.DateTime.ToString("yyyyMMdd")),
                                        new XElement(ar + "ImpTotal", (dto.Total)),
                                        new XElement(ar + "ImpTotConc", 0),
                                        new XElement(ar + "ImpNeto", (dto.Total - dto.IvaTotal)),
                                        new XElement(ar + "ImpOpEx", 0),
                                        new XElement(ar + "ImpTrib", 0),
                                        new XElement(ar + "ImpIVA", dto.IvaTotal),
                                        new XElement(ar + "MonId", CustomizationConstant.TipoMoneda),
                                        new XElement(ar + "MonCotiz", CustomizationConstant.MonCotiz),
                                        new XElement(ar + "CondicionIVAReceptorId", MapCondicionFrenteIvaReceptor(dto.Type)),
                                        // IVA
                                        new XElement(ar + "Iva",
                                            dto.InvoiceDetails
                                            .GroupBy(y => y.Iva)
                                            .Select(g =>
                                                new XElement(ar + "AlicIva",
                                                    new XElement(ar + "Id", MapIVAType(g.Key)),
                                                    new XElement(ar + "BaseImp", g.Sum(i => (i.Price * i.Quantity) - Math.Round(CalculateIvaAmount(i), 2))),
                                                    new XElement(ar + "Importe", g.Sum(i => Math.Round(CalculateIvaAmount(i), 2))))
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
            );

            return doc.ToString(SaveOptions.DisableFormatting);
        }

        private string BuildGetTipoDocumentoRequestXml(string token, string sign, string cuit, string operation)
        {
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace ar = "http://ar.gov.afip.dif.FEV1/";

            var doc = new XDocument(
                new XElement(soapenv + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv),
                    new XAttribute(XNamespace.Xmlns + "ar", ar),
                    new XElement(soapenv + "Header"),
                    new XElement(soapenv + "Body",
                        new XElement(ar + operation,
                            new XElement(ar + "Auth",
                                new XElement(ar + "Token", token),
                                new XElement(ar + "Sign", sign),
                                new XElement(ar + "Cuit", 20328120543)
                            )
                        )
                    )
                )
            );

            return doc.ToString(SaveOptions.DisableFormatting);
        }

        private string BuildGetUltimoComprobanteRequestXml(string token, string sign, string cuit, int docType)
        {
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace ar = "http://ar.gov.afip.dif.FEV1/";

            var doc = new XDocument(
                new XElement(soapenv + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv),
                    new XAttribute(XNamespace.Xmlns + "ar", ar),
                    new XElement(soapenv + "Header"),
                    new XElement(soapenv + "Body",
                        new XElement(ar + "FECompUltimoAutorizado",
                            new XElement(ar + "Auth",
                                new XElement(ar + "Token", token),
                                new XElement(ar + "Sign", sign),
                                new XElement(ar + "Cuit", cuit.Replace("-", ""))
                            ),
                            new XElement(ar + "PtoVta", CustomizationConstant.PuntoDeVenta),
                            new XElement(ar + "CbteTipo", MapDocumentType(docType))
                        )
                    )
                )
            );

            return doc.ToString(SaveOptions.DisableFormatting);
        }
        
        private string BuildGetPuntoDeVentaRequestXml(string token, string sign, string cuit)
        {
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace ar = "http://ar.gov.afip.dif.FEV1/";

            var doc = new XDocument(
                new XElement(soapenv + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv),
                    new XAttribute(XNamespace.Xmlns + "ar", ar),
                    new XElement(soapenv + "Header"),
                    new XElement(soapenv + "Body",
                        new XElement(ar + "FEParamGetPtosVenta",
                            new XElement(ar + "Auth",
                                new XElement(ar + "Token", token),
                                new XElement(ar + "Sign", sign),
                                new XElement(ar + "Cuit", cuit.Replace("-", ""))
                            )
                        )
                    )
                )
            );

            return doc.ToString(SaveOptions.DisableFormatting);
        }

        private string BuildGetCondicionFrenteIvaReceptorRequestXml(string token, string sign, long cuit, string operation)
        {
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace ar = "http://ar.gov.afip.dif.FEV1/";

            var doc = new XDocument(
                new XElement(soapenv + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv),
                    new XAttribute(XNamespace.Xmlns + "ar", ar),
                    new XElement(soapenv + "Header"),
                    new XElement(soapenv + "Body",
                        new XElement(ar + "FEParamGetCondicionIvaReceptor",
                            new XElement(ar + "Auth",
                                new XElement(ar + "Token", token),
                                new XElement(ar + "Sign", sign),
                                new XElement(ar + "Cuit", cuit)
                            )
                        )
                    )
                )
            );

            return doc.ToString(SaveOptions.DisableFormatting);
        }

        private string BuildCreditSoapRequest(DtoRequestCreditMemo dto, string token, string sign)
        {
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace ar = "http://ar.gov.afip.dif.FEV1/";
            string cuitEmisor = _configuration.GetSection("Pdf:Cuit").Value;

            var doc = new XDocument(
                new XElement(soapenv + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv),
                    new XAttribute(XNamespace.Xmlns + "ar", ar),
                    new XElement(soapenv + "Header"),
                    new XElement(soapenv + "Body",
                        new XElement(ar + "FECAESolicitar",
                            new XElement(ar + "Auth",
                                new XElement(ar + "Token", token),
                                new XElement(ar + "Sign", sign),
                                new XElement(ar + "Cuit", cuitEmisor.Replace("-", ""))
                            ),
                            new XElement(ar + "FeCAEReq",
                                new XElement(ar + "FeCabReq",
                                    new XElement(ar + "CantReg", 1),
                                    new XElement(ar + "PtoVta", CustomizationConstant.PuntoDeVenta),
                                    new XElement(ar + "CbteTipo", MapCreditDocumentType(dto.Type))
                                ),
                                new XElement(ar + "FeDetReq",
                                    new XElement(ar + "FECAEDetRequest",
                                        new XElement(ar + "Concepto", (int)EConcepto.Productos),
                                        new XElement(ar + "DocTipo", MapPersonIdentificationType(dto.CustomerCuit)),
                                        new XElement(ar + "DocNro", dto.CustomerCuit),
                                        new XElement(ar + "CbteDesde", dto.CreditMemoNumber),
                                        new XElement(ar + "CbteHasta", dto.CreditMemoNumber),
                                        new XElement(ar + "CbteFch", dto.DateTime.ToString("yyyyMMdd")),
                                        new XElement(ar + "ImpTotal", (dto.Total)),
                                        new XElement(ar + "ImpTotConc", 0),
                                        new XElement(ar + "ImpNeto", (dto.Total - dto.IvaTotal)),
                                        new XElement(ar + "ImpOpEx", 0),
                                        new XElement(ar + "ImpTrib", 0),
                                        new XElement(ar + "ImpIVA", dto.IvaTotal),
                                        new XElement(ar + "MonId", CustomizationConstant.TipoMoneda),
                                        new XElement(ar + "MonCotiz", CustomizationConstant.MonCotiz),
                                        new XElement(ar + "CondicionIVAReceptorId", MapCondicionFrenteIvaReceptor(dto.Type)),
                                        new XElement(ar + "Iva",
                                            dto.CreditMemoDetail
                                            .GroupBy(y => y.Iva)
                                            .Select(g =>
                                                new XElement(ar + "AlicIva",
                                                    new XElement(ar + "Id", MapIVAType(g.Key)),
                                                    new XElement(ar + "BaseImp", g.Sum(i => (i.Price * i.Quantity) - Math.Round(CalculateIvaAmount(i), 2))),
                                                    new XElement(ar + "Importe", g.Sum(i => Math.Round(CalculateIvaAmount(i), 2))))
                                                )
                                        ),
                                        new XElement(ar + "CbtesAsoc",
                                                new XElement(ar + "CbteAsoc",
                                                    new XElement(ar + "Tipo", MapDocumentType(dto.Type)),
                                                    new XElement(ar + "PtoVta", CustomizationConstant.PuntoDeVenta),
                                                    new XElement(ar + "Nro", dto.InvoiceNumber)
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
            );

            return doc.ToString(SaveOptions.DisableFormatting);
        }

        private string BuildDebitSoapRequest(DtoRequestDebitMemo dto, string token, string sign)
        {
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace ar = "http://ar.gov.afip.dif.FEV1/";
            string cuitEmisor = _configuration.GetSection("Pdf:Cuit").Value;

            var doc = new XDocument(
                new XElement(soapenv + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv),
                    new XAttribute(XNamespace.Xmlns + "ar", ar),
                    new XElement(soapenv + "Header"),
                    new XElement(soapenv + "Body",
                        new XElement(ar + "FECAESolicitar",
                            new XElement(ar + "Auth",
                                new XElement(ar + "Token", token),
                                new XElement(ar + "Sign", sign),
                                new XElement(ar + "Cuit", cuitEmisor.Replace("-", ""))
                            ),
                            new XElement(ar + "FeCAEReq",
                                new XElement(ar + "FeCabReq",
                                    new XElement(ar + "CantReg", 1),
                                    new XElement(ar + "PtoVta", CustomizationConstant.PuntoDeVenta),
                                    new XElement(ar + "CbteTipo", MapDebitDocumentType(dto.Type))
                                ),
                                new XElement(ar + "FeDetReq",
                                    new XElement(ar + "FECAEDetRequest",
                                        new XElement(ar + "Concepto", (int)EConcepto.Productos),
                                        new XElement(ar + "DocTipo", MapPersonIdentificationType(dto.CustomerCuit)),
                                        new XElement(ar + "DocNro", dto.CustomerCuit),
                                        new XElement(ar + "CbteDesde", dto.DebitMemoNumber),
                                        new XElement(ar + "CbteHasta", dto.DebitMemoNumber),
                                        new XElement(ar + "CbteFch", dto.DateTime.ToString("yyyyMMdd")),
                                        new XElement(ar + "ImpTotal", (dto.Total)),
                                        new XElement(ar + "ImpTotConc", 0),
                                        new XElement(ar + "ImpNeto", (dto.Total - dto.IvaTotal)),
                                        new XElement(ar + "ImpOpEx", 0),
                                        new XElement(ar + "ImpTrib", 0),
                                        new XElement(ar + "ImpIVA", dto.IvaTotal),
                                        new XElement(ar + "MonId", CustomizationConstant.TipoMoneda),
                                        new XElement(ar + "MonCotiz", CustomizationConstant.MonCotiz),
                                        new XElement(ar + "CondicionIVAReceptorId", MapCondicionFrenteIvaReceptor(dto.Type)),
                                        new XElement(ar + "Iva",
                                            dto.DebitMemoDetails
                                            .GroupBy(y => y.Iva)
                                            .Select(g =>
                                                new XElement(ar + "AlicIva",
                                                    new XElement(ar + "Id", MapIVAType(g.Key)),
                                                    new XElement(ar + "BaseImp", g.Sum(i => (i.Price * i.Quantity) - Math.Round(CalculateIvaAmount(i), 2))),
                                                    new XElement(ar + "Importe", g.Sum(i => Math.Round(CalculateIvaAmount(i), 2))))
                                                )
                                        ),
                                        new XElement(ar + "CbtesAsoc",                                            
                                                new XElement(ar + "CbteAsoc",
                                                    new XElement(ar + "Tipo", MapDocumentType(dto.Type)),
                                                    new XElement(ar + "PtoVta", CustomizationConstant.PuntoDeVenta),
                                                    new XElement(ar + "Nro", dto.InvoiceNumber)
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
            );

            return doc.ToString(SaveOptions.DisableFormatting);
        }

        #endregion     

        #region Integration Logs
      
        private void SaveIntegrationLogInvoice(IntegrationLogInvoice log)
        {
            try
            {
                _contextSql.IntegrationLogInvoices.Add(log);
                _contextSql.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
            }
        }
        
        private void SaveIntegrationLog(IntegrationLogCredit log)
        {
            try
            {
                _contextSql.IntegrationLogCredits.Add(log);
                _contextSql.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
            }
        }
        
        private void SaveIntegrationLog(IntegrationLogDebit log)
        {
            try
            {
                _contextSql.IntegrationLogDebits.Add(log);
                _contextSql.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsCodes.C_010_ERROR_EXCEPTION, ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex: ex);
            }
        }

        #endregion

        #region MAPEO DE DATOS
        private static int MapPersonIdentificationType(string customerCuit)
        {
            if (string.IsNullOrEmpty(customerCuit))
            {
                return 0;
            }

            if (customerCuit.Length == 8)
            {
                return (int)EDocumento.DNI;
            }

            if (customerCuit.Length == 11)
            {
                if (customerCuit == CustomizationConstant.DefaultCUIT)
                {
                    return (int)EDocumento.NoCUIT;
                }
                else
                {
                    return (int)EDocumento.CUIT;
                }
            }
            else
            {
                return 0;
            }
        }

        private static int MapDocumentType(int invoiceType)
        {
            return (ETypeReceipt)invoiceType switch
            {
                ETypeReceipt.A or ETypeReceipt.ResponsableMonotrinuto => (int)EInvoiceType.FacturaA,
                ETypeReceipt.EXENTO or ETypeReceipt.B => (int)EInvoiceType.FacturaB,
                _ => invoiceType,
            };
        }

        private static int MapIVAType(decimal iva)
        {
            return (decimal)iva switch
            {
                (decimal)10.5 => (int)EIva.DIEZ,
                (decimal)21 => (int)EIva.VEINTIUNO,
                (decimal)27 => (int)EIva.VEINTISIETE,
                _ => (int)iva,
            };
        }

        private static decimal CalculateIvaAmount(DtoResponseInvoiceDetail e)
        {
            return ((e.Quantity * e.Price) - ((e.Quantity * e.Price) / (1 + e.Iva / 100.00m)));
        }
        
        private static decimal CalculateIvaAmount(DtoResponseDebitMemoDetails e)
        {
            return ((e.Quantity * e.Price) - ((e.Quantity * e.Price) / (1 + e.Iva / 100.00m)));
        }

        private static decimal CalculateIvaAmount(DtoResponseCreditMemoDetails e)
        {
            return ((e.Quantity * e.Price) - ((e.Quantity * e.Price) / (1 + e.Iva / 100.00m)));
        }

        private static int MapCondicionFrenteIvaReceptor(int invoiceType)
        {
            return (ETypeReceipt)invoiceType switch
            {
                ETypeReceipt.A => (int)ECondFrenteIvaReceptor.ResponsableInscripto,
                ETypeReceipt.EXENTO => (int)ECondFrenteIvaReceptor.IvaSujetoExento,
                ETypeReceipt.B => (int)ECondFrenteIvaReceptor.ConsumidorFinal,
                ETypeReceipt.ResponsableMonotrinuto => (int)ECondFrenteIvaReceptor.ResponsableMonotributo,
                _ => invoiceType,
            };
        }

        private static int MapCreditDocumentType(int invoiceType)
        {
            return (ETypeReceipt)invoiceType switch
            {
                ETypeReceipt.A or ETypeReceipt.ResponsableMonotrinuto => (int)EInvoiceType.NotaCreditoA,
                ETypeReceipt.EXENTO or ETypeReceipt.B => (int)EInvoiceType.NotaCreditoB,
                _ => invoiceType,
            };
        }
        
        private static int MapDebitDocumentType(int invoiceType)
        {
            return (ETypeReceipt)invoiceType switch
            {
                ETypeReceipt.A or ETypeReceipt.ResponsableMonotrinuto => (int)EInvoiceType.NotaDebitoA,
                ETypeReceipt.EXENTO or ETypeReceipt.B => (int)EInvoiceType.NotaDebitoB,
                _ => invoiceType,
            };
        }

        #endregion
    }
}
