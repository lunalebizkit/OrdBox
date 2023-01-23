using hfl.argentina;
using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.SDK.Error;
using static hfl.argentina.HasarImpresoraFiscalRG3561;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class PrinterF250Service : BaseService
    {

        public PrinterF250Service(ErrorManager logger, DBContext context, IMapper maper) :
          base(logger, context, maper)
        { }

        private void SetInfoHeaders()
        {
            var estilo = new hfl.argentina.Hasar_Funcs.AtributosDeTexto();
            estilo.setBorradoTexto(false);
            estilo.setCentrado(true);
            estilo.setDobleAncho(false);
            estilo.setNegrita(false);

            _contextSql.ConfigurarZona(1, estilo, ConfigurationManager.AppSettings["NombreFantasia"], HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
            _contextSql.ConfigurarZona(2, estilo, ConfigurationManager.AppSettings["DireccionMail"], HasarImpresoraFiscalRG3561.TiposDeEstacion.ESTACION_POR_DEFECTO, HasarImpresoraFiscalRG3561.ZonasDeLineasDeUsuario.ZONA_1_ENCABEZADO);
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
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
    }
}
