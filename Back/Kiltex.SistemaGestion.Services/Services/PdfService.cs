using Aspose.Words.Drawing;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Vml;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.Extensions.Configuration;
using System.IO;
using static DocumentFormat.OpenXml.Packaging.RelationshipErrorHandler;
using Document = iTextSharp.text.Document;
using Font = iTextSharp.text.Font;
using Paragraph = iTextSharp.text.Paragraph;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class PdfService
    {
        private IConfiguration _configuration;

        public PdfService(IConfiguration configuration)

        { _configuration = configuration; }

        public async Task<bool> Imprimir(DtoRequestInvoice model)
        {
            Document document = new Document();
            // Establecer el nombre y ubicación del archivo PDF resultante
            string filePath = _configuration.GetSection("Archivos:Pdf").Value;
            string fileName = $"archivo_{DateTime.Now.ToString("yyyyMMdd")}.pdf";
            string fullPath = System.IO.Path.Combine(filePath, fileName);
            try
            {
                // Verificar si el archivo existe
                if (File.Exists(fullPath))
                {
                    // Eliminar el archivo existente
                    File.Delete(fullPath);
                }

                PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(fullPath, FileMode.Create));
                // Crear el escritor PDF
                // PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(filePath + $"{DateTime.Now.Second.ToString()}.pdf", FileMode.Create));
                //PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(filePath+fileName, FileMode.Create));


                document.Open();
                document.Add(await Encabezado());
                document.Add(Chunk.Newline);
                document.Add(await Cabecera(model));
                document.Add(Chunk.Newline);
                document.Add(await Detalle(model));
                
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

        public async Task<Paragraph> Encabezado( )
        {
            string titulo = _configuration.GetSection("Pdf:Name").Value;
            string dni = _configuration.GetSection("Pdf:Cuit").Value;
            string direccion = _configuration.GetSection("Pdf:Direccion").Value;
            string nombre_apellido = _configuration.GetSection("Pdf:Nombre").Value;
            string email = _configuration.GetSection("Pdf:Email").Value;

            string imagePath = "C:\\Users\\Usuario\\Desktop\\Proyectos\\Gestion de Stock\\gestion-stock\\Front\\src\\assets\\img\\dantesLogo1.png";

            // Crear el objeto de imagen
            iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(imagePath);

            // Establecer el tamaño de la imagen (opcional)
            image.ScaleToFit(60f, 60f); // Ajusta la imagen al tamaño máximo de 50x50 puntos

            PdfPTable table = new PdfPTable(2);


            Phrase phrase = new Phrase();

            // Estilo para el título
            Font titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.Black);
            Chunk titleChunk = new Chunk(titulo, titleFont);
            phrase.Add(titleChunk);


            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk(""));
            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk(dni));         
            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk(direccion));      
            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk(nombre_apellido));
            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk(email));

            // Primera columna: texto
            PdfPCell textCell = new PdfPCell(phrase)
            {
                Border = PdfPCell.NO_BORDER,
                PaddingTop = 20f,
                //PaddingBottom = 10f,
                VerticalAlignment = Element.ALIGN_LEFT,
            };

            //// Establecer color de fondo para el título
            //textCell.BackgroundColor = new BaseColor(230, 230, 230);

            // Establecer alineación y tamaño de fuente para el título
            textCell.HorizontalAlignment = Element.ALIGN_LEFT;
            textCell.Phrase.Font.Size = 16;

            // Agregar la celda a la tabla
          table.AddCell(textCell);

            // Segunda columna: imagen
            PdfPCell imageCell = new PdfPCell(image)
            {
                Border = PdfPCell.NO_BORDER,
                Padding = 0f,
                VerticalAlignment = Element.ALIGN_RIGHT,
                PaddingTop = 25f // Mueve la imagen mas abajo

            };
            table.AddCell(imageCell);

            float[] columnWidths = { 6f, 2f };
            table.SetWidths(columnWidths);
            Paragraph paragraph = new Paragraph();
            paragraph.Add(table);

            return paragraph;
        }

        public async Task<Paragraph> Cabecera(DtoRequestInvoice model)
          {
            var resumen = model;
            Paragraph parrafo = new();
        

            string Cliente = resumen.CustomerName;
            string CUIT = resumen.CustomerCuit;
            string Dirección = resumen.CustomerAddress;
           
            DateTime fecha = resumen.DateTime;

           
           // Mover la declaración fuera del bucle
            Phrase textoIzquierda = new()
            {
                new Chunk("Cliente: " + Cliente),
                Chunk.Newline,
                new Chunk("CUIT: " + CUIT),
                Chunk.Newline,
                new Chunk("Dirección: " + Dirección),
            };

            PdfPTable table = new PdfPTable(2);

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
               new Chunk("Tipo: " + resumen.Status),
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


        public async Task<Paragraph> Detalle(DtoRequestInvoice model)
        {
            Paragraph paragraph = new Paragraph();
            PdfPTable table = new PdfPTable(4);

            // Establecer el ancho de las columnas
            float[] columnWidths = { 6f, 2f, 3f, 2f }; // Ancho entre columnas
            table.SetWidths(columnWidths);

            //Le agrego color a la letra de la tabla y tamaño
            BaseColor black = BaseColor.Black;
            Font font = FontFactory.GetFont(FontFactory.HELVETICA, 12, Font.BOLD, black);
            Font font2 = FontFactory.GetFont(FontFactory.HELVETICA, 10);

            PdfPCell productoCell = new PdfPCell(new Phrase("Producto", font))
            {
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER,
                HorizontalAlignment = Element.ALIGN_CENTER,
                PaddingBottom = 10f,
                PaddingTop = 5f
            };

            table.AddCell(productoCell);
            table.AddCell(new PdfPCell(new Phrase("Cantidad", font))
            {
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER,
                HorizontalAlignment = Element.ALIGN_CENTER,
                PaddingBottom = 10f,
                PaddingTop = 5f
            });
            table.AddCell(new PdfPCell(new Phrase("Precio Unidad", font))
            {
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER,
                HorizontalAlignment = Element.ALIGN_CENTER,
                PaddingBottom = 10f,
                PaddingTop = 5f
            });
            table.AddCell(new PdfPCell(new Phrase("Iva", font))
            {
                Border = PdfPCell.BOTTOM_BORDER,
                HorizontalAlignment = Element.ALIGN_CENTER,
                PaddingBottom = 10f,
                PaddingTop = 5f
            });




             var resumen = model;


            
            foreach (var item in resumen.InvoiceDetails)
            {
                           

                table.AddCell(new PdfPCell(new Phrase(item.ProductName, font2))
                {
                    Border = PdfPCell.RIGHT_BORDER,
                    PaddingTop = 10f
                });

                table.AddCell(new PdfPCell(new Phrase(item.Quantity.ToString(), font2))
                {
                    Border = PdfPCell.RIGHT_BORDER,
                    PaddingTop = 10f
                });

                table.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", item.Price), font2))
                {
                    Border = PdfPCell.RIGHT_BORDER,
                    PaddingTop = 10f
                });

                table.AddCell(new PdfPCell(new Phrase(item.Iva.ToString(), font2))
                {
                    Border = PdfPCell.RIGHT_BORDER,
                    PaddingTop = 10f
                });

              
            }

            table.AddCell(paragraph);

        

            PdfPCell emptyCell = new PdfPCell()
            {
                Border = PdfPCell.NO_BORDER
            };

            Paragraph paragraphDetalle = new Paragraph();
            paragraphDetalle.Add(table);

            // Agregar espacio vertical entre las tablas
            Paragraph paragraphSaltoDeLinea = new Paragraph();
            paragraphSaltoDeLinea.Add(new Paragraph(" "));

            Paragraph paragraphTotal = new Paragraph();

            PdfPTable table2 = new PdfPTable(4);


            float[] columnWidths2 = { 1f, 2f, 1f, 1f }; // Ancho relativo de cada columna
            table2.SetWidths(columnWidths2);
         
            table2.AddCell(emptyCell);

            if (resumen.Iva10 != 0)
            {
                
                table2.AddCell(new PdfPCell(new Phrase("Iva 10: "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER 
                });

                
                table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", resumen.Iva10)))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });
                table2.AddCell(emptyCell);
            }
            else
            {
                if(resumen.Iva21 != 0)
                {
                    
                    table2.AddCell(emptyCell);
                    table2.AddCell(new PdfPCell(new Phrase("Iva 21: "))
                    {
                        HorizontalAlignment = Element.ALIGN_LEFT,
                        Border = PdfPCell.LEFT_BORDER  | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER 
                    });
                   
                    table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Iva21)))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border =  PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER | PdfPCell.RIGHT_BORDER
                    });
                    table2.AddCell(emptyCell);
                }
                else
                {
                    table2.AddCell(emptyCell);
                    table2.AddCell(new PdfPCell(new Phrase("Iva 27: "))
                    {
                        HorizontalAlignment = Element.ALIGN_LEFT,
                        Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                    });

                    table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Iva27)))
                    {
                        HorizontalAlignment = Element.ALIGN_LEFT,
                        Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                    });
                    table2.AddCell(emptyCell);
                }
            }
            table2.AddCell(emptyCell);
            table2.AddCell(new PdfPCell(new Phrase("IvaTotal: "))
            {
                HorizontalAlignment = Element.ALIGN_LEFT,
                Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER
            });

            table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.IvaTotal.ToString())))
            {
                HorizontalAlignment = Element.ALIGN_RIGHT,
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,

            });

            table2.AddCell(emptyCell);

            var subTotal = resumen.Total - resumen.IvaTotal;
            table2.AddCell(emptyCell);

            table2.AddCell(new PdfPCell(new Phrase("SubTotal: "))
            {
                HorizontalAlignment = Element.ALIGN_LEFT,
                Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
            });
            table2.AddCell(new PdfPCell(new Phrase("$"+subTotal.ToString()))
            {             
                HorizontalAlignment = Element.ALIGN_RIGHT,
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
            });
          

            table2.AddCell(emptyCell);
            table2.AddCell(emptyCell);
            table2.AddCell(new PdfPCell(new Phrase("Total:"))
            { 
                HorizontalAlignment = Element.ALIGN_LEFT, Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER 
            });   
            table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Total.ToString())))
            {
                HorizontalAlignment = Element.ALIGN_RIGHT,
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
            });
            table2.AddCell(emptyCell);
            table2.AddCell(emptyCell);

            paragraphTotal.Add(table2);
            paragraph.Add(paragraphDetalle);
           // paragraph.Add(paragraphSaltoDeLinea);
            paragraph.Add(paragraphTotal);

            return paragraph;
            
        }
    }
}
