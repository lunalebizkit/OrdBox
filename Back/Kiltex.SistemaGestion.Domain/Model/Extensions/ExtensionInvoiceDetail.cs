

namespace Kiltex.SistemaGestion.Domain.Model
{
    public partial class Invoice : BaseModel
    {
        public void IvaPrice(decimal value, decimal iva, int quantity)
        {
            decimal newPriceTotal = 0;
            
            if (iva != 0)
            {
                newPriceTotal += (value * (1 + iva / 100.0m)) * quantity;
            }
            this.Total += newPriceTotal;
        }
    }
}
