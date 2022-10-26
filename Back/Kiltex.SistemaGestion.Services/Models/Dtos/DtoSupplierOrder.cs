using Kiltex.SistemaGestion.Domain.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos
{
    public class DtoSupplierOrder
    {
        public long Id { get; set; }

        public long SupplierOrderNumber { get; set; }

        public long SupplierId { get; set; }

        public bool IsPaid { get; set; }

        public long StatusId { get; set; }

        public DateTime? DateTime { get; set; }

        public DateTime? ScheduledDate { get; set; }

        public List<DtoOrderDetail> OrderDetail { get; set; }


    }
    public class DtoOrderDetail
    {
        public long Id { get; set; }

        public long SupplierOrderId { get; set; }

        public long ProductId { get; set; }

        public int OrderedQuantity { get; set; }

        public int RecievedQuantity { get; set; }

        public decimal Price { get; set; }

        public long StatusId { get; set; }


    }
}
