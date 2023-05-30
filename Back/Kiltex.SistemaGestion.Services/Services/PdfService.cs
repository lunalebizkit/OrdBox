using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Vml;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.Extensions.Configuration;
using Document = iTextSharp.text.Document;
using Paragraph = iTextSharp.text.Paragraph;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class PdfService
    {
        private IConfiguration _configuration;

        public PdfService(IConfiguration configuration)

        { _configuration = configuration; }

        public async Task<bool> Imprimir()
        {
            Document document = new Document();
            // Establecer el nombre y ubicación del archivo PDF resultante
            string filePath = _configuration.GetSection("Archivos:Pdf").Value;

            try
            {
                
                // Crear el escritor PDF
                PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(filePath + $"{DateTime.Now.Second.ToString()}.pdf", FileMode.Create));

                document.Open();
                document.Add(Cabecera());
                document.Add(Chunk.Newline);
                document.Add( Detalle());
                
                document.Close();
             

                return true;
            }
            catch (Exception ex)
            {
                throw;
              
            }
            finally {
               document.Dispose();
            }

           
        }

        public Paragraph Cabecera()
        { 
            string titulo = "REFRIGERACION DANTE";
            string dni = " 20 - 08159465 - 8";
            string direccion = "Pirovano 375 San Martin - Mza";
            string nombre_apellido = "Dante Cesar Quercetti";
            string email = "dantecomercialsanmartin@gmail.com";

            Paragraph paragraph = new ();     


            string imagePath = "C:\\Users\\Lenovo\\Documents\\KILTEX\\Gestion-stock\\gestion-stock\\Front\\src\\assets\\img\\dantesLogo1.png";

            // Crear el objeto de imagen
            iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(imagePath);

            // Establecer el tamaño de la imagen (opcional)
            image.ScaleToFit(50f, 50f); // Ajusta la imagen al tamaño máximo de 200x200 puntos

            Chunk imageChunk = new Chunk(image, 1, 1);

            Phrase phrase = new Phrase();
            phrase.Add(new Chunk(titulo));
            phrase.Add(imageChunk);
            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk("DNI: " + dni));
            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk("Direccion: " + direccion));
            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk("Nombre y Apellido: " + nombre_apellido));
            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk("Email: " + email));

            PdfPTable table = new PdfPTable(2);

            // Primera columna: paragraph
            PdfPCell cell1 = new PdfPCell(phrase)
            {
                Border = PdfPCell.NO_BORDER,
                PaddingTop = 40f,
                HorizontalAlignment = Element.ALIGN_LEFT
            };
            table.AddCell(cell1);



            // Segunda columna: paragraph2
            PdfPCell cell2 = new PdfPCell(phrase)
            {
                Border = PdfPCell.NO_BORDER,
                PaddingTop = 6f,
                HorizontalAlignment = Element.ALIGN_LEFT,
                FixedHeight = 120f // Ajustar la altura de la celda
            };
            table.AddCell(cell2);

            float[] columnWidths = { 11f, 15f }; // 50% de ancho para cada columna
            table.SetWidths(columnWidths);

            // Establecer el estilo de borde de la tabla como "None"
            table.DefaultCell.Border = PdfPCell.NO_BORDER;

            // Agregar la tabla al documento
            paragraph.Add(table);

            return paragraph;
       
        }
        public Paragraph Detalle()
        {
        
            string Cliente = "Sofia";
            string CUIT = "24442455568";
            string Dirección = "Buena Nueva";
            string Tipo = "A";
            DateTime fecha = DateTime.Now;

            Paragraph parrafo = new();

            Phrase textoIzquierda = new()
            {
                new Chunk("Cliente: " + Cliente),
                Chunk.Newline,
                new Chunk("CUIT: " + CUIT),
                Chunk.Newline,
                new Chunk("Dirección: " + Dirección),
            };

            PdfPTable table = new(2);

            // Primera columna: paragraph
            PdfPCell cell1 = new PdfPCell(textoIzquierda)
            {
                Border = PdfPCell.TOP_BORDER | PdfPCell.BOTTOM_BORDER,
                PaddingTop = 10f,
                PaddingBottom = 10f,
                HorizontalAlignment = Element.ALIGN_LEFT
            };
            //Segunda Columna
            Phrase textoDerecha = new()
            {
               new Chunk("Tipo: " + Tipo),
                Chunk.Newline,
                new Chunk("Fecha: " + fecha.ToString("yyyy-MM-dd"))
            };
            PdfPCell cell2 = new PdfPCell(textoDerecha)
            {
                Border = PdfPCell.TOP_BORDER | PdfPCell.BOTTOM_BORDER,
                PaddingTop = 10f,
                PaddingBottom= 10f,
                HorizontalAlignment = Element.ALIGN_RIGHT
            };
            table.AddCell(cell1);
            table.AddCell(cell2);
            parrafo.Add(table);
            return parrafo;
        }
    }
}
