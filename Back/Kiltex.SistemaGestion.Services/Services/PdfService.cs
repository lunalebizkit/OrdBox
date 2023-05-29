
using AutoMapper;
using DocumentFormat.OpenXml.Wordprocessing;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Kiltex.SistemaGestion.Services.Common;
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

            Cabecera();
            Console.WriteLine("El archivo PDF ha sido creado.");
            
            return true;
        }

        public void Cabecera()
        {
            //Crear pdf y llmarlo arriba 
            string Cliente = "Sofia";
            string CUIT = "24442455568";
            string Dirección = "Buena Nueva";
            string Tipo = "A";
            DateTime fecha = DateTime.Now; 
  


            string titulo = "REFRIGERACION DANTE";
            string dni = " 20 - 08159465 - 8";
            string direccion = "Pirovano 375 San Martin - Mza";
            string nombre_apellido = "Dante Cesar Quercetti";
            string email = "dantecomercialsanmartin@gmail.com";

            Document document = new Document();

            // Establecer el nombre y ubicación del archivo PDF resultante
            string filePath = _configuration.GetSection("Archivos:Pdf").Value;

            // Crear el escritor PDF
            PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(filePath + "archivo.pdf", FileMode.Create));

            document.Open();

            Paragraph paragraph = new Paragraph
            {
                new Chunk("Cliente: " + Cliente),
                Chunk.Newline,
                new Chunk("CUIT: " + CUIT),
                Chunk.Newline,
                new Chunk("Dirección: " + Dirección),
                Chunk.Newline,
                new Chunk("Tipo: " + Tipo),
                Chunk.Newline,
                new Chunk("Fecha: " + fecha.ToString("yyyy-MM-dd"))
            };

            string imagePath = "C:\\Users\\Usuario\\Desktop\\Proyectos\\Gestion de Stock\\gestion-stock\\Front\\src\\assets\\img\\dantesLogo1.png";

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
            PdfPCell cell1 = new PdfPCell(paragraph)
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
            document.Add(table);
            // document.Add(paragraph2);
            document.Close();
           
        }
    }
}
