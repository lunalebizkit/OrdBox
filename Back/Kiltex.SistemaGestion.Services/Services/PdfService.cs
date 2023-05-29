
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
                new Chunk("Fecha: " + fecha.ToString())
            };
           // document.Add(paragraph);

            Paragraph paragraph2 = new Paragraph
            {
                new Chunk(titulo),
                Chunk.Newline,
                new Chunk("DNI: " + dni),
                Chunk.Newline,
                new Chunk("Direccion: " + direccion),
                Chunk.Newline,
                new Chunk("Nombre y Apellido: " + nombre_apellido),
                Chunk.Newline,
                new Chunk("Email: " +email)
            };

            PdfPTable table = new PdfPTable(2);

            // Primera columna: paragraph
            PdfPCell cell1 = new PdfPCell(paragraph);
            cell1.PaddingTop = 10f; // Ajustar el espacio superior de la celda
            cell1.HorizontalAlignment = Element.ALIGN_CENTER; // Centrar horizontalmente el contenido de la celda
            table.AddCell(cell1);

            // Segunda columna: paragraph2
            PdfPCell cell2 = new PdfPCell(paragraph2);
            cell2.PaddingTop = 10f; // Ajustar el espacio superior de la celda
            cell2.HorizontalAlignment = Element.ALIGN_CENTER; // Centrar horizontalmente el contenido de la celda
            table.AddCell(cell2);

            // Establecer el ancho de las columnas
            float[] columnWidths = { 1f, 1f }; // 50% de ancho para cada columna
            table.SetWidths(columnWidths);

            // Agregar la tabla al documento
            document.Add(table);
           // document.Add(paragraph2);
            document.Close();
           
        }
    }
}
