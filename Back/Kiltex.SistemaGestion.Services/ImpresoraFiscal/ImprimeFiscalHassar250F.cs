using hfl.argentina;
using System;
using System.Configuration;
using static hfl.argentina.HasarImpresoraFiscalRG3561;

namespace InsumosZanet.Biz
{
    public class ImprimeFiscalHassar250F
    {
        public int Error = 0;
        public string IP = "";
        HasarImpresoraFiscalRG3561 _driver = new HasarImpresoraFiscalRG3561();

        public void ReporteZ()
        {
            OpenPrinter();
            _driver.CerrarJornadaFiscal(HasarImpresoraFiscalRG3561.TipoReporte.REPORTE_Z);
        }

        public bool ComprobarEstado()
        {
            OpenPrinter();
            return true;
        }

        public ImprimeFiscalHassar250F()
        {
            Error = 0;
            IP = ConfigurationManager.AppSettings["IPImpresora"];
        }

        private void SetInfoHeaders()
        {
            var estilo = new hfl.argentina.Hasar_Funcs.AtributosDeTexto();
            estilo.setBorradoTexto(false);
            estilo.setCentrado(true);
            estilo.setDobleAncho(false);
            estilo.setNegrita(false);

            _driver.ConfigurarZona(1, estilo, ConfigurationManager.AppSettings["NombreFantasia"], HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
            _driver.ConfigurarZona(2, estilo, ConfigurationManager.AppSettings["DireccionMail"], HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
        }

        private void SetInfoHeadersLineas()
        {
            var estilo = new hfl.argentina.Hasar_Funcs.AtributosDeTexto();
            estilo.setBorradoTexto(false);
            estilo.setCentrado(true);
            estilo.setDobleAncho(false);
            estilo.setNegrita(false);

            _driver.ConfigurarZona(1, estilo, ConfigurationManager.AppSettings["line1"], HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
            _driver.ConfigurarZona(2, estilo, ConfigurationManager.AppSettings["line2"], HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
            _driver.ConfigurarZona(3, estilo, ConfigurationManager.AppSettings["line3"], HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
           // _driver.ConfigurarZona(4, estilo, ConfigurationManager.AppSettings["line4"], HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
        }

        private RespuestaAbrirDocumento AbrirTipoDocumento(HasarImpresoraFiscalRG3561.TiposComprobante documento, string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, string domicilio = "")
        {
            SetInfoHeaders();
            _driver.CargarDatosCliente(cliente, cuit, responsabilidad, tipoDoc, domicilio, string.Empty, string.Empty, string.Empty);
            var result = _driver.AbrirDocumento(documento);
            return result;
        }

        public RespuestaAbrirDocumento OpenFacturaA(
            string cliente = "",
            string cuit = "999999995",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO,
            string domicilio = "")
        {
            try
            {
                return AbrirTipoDocumento(TiposComprobante.FACTURA_A, cliente, cuit, tipoDoc, responsabilidad, domicilio);
            }
            catch (Exception ex)
            {
                MainMDI.LOG.Error(ex.Message, ex);
                return null;
            }
        }

        public RespuestaAbrirDocumento OpenNotaDeditoA(
            string cliente = "",
            string cuit = "999999995",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO,
            string domicilio = "")
        {
            try
            {
                return AbrirTipoDocumento(TiposComprobante.NOTA_DE_DEBITO_A, cliente, cuit, tipoDoc, responsabilidad, domicilio);
            }
            catch (Exception ex)
            {
                MainMDI.LOG.Error(ex.Message, ex);
                return null;
            }
        }

        public RespuestaAbrirDocumento OpenNotaCreditoA(
            string cliente = "",
            string cuit = "999999995",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO,
            string domicilio = "", string NroRef = "")
        {
            try
            {
                return AbrirTipoDocumento(TiposComprobante.NOTA_DE_CREDITO_A, cliente, cuit, tipoDoc, responsabilidad, domicilio);
            }
            catch (Exception ex)
            {
                MainMDI.LOG.Error(ex.Message, ex);
                return null;
            }
        }

        public RespuestaAbrirDocumento OpenNotaDebitoC(string cliente = "",
           string cuit = "999999995",
           TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
           TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL,
           string domicilio = "")
        {
            try
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
            catch (Exception ex)
            {
                MainMDI.LOG.Error(ex.Message, ex);
                return null;
            }
        }

        public RespuestaAbrirDocumento OpenNotaCreditoC(
            string cliente = "Consumidor Final",
            string cuit = "999999999",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL,
            string domicilio = "", string NroRef = "SIN REFERENCIA")
        {
            try
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
            catch (Exception ex)
            {
                MainMDI.LOG.Error(ex.Message, ex);
                return null;
            }
        }
        public RespuestaAbrirDocumento OpenFacturaC(
            string cliente = "Consumidor Final",
           string cuit = "999999999",
           TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
           TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL,
           string domicilio = "-")
        {

            try
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
            catch (Exception ex)
            {
                MainMDI.LOG.Error(ex.Message, ex);
                return null;
            }
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

        public void PrintSubTotal(bool imprime)
        {
          
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

        //public object CloseDocNoFiscales(int copias = 1)
        //{
        //    object numero;
        //    _driver.CerrarDNFH(copias, out numero);
        //    return numero;
        //}

        public bool OpenPrinter()
        {
            try
            {
                //_driver.conectar(ConfigurationManager.AppSettings["ipImpresora"]);
                //try
                //{
                //    _driver.Cancelar();
                //}
                //catch (Exception ex)
                //{
                //    MainMDI.LOG.Error(ex.Message, ex);
                //}
                return true;
            }
            catch (Exception ex)
            {
                MainMDI.LOG.Error(ex.Message, ex);
                return false;
            }
        }


        //private void _driver_ErrorImpresora(int Flags)
        //{
        //    MainMDI.LOG.Info("Error en la impresora: Flag = " + Flags);
        //    _driver.Abortar();
        //    throw new Exception("Error en la impresora: Flag = " + Flags);
        //}

        //private bool ConfigureHeader()
        //{
        //    try
        //    {
        //        _driver.NombreDeFantasia[0] = ConfigurationManager.AppSettings["FiscalNombreDeFantasia"];
        //        return true;
        //    }
        //    catch
        //    {
        //        return false;
        //    }
        //}
    }
}
