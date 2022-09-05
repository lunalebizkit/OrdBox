using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Models.Dtos
{
    public class DtoUpdatePriceProduct
    {
        public List<long> Id { get; set; }

        public int IdPrice { get; set; }

        public decimal Value { get; set; }
    }
}
