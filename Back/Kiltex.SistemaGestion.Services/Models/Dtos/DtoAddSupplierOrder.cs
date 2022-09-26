using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos
{
    public class DtoAddSupplierOrder
    {
        public long Id { get; set; }
        public long SupplierId { get; set; }
        public bool IsPaid { get; set; }

        public long StatusId { get; set; }
     
        public List<DtoAddOrderDetail> OrderDetail { get; set; }


    }
    public class DtoAddOrderDetail
    {
        public long Id { get; set; }
        public long ProductId { get; set; }

        public int OrderedQuantity { get; set; }

        public int RecievedQuantity { get; set; }
        public long StatusId { get; set; }


    }
}

