

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest
{
    public class DtoRequestSupplierOrder
    {
        public long Id { get; set; }
        public long SupplierId { get; set; }
        public bool IsPaid { get; set; }
        public DateTime DateTime { get; set; }
        public long StatusId { get; set; }

        public List<DtoOrderDetail> OrderDetail { get; set; }


    }
    public class DtoOrderDetail
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public int OrderedQuantity { get; set; }
        public int RecievedQuantity { get; set; }
        public long StatusId { get; set; }


    }
}

