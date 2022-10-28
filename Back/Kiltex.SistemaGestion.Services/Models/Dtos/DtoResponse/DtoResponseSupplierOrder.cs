

using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;

namespace Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse
{
    public class DtoResponseSupplierOrder
    {
        public long Id { get; set; }

        public long SupplierOrderNumber { get; set; }

        public string SupplierName { get; set; }

        public bool IsPaid { get; set; }

        public long StatusId { get; set; }

        public DateTime? DateTime { get; set; }

        public DateTime? ScheduledDate { get; set; }

        public List<DtoOrderDetail> OrderDetail { get; set; }


    }
   
}
