namespace Kiltex.SistemaGestion.Services.ARCA.Dto.Request
{
    public class DtoRequestARCACustomer
    {
        public int TipoDocumento { get; set; }
        public string NumeroDocumento { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Domicilio { get; set; } = string.Empty;
    }
}
