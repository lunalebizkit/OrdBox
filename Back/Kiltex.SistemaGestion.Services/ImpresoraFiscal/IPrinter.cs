using hfl.argentina;
using static hfl.argentina.HasarImpresoraFiscalRG3561;

namespace Kiltex.SistemaGestion.Services.ImpresoraFiscal
{
    public interface IPrinter 
    {

        //Facturas
        RespuestaAbrirDocumento OpenFacturaA(string cliente = "",
            string cuit = "999999995", 
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, 
            string domicilio = "");

        RespuestaAbrirDocumento OpenFacturaC(
            string cliente = "Consumidor Final",
           string cuit = "999999999",
           TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
           TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL,
           string domicilio = "-");

        //Debito
        RespuestaAbrirDocumento OpenNotaDeditoA(
            string cliente = "",
            string cuit = "999999995",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO,
            string domicilio = "");

        RespuestaAbrirDocumento OpenNotaDebitoC(string cliente = "",
           string cuit = "999999995",
           TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
           TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL,
           string domicilio = "");

        //Credito
        RespuestaAbrirDocumento OpenNotaCreditoA(
            string cliente = "",
            string cuit = "999999995",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO,
            string domicilio = "", string NroRef = "");

        RespuestaAbrirDocumento OpenNotaCreditoC(
            string cliente = "Consumidor Final",
            string cuit = "999999999",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL,
            string domicilio = "", string NroRef = "SIN REFERENCIA")
    }
}
