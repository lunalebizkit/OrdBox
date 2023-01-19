using hfl.argentina;

namespace Kiltex.SistemaGestion.Services.ImpresoraFiscal
{
    public class PrinterF250 : IPrinter
    {
        public string OpenFacturaA(string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, string domicilio = "")
        {
            throw new NotImplementedException();
        }

        public string OpenFacturaC(string cliente = "Consumidor Final", string cuit = "999999999", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL, string domicilio = "-")
        {
            throw new NotImplementedException();
        }

        public string OpenNotaCreditoA(string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, string domicilio = "", string NroRef = "")
        {
            throw new NotImplementedException();
        }

        public string OpenNotaCreditoC(string cliente = "Consumidor Final", string cuit = "999999999", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL, string domicilio = "", string NroRef = "SIN REFERENCIA")
        {
            throw new NotImplementedException();
        }

        public string OpenNotaDebitoC(string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.CONSUMIDOR_FINAL, string domicilio = "")
        {
            throw new NotImplementedException();
        }

        public string OpenNotaDeditoA(string cliente = "", string cuit = "999999995", HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente tipoDoc = HasarImpresoraFiscalRG3561.TiposDeDocumentoCliente.TIPO_CUIT, HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente responsabilidad = HasarImpresoraFiscalRG3561.TiposDeResponsabilidadesCliente.RESPONSABLE_INSCRIPTO, string domicilio = "")
        {
            throw new NotImplementedException();
        }
    }
}
