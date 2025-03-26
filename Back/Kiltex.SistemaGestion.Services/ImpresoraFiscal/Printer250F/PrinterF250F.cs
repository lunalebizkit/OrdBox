using Kiltex.SistemaGestion.Domain.Enum;
using Newtonsoft.Json;
//using Simple.Interface;
using System.Net.Mime;
using System.Text;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F.Dto;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using System.Reflection;
using DocumentFormat.OpenXml.Office.CustomUI;

namespace Kiltex.SistemaGestion.Services.ImpresoraFiscal.PrinterF250F

{
    public class PrinterF250F : IPrinter
    {
        private readonly PrinterConfig _config;
        public PrinterF250F(PrinterConfig config)
        {
            _config = config;
        }
      

        private async Task<T> RunCommand<T>(object request)
        {
            var data = JsonConvert.SerializeObject(request);
            using HttpClient client = new();
            
            var requestPrinter = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(_config.Ip),
                Content = new StringContent(data, Encoding.UTF8, "application/json"),
            };

            var response = await client.SendAsync(requestPrinter).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();  

            var responseBody = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

            return JsonConvert.DeserializeObject<T>(responseBody);
        }

        public async Task<string> OpenInvoice(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument, string address = "")
        {

            var typeDocumemt = type switch
            {
                ETypeReceipt.A => "TiqueFacturaA",
                ETypeReceipt.B => "TiqueFacturaB",
                _ => throw new NotImplementedException()
            };


            var result = await  RunCommand<DtoResponseAbrirDoc>(new AbrirDocumento { AbrirDocumentoBody = new AbrirDocumentoBody { CodigoComprobante = typeDocumemt }});

            foreach (var Item in result.Body.EstadoBody.Fiscal)
            {
                if (Item.ToString().Contains("Error"))
                {
                    return null ;
                }
            }
            return result.Body.NumeroComprobante;
        }

        public async Task SetHeader(string line1, string line2, string line3)
        {
            await SetZona(1, line1);
            await SetZona(2, line2);
            await SetZona(3, line3);
        }

        public async Task SetZona(int numeroLineas, string descripcion)
        {
            var result = await RunCommand<Estado>(new ConfigurarZona { ConfigurarZonaBody = new ConfigurarZonaBody { 
                NumeroLinea = numeroLineas,
                Descripcion = descripcion
            }});
        }

        public async Task<string> OpenND(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument, string address = "")
        {

            var typeDocumemt = type switch
            {
                ETypeReceipt.A => "TiqueNotaDebitoA",
                ETypeReceipt.B => "TiqueNotaDebitoB",
                _ => throw new NotImplementedException()
            };

            var result = await RunCommand<DtoResponseAbrirDoc>(new AbrirDocumento { AbrirDocumentoBody = new AbrirDocumentoBody { CodigoComprobante = typeDocumemt } });

            foreach (var Item in result.Body.EstadoBody.Fiscal)
            {
                if (Item.ToString().Contains("Error"))
                {
                    return null;
                }
            }

            return result.Body.NumeroComprobante;
        }

        public async Task<string> OpenNC(ETypeReceipt type, string documentClient, eTypeDocumentClient typeDocument, string address = "")
        {


            var typeDocumemt = type switch
            {
                ETypeReceipt.A => "TiqueNotaCreditoA",
                ETypeReceipt.B => "TiqueNotaCreditoB",
                _ => throw new NotImplementedException()
            };

            var result = await RunCommand<DtoResponseAbrirDoc>(new AbrirDocumento { AbrirDocumentoBody = new AbrirDocumentoBody { CodigoComprobante = typeDocumemt }});

            foreach (var Item in result.Body.EstadoBody.Fiscal)
            {
                if (Item.ToString().Contains("Error"))
                {
                    return null;
                }
            }

            return result.Body.NumeroComprobante;
        }

        public async Task<string> CerrarJornadaFiscal()
        {
            var result = await RunCommand<DtoResponseReporteZ>(new CerrarJornadaFiscal { CerrarJornadaFiscalBody = new CerrarJornadaFiscalBody { Reporte = "ReporteZ" } });

            foreach (var Item in result.Body.EstadoBody.Fiscal)
            {
                if (Item.ToString().Contains("Error"))
                {
                    await CloseFactura(1, "");
                    return null;
                }
            }

            return result.Body.EstadoBody.Fiscal.ToString();

        }

        public async Task<string> PrintItem(string articulo, double cantidad, decimal monto, decimal iva = 21, string codigo = "9999999")
        {

            var result = await RunCommand<DtoResponseImprimirItem>(new ImprimirItem { ImprimirItemBody = new ImprimirItemBody{
            
                Descripcion = articulo,
                Cantidad = cantidad,
                PrecioUnitario = monto,
                AlicuotaIVA = iva,
                CodigoProducto = codigo,
            }});

            foreach (var Item in result.Body.EstadoBody.Fiscal)
            {
                if (Item.ToString().Contains("Error"))
                {
                    return null;
                }
            }

            return result.Body.IndiceAuditoria.ToString();
        }

        public async Task<string> CloseFactura(int copias = 1, string email = "")
        {

            var result = await RunCommand<DtoResponseCerrarDoc>(new CerrarDocumento
            {
                CerrarDocumentoBody = new CerrarDocumentoBody
                {
                    Copias = copias,
                    DireccionEmail = email
                }
            });

            foreach (var Item in result.Body.EstadoBody.Fiscal)
            {
                if (Item.ToString().Contains("Error"))
                {
                    return null;
                }
            }
            return result.Body.NumeroComprobante;
        }

        public async Task<string> CargarDatosCliente(string customerName, string customerCuit, string customerAddress, ETypeReceipt tipoDocumento )
        {
            await SetHeader(_config.Line1, _config.Line2, _config.Line3);

            var typeDocumemt = tipoDocumento switch
            {
                ETypeReceipt.A => "ResponsableInscripto",
                ETypeReceipt.B => "ConsumidorFinal",
                _ => throw new NotImplementedException()
            };

            var typeIva = customerCuit.Length switch
            {
                11 => "TipoCUIT",
                8 => "TipoDNI",
            };

            var result = await RunCommand<DtoResponseCargarDatosCliente>(new CargarDatosCliente
                {
                    CargarDatosClienteBody = new CargarDatosClienteBody
                    {
                        RazonSocial = customerName,
                        NumeroDocumento = customerCuit,
                        ResponsabilidadIVA = typeDocumemt,
                        TipoDocumento = typeIva,
                        Domicilio = customerAddress
                    }
                });

            foreach(var Item in result.Body.EstadoBody.Fiscal)
            {
                if (Item.ToString().Contains("Error"))
                {
                    return null;
                }
            }

            return "Cliente Generado Correctamente";

        }

        public async Task<string> ReimprimirDocumento(ETypeReceipt tipoDocumento, string numeroComprobante)
        {
            var result = await RunCommand<DtoResponseReimprimirDoc>(new Reimprimir
            {
                CopiarComprobanteBody = new CopiarComprobanteBody
                {
                    CodigoComprobante = tipoDocumento,
                    NumeroComprobante = numeroComprobante
                }
            });

            foreach (var Item in result.Body.EstadoBody.Fiscal)
            {
                if (Item.ToString().Contains("Error"))
                {
                    await CloseFactura(1, "");
                    return null;
                }
            }
            return "Comprobante Reimpreso Correctamente";
        }
    }
}