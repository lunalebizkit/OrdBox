namespace Kiltex.SistemaGestion.Services.ARCA.Dto.Request
{
    public class DtoRequestARCAInvoice
    {
        public string CuitEmisor { get; set; } = string.Empty; // usar string
        public int PuntoVenta { get; set; }
        public int TipoComprobante { get; set; }
        public long NumeroComprobante { get; set; } // puede ser grande
        public DateTime FechaEmision { get; set; }
        public string Moneda { get; set; } = "PES"; // ejemplo
        public decimal ImporteTotal { get; set; }
        public decimal ImporteGravado { get; set; }
        public decimal ImporteNoGravado { get; set; }
        public decimal ImporteTributos { get; set; }
        public decimal ImporteIva { get; set; }
        public DtoRequestARCACustomer Comprador { get; set; } = new DtoRequestARCACustomer();
        public List<ItemDto> Items { get; set; } = new List<ItemDto>();
    }
    public class ItemDto
    {
        public string Codigo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal SubTotal { get; set; }
        public string AlicuotaIVA { get; set; } = "21"; // código/porcentaje según implementación
        public string UnidadMedida { get; set; } = "UN";
    }
}
