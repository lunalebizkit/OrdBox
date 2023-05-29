
using System.Globalization;
using static System.Net.Mime.MediaTypeNames;

namespace Kiltex.SistemaGestion.Domain.Model
{
    public partial class Entity : BaseModel
    {
        public string ChangeName(string name)
        {
 
            CultureInfo cultureInfo = CultureInfo.CurrentCulture;
            TextInfo textInfo = cultureInfo.TextInfo;

            //Devuelve la primer letra de cada palabra en mayuscula
            return this.Name = textInfo.ToTitleCase(name.ToLower());
    
        }
    }
      
}
