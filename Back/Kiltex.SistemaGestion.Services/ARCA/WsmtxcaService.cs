using Kiltex.SistemaGestion.Services.ARCA.Dto.Request;
using Kiltex.SistemaGestion.Services.ARCA.Dto.Response;
using System.Text;
using System.Xml.Linq;

namespace Kiltex.SistemaGestion.Services.ARCA
{
    public class WsmtxcaService
    {
        private readonly HttpClient _httpClient;

        public WsmtxcaService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<DtoResponseARCAInvoice> AutorizarComprobanteAsync(DtoRequestARCAInvoice request, LoginTicketResponseDto auth)
        {
            // 1. Armar XML SOAP según el manual RG-2904
            string soapRequest = BuildSoapRequest(request, auth.Token, auth.Sign);

            // 2. Enviar al endpoint de AFIP (homologación o producción)
            var httpContent = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            var response = await _httpClient.PostAsync("https://wswhomo.afip.gov.ar/wsmtxca/services/MTXCAService", httpContent);

            response.EnsureSuccessStatusCode();

            // 3. Leer respuesta SOAP
            string soapResponse = await response.Content.ReadAsStringAsync();

            // 4. Parsear XML y mapear a DTO
            return ParseSoapResponse(soapResponse);
        }

        private string BuildSoapRequest(DtoRequestARCAInvoice dto, string token, string sign)
        {
            XNamespace soapenv = "http://schemas.xmlsoap.org/soap/envelope/";
            XNamespace ws = "http://impl.service.wsmtxca.afip.gov.ar/";
            var doc = new XDocument(
                new XElement(soapenv + "Envelope",
                    new XAttribute(XNamespace.Xmlns + "soapenv", soapenv),
                    new XAttribute(XNamespace.Xmlns + "ws", ws),
                    new XElement(soapenv + "Header"),
                    new XElement(soapenv + "Body",
                        new XElement(ws + "autorizarComprobante",
                            new XElement("authRequest",
                                new XElement("token", token),
                                new XElement("sign", sign),
                                new XElement("cuit", dto.CuitEmisor)
                            ),
                            new XElement("comprobante",
                                new XElement("cabecera",
                                    new XElement("concepto", 1), // 1 = productos, 2 = servicios, 3 = ambos (según AFIP)
                                    new XElement("tipoComprobante", dto.TipoComprobante),
                                    new XElement("puntoVenta", dto.PuntoVenta),
                                    new XElement("numeroComprobante", dto.NumeroComprobante),
                                    new XElement("fechaEmision", dto.FechaEmision.ToString("yyyyMMdd")),
                                    new XElement("moneda", dto.Moneda),
                                    new XElement("importeTotal", dto.ImporteTotal.ToString("F2").Replace(",", "")),
                                    new XElement("importeGravado", dto.ImporteGravado.ToString("F2").Replace(",", "")),
                                    new XElement("importeNoGravado", dto.ImporteNoGravado.ToString("F2").Replace(",", "")),
                                    new XElement("importeTributos", dto.ImporteTributos.ToString("F2").Replace(",", "")),
                                    new XElement("importeIva", dto.ImporteIva.ToString("F2").Replace(",", ""))
                                ),
                                new XElement("comprador",
                                    new XElement("tipoDocumento", dto.Comprador.TipoDocumento),
                                    new XElement("numeroDocumento", dto.Comprador.NumeroDocumento),
                                    new XElement("nombre", dto.Comprador.Nombre),
                                    new XElement("domicilio", dto.Comprador.Domicilio)
                                ),
                                new XElement("detalle",
                                    dto.Items.Select(i =>
                                        new XElement("item",
                                            new XElement("codigo", i.Codigo),
                                            new XElement("descripcion", i.Descripcion),
                                            new XElement("unidadMedida", i.UnidadMedida),
                                            new XElement("cantidad", i.Cantidad.ToString("F3").Replace(",", "")),
                                            new XElement("precioUnitario", i.PrecioUnitario.ToString("F2").Replace(",", "")),
                                            new XElement("subTotal", i.SubTotal.ToString("F2").Replace(",", "")),
                                            new XElement("alicuotaIVA", i.AlicuotaIVA)
                                        ))
                                )
                            )
                        )
                    )
                )
            );
            return doc.ToString(SaveOptions.DisableFormatting);
        }
                
        private DtoResponseARCAInvoice ParseSoapResponse(string xml)
        {
            var doc = XDocument.Parse(xml);
            XNamespace ns = "http://impl.service.wsmtxca.afip.gov.ar/";

            var resultado = doc.Descendants(ns + "resultado").FirstOrDefault()?.Value;
            var cae = doc.Descendants(ns + "cae").FirstOrDefault()?.Value;
            var fechaVto = doc.Descendants(ns + "fechaVencimientoCAE").FirstOrDefault()?.Value;

            var observaciones = doc.Descendants(ns + "observacion")
                                   .Select(o => o.Element("descripcion")?.Value ?? o.Value)
                                   .Where(s => !string.IsNullOrEmpty(s))
                                   .ToList();

            var errores = doc.Descendants(ns + "error")
                            .Select(e => e.Element("descripcion")?.Value ?? e.Value)
                            .ToList();

            return new DtoResponseARCAInvoice
            {
                Resultado = resultado,
                Cae = cae,
                FechaVencimientoCae = string.IsNullOrEmpty(fechaVto) ? null : DateTime.ParseExact(fechaVto, "yyyyMMdd", null),
                Observaciones = observaciones,
                Errores = errores
            };
        }
    }

}
