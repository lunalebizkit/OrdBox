using static hfl.argentina.HasarImpresoraFiscalRG3561;

namespace Kiltex.SistemaGestion.Services.ImpresoraFiscal
{
    public interface IPrinter
    {
        //Facturas
        string OpenFacturaA(string cliente = "",
            string cuit = "999999995", 
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, 
            string domicilio = "");

        string OpenFacturaC(
            string cliente = "Consumidor Final",
           string cuit = "999999999",
           TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
           TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL,
           string domicilio = "-");

        //Debito
        string OpenNotaDeditoA(
            string cliente = "",
            string cuit = "999999995",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO,
            string domicilio = "");

        string OpenNotaDebitoC(string cliente = "",
           string cuit = "999999995",
           TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
           TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL,
           string domicilio = "");

        //Credito
        string OpenNotaCreditoA(
            string cliente = "",
            string cuit = "999999995",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO,
            string domicilio = "", string NroRef = "");

        string OpenNotaCreditoC(
            string cliente = "Consumidor Final",
            string cuit = "999999999",
            TiposDeDocumentoCliente tipoDoc = TiposDeDocumentoCliente.TIPO_CUIT,
            TiposDeResponsabilidadesCliente responsabilidad = TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL,
            string domicilio = "", string NroRef = "SIN REFERENCIA")
    }
}
