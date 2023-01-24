using AutoMapper;
using hfl.argentina;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using static hfl.argentina.HasarImpresoraFiscalRG3561;

namespace Kiltex.SistemaGestion.Services.ImpresoraFiscal
{
    public class PrinterF250 : IPrinter
    {
        //ACA VA LA LOGICA DE LA IMPRESORA, QUE SERIA EL CODIGO DE IMPRIMIRFISCALHASSAR250F

        public HasarImpresoraFiscalRG3561 _driver = new HasarImpresoraFiscalRG3561();
        public PrinterConfig impresora = new PrinterConfig();
        private void SetInfoHeaders()
        {
            var estilo = new hfl.argentina.Hasar_Funcs.AtributosDeTexto();
            estilo.setBorradoTexto(false);
            estilo.setCentrado(true);
            estilo.setDobleAncho(false);
            estilo.setNegrita(false);

            _driver.ConfigurarZona(1, estilo, impresora.FantasyName, HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
        }

        private void SetInfoHeadersLineas()
        {
            var estilo = new hfl.argentina.Hasar_Funcs.AtributosDeTexto();
            estilo.setBorradoTexto(false);
            estilo.setCentrado(true);
            estilo.setDobleAncho(false);
            estilo.setNegrita(false);

            _driver.ConfigurarZona(1, estilo, impresora.Line1, HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
            _driver.ConfigurarZona(2, estilo, impresora.Line2, HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
            _driver.ConfigurarZona(3, estilo, impresora.Line3, HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
        }

        private RespuestaAbrirDocumento AbrirTipoDocumento(HasarImpresoraFiscalRG3561.TiposComprobante documento, string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, string domicilio = "")
        {
            SetInfoHeaders();
            _driver.CargarDatosCliente(cliente, cuit, responsabilidad, tipoDoc, domicilio, string.Empty, string.Empty, string.Empty);
            var result = _driver.AbrirDocumento(documento);
            return result;
        }

        public void PrintItem(string articulo, double cantidad, double monto, double iva = 21, double impuesto = 0, string codigo = "9999999")
        {

            if (articulo.Length > 50)
                articulo = articulo.Substring(0, 49);
            _driver.ImprimirItem(
                articulo,
                cantidad,
                monto,
                CondicionesIVA.GRAVADO,
                iva,
                ModosDeMonto.MODO_SUMA_MONTO,
                ModosDeImpuestosInternos.II_FIJO_MONTO,
                impuesto,
                ModosDeDisplay.DISPLAY_NO,
                ModosDePrecio.MODO_PRECIO_TOTAL,
               codigo);
        }
        public object CloseFactura(RespuestaAbrirDocumento doc, int copias = 1, string Observacion = "")
        {
            var estilo = new hfl.argentina.Hasar_Funcs.AtributosDeTexto();
            estilo.setBorradoTexto(false);
            estilo.setCentrado(true);
            estilo.setDobleAncho(false);
            estilo.setNegrita(false);
            if (Observacion.Trim() != "")
            _driver.ImprimirTextoFiscal(estilo, Observacion);
            _driver.CerrarDocumento(copias, "");
            return doc.getNumeroComprobante();
        }
        RespuestaAbrirDocumento IPrinter.OpenFacturaA(string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, string domicilio = "")
        {
                return AbrirTipoDocumento(TiposComprobante.FACTURA_A, cliente, cuit, tipoDoc, responsabilidad, domicilio);

        }

         RespuestaAbrirDocumento IPrinter.OpenFacturaC(string cliente = "Consumidor Final", string cuit = "999999999", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL, string domicilio = "-")
        {
                SetInfoHeadersLineas();

                if (String.IsNullOrEmpty(cliente))
                    cliente = "Consumidor Final";
                if (cuit.Length != 11 || String.IsNullOrEmpty(cuit))
                {
                    cuit = "99999999";
                    tipoDoc = TiposDeDocumentoCliente.TIPO_DNI;
                }
                else
                {
                    if (cuit.Length == 11)
                        tipoDoc = TiposDeDocumentoCliente.TIPO_CUIL;
                }
                if (String.IsNullOrEmpty(domicilio))
                    domicilio = "-";

                return AbrirTipoDocumento(TiposComprobante.FACTURA_B, cliente, cuit, tipoDoc, responsabilidad, domicilio);
        }

         RespuestaAbrirDocumento IPrinter.OpenNotaCreditoA(string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, string domicilio = "", string NroRef = "")
        {
            return AbrirTipoDocumento(TiposComprobante.NOTA_DE_CREDITO_A, cliente, cuit, tipoDoc, responsabilidad, domicilio);
        }

         RespuestaAbrirDocumento IPrinter.OpenNotaCreditoC(string cliente = "Consumidor Final", string cuit = "999999999", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL, string domicilio = "", string NroRef = "SIN REFERENCIA")
        {
            SetInfoHeadersLineas();

            if (String.IsNullOrEmpty(cliente))
                cliente = "Consumidor Final";
            if (cuit.Length != 11 || String.IsNullOrEmpty(cuit))
            {
                cuit = "99999999";
                tipoDoc = TiposDeDocumentoCliente.TIPO_DNI;
            }
            else
            {
                if (cuit.Length == 11)
                    tipoDoc = TiposDeDocumentoCliente.TIPO_CUIL;
            }
            if (String.IsNullOrEmpty(domicilio))
                domicilio = "-";

            return AbrirTipoDocumento(TiposComprobante.NOTA_DE_CREDITO_B, cliente, cuit, tipoDoc, responsabilidad, domicilio);
        }

         RespuestaAbrirDocumento IPrinter.OpenNotaDebitoC(string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL, string domicilio = "")
        {
            if (String.IsNullOrEmpty(cliente))
                cliente = "Consumidor Final";
            if (cuit.Length != 11 || String.IsNullOrEmpty(cuit))
            {
                cuit = "99999999";
                tipoDoc = TiposDeDocumentoCliente.TIPO_DNI;
            }
            else
            {
                if (cuit.Length == 11)
                    tipoDoc = TiposDeDocumentoCliente.TIPO_CUIL;
            }
            if (String.IsNullOrEmpty(domicilio))
                domicilio = "-";

            return AbrirTipoDocumento(TiposComprobante.NOTA_DE_DEBITO_B, cliente, cuit, tipoDoc, responsabilidad, domicilio);
        }

         RespuestaAbrirDocumento IPrinter.OpenNotaDeditoA(string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, string domicilio = "")
        {
            return AbrirTipoDocumento(TiposComprobante.NOTA_DE_DEBITO_A, cliente, cuit, tipoDoc, responsabilidad, domicilio);
        }

    }
}
