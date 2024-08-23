
using iTextSharp.text;
using iTextSharp.text.pdf;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Document = iTextSharp.text.Document;
using Font = iTextSharp.text.Font;
using Paragraph = iTextSharp.text.Paragraph;
using Path = System.IO.Path;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class PdfService
    {
        private IConfiguration _configuration;
        private IWebHostEnvironment _Env;

        private bool mostrarIvaTotal;
        private bool mostrarIvaTotal2;
        private bool mostrarIvaA;
        private bool mostrarIvaB;
        public PdfService(IConfiguration configuration, IWebHostEnvironment env)

        {
            _configuration = configuration;
            _Env = env;
        }

        public async Task<OperationResponse<byte[]>> Imprimir(Paragraph paragraph)
        {
            using (MemoryStream stream = new MemoryStream())
            {
                Document document = new Document();

                // Establecer el nombre y ubicación del archivo PDF resultante
                string filePath = Path.Combine(_Env.ContentRootPath, "PDF_Factura");
                string fileName = $"archivo_{DateTime.Now.ToString("yyyyMMdd")}.pdf";
                string fullPath = Path.Combine(filePath, fileName);
                if (!Directory.Exists(filePath))
                {
                    Directory.CreateDirectory(filePath);
                }

                try
                {
                    // Crear el escritor PDF
                    PdfWriter writer = PdfWriter.GetInstance(document, stream);

                    document.Open();
                    document.Add(paragraph);
                    document.Close();

                    // Obtener los bytes del MemoryStream después de cerrarlo
                    byte[] pdfBytes = stream.ToArray();

                    // Guardar el contenido del MemoryStream en un archivo en el disco
                    File.WriteAllBytes(fullPath, pdfBytes);

                    return new OperationResponse<byte[]>(pdfBytes);
                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {
                    document.Dispose();
                    stream.Dispose();
                    if (File.Exists(fullPath))
                    {
                        File.Delete(fullPath);
                    }
                }
            }
        }

        public async Task<Paragraph> Encabezado(DtoRequestEncabezadoPDF model)
        {

            string titulo = _configuration.GetSection("Pdf:Name").Value;
            string dni = _configuration.GetSection("Pdf:Cuit").Value;
            string direccion = _configuration.GetSection("Pdf:Direccion").Value;
            string nombre_apellido = _configuration.GetSection("Pdf:Nombre").Value;
            string email = _configuration.GetSection("Pdf:Email").Value;

            string imagePath = Path.Combine(_Env.ContentRootPath, "Assets", "dantesLogo1.png");
            // Crear el objeto de imagen
            iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(imagePath);

            // Establecer el tamaño de la imagen (opcional)
            image.ScaleToFit(60f, 60f); // Ajusta la imagen al tamaño máximo de 50x50 puntos

            PdfPTable table = new PdfPTable(2);


            Phrase phrase = new Phrase();

            // Estilo para el título
            Font titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.Black);
            Chunk titleChunk = new Chunk(titulo, titleFont);

            Font titleFont2 = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 13, BaseColor.Black);
            Chunk titleComprobante = new(model.TituloComprobante, titleFont2);
            Chunk numero = new(model.NumeroComprobante, titleFont2);

            phrase.Add(new Chunk(titleChunk));
            phrase.Add(Chunk.Newline);
            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk(""));
            phrase.Add(new Chunk(titleComprobante));

            phrase.Add(Chunk.Newline);
            phrase.Add(new Chunk("N°: ", titleFont2));
            phrase.Add(new Chunk(numero));
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
                VerticalAlignment = Element.ALIGN_LEFT,
            };
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

        public async Task<Paragraph> Cabecera(DtoRequestCabeceraPDF model)
        {
            var resumen = model;
            Paragraph parrafo = new();
            string CUIT = null;

            if (resumen.Cuit != null)
            {
                CUIT = resumen.Cuit.ToString();
            }

            string Cliente = resumen.Nombre;
            string Dirección = resumen.Direccion;
            string Observacion = resumen.Observacion;
            DateTime fecha = resumen.Fecha;


            // Mover la declaración fuera del bucle
            Phrase textoIzquierda = new()
            {
                new Chunk("Cliente: " + Cliente),
                Chunk.Newline,
                (CUIT != null) ? new Chunk("CUIT: " + CUIT) : null,
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

            mostrarIvaTotal = string.Equals(resumen.Tipo, "B", StringComparison.OrdinalIgnoreCase);
            mostrarIvaTotal2 = string.Equals(resumen.Tipo, "A", StringComparison.OrdinalIgnoreCase);

            mostrarIvaA = string.Equals(resumen.Tipo, "1", StringComparison.OrdinalIgnoreCase);
            mostrarIvaB = string.Equals(resumen.Tipo, "2", StringComparison.OrdinalIgnoreCase);

            //Segunda Columna
            Phrase textoDerecha = new()
            {
               (resumen.Tipo != null) ? new Chunk("Tipo: " + resumen.Tipo) : null,
                Chunk.Newline,
                new Chunk("Fecha: " + fecha.ToString("yyyy-MM-dd")),
                Chunk.Newline,
                new Chunk("Observación: "+ Observacion)
            };

            PdfPCell cell2 = new PdfPCell(textoDerecha)
            {
                Border = PdfPCell.TOP_BORDER | PdfPCell.BOTTOM_BORDER,
                PaddingTop = 10f,
                PaddingBottom = 10f,
                HorizontalAlignment = Element.ALIGN_RIGHT
            };
            table.AddCell(cell1);
            table.AddCell(cell2);
            parrafo.Add(table);
            return parrafo;
        }


        public async Task<Paragraph> Detalle(DtoRequestDetallePDF model)
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

            //COmprobante Compra
            if (resumen.Detalle != null)
            {


                foreach (var item in resumen.Detalle)
                {
                    table.AddCell(new PdfPCell(new Phrase(item.ProductName, font2))
                    {
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(item.Quantity.ToString(), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", item.Price), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(item.Iva.ToString(), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.LEFT_BORDER,
                        PaddingTop = 10f
                    });
                }

            }


            //Presupuesto
            if (resumen.BudgetDetails != null)
            {
                foreach (var item in resumen.BudgetDetails)
                {


                    table.AddCell(new PdfPCell(new Phrase(item.ProductName, font2))
                    {
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(item.Quantity.ToString(), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", item.Price), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                }
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


            float[] columnWidths2 = { 1f, 1f, 1f, 1f }; // Ancho relativo de cada columna
            table2.SetWidths(columnWidths2);

            table2.AddCell(emptyCell);
            table2.AddCell(emptyCell);

            if (mostrarIvaTotal != true && mostrarIvaTotal2 != true && mostrarIvaB != true && mostrarIvaA != true)
            {
                if (resumen.Iva10 != 0)
                {

                    table2.AddCell(new PdfPCell(new Phrase("Iva 10: "))
                    {
                        HorizontalAlignment = Element.ALIGN_LEFT,
                        Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER
                    });

                    //table2.AddCell(emptyCell);
                    table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Iva10)))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                    });
                    table2.AddCell(emptyCell);
                }

                if (resumen.Iva21 != 0)
                {

                    table2.AddCell(emptyCell);
                    table2.AddCell(emptyCell);
                    table2.AddCell(emptyCell);
                    table2.AddCell(emptyCell);
                    table2.AddCell(new PdfPCell(new Phrase("Iva 21: "))
                    {
                        HorizontalAlignment = Element.ALIGN_LEFT,
                        Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER
                    });


                    table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Iva21)))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER | PdfPCell.RIGHT_BORDER
                    });

                    table2.AddCell(emptyCell);
                    table2.AddCell(emptyCell);
                }

                if (resumen.Iva27 != 0)
                {

                    table2.AddCell(emptyCell);
                    table2.AddCell(emptyCell);
                    table2.AddCell(emptyCell);

                    table2.AddCell(new PdfPCell(new Phrase("Iva 27: "))
                    {
                        HorizontalAlignment = Element.ALIGN_LEFT,
                        Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER
                    });

                    table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Iva27)))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                    });
                    table2.AddCell(emptyCell);
                    table2.AddCell(emptyCell);
                }

            }


            table2.AddCell(emptyCell);
            table2.AddCell(emptyCell);
            table2.AddCell(emptyCell);
            table2.AddCell(emptyCell);

            var subTotal = resumen.Total - resumen.IvaTotal;
            if (mostrarIvaTotal != true)
            {
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
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
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(new PdfPCell(new Phrase("SubTotal: "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
                });
                table2.AddCell(new PdfPCell(new Phrase("$" + subTotal.ToString()))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });

                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("Total:"))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER
                });
                table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Total.ToString())))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });
            }


            table2.AddCell(emptyCell);



            if (mostrarIvaTotal2 != true)
            {
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("Total:"))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER
                });
                table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Total.ToString())))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });
            }

            table2.AddCell(emptyCell);
            table2.AddCell(emptyCell);

            paragraphTotal.Add(table2);
            paragraph.Add(paragraphDetalle);
            paragraph.Add(paragraphTotal);

            return paragraph;

        }

        public async Task<Paragraph> DetalleRecibo(DtoRequestDetallePDF model)
        {
            Paragraph paragraph = new Paragraph();
            PdfPTable table = new PdfPTable(5);

            // Establecer el ancho de las columnas
            float[] columnWidths = { 3f, 3f, 3f, 2f, 3f }; // Ancho entre columnas
            table.SetWidths(columnWidths);

            //Le agrego color a la letra de la tabla y tamaño
            BaseColor black = BaseColor.Black;
            Font font = FontFactory.GetFont(FontFactory.HELVETICA, 12, Font.BOLD, black);
            Font font2 = FontFactory.GetFont(FontFactory.HELVETICA, 10);

            table.AddCell(new PdfPCell(new Phrase("Suma Recibida", font))
            {
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER,
                HorizontalAlignment = Element.ALIGN_CENTER,
                PaddingBottom = 10f,
                PaddingTop = 5f
            });

            table.AddCell(new PdfPCell(new Phrase("Banco", font))
            {
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER,
                HorizontalAlignment = Element.ALIGN_CENTER,
                PaddingBottom = 10f,
                PaddingTop = 5f
            });

            table.AddCell(new PdfPCell(new Phrase("En Concepto de ", font))
            {
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER,
                HorizontalAlignment = Element.ALIGN_CENTER,
                PaddingBottom = 10f,
                PaddingTop = 5f
            });

            table.AddCell(new PdfPCell(new Phrase("Cheque", font))
            {
                Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER,
                HorizontalAlignment = Element.ALIGN_CENTER,
                PaddingBottom = 10f,
                PaddingTop = 5f
            });

            table.AddCell(new PdfPCell(new Phrase("Total: ", font))
            {
                Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER,
                HorizontalAlignment = Element.ALIGN_CENTER,
                PaddingBottom = 10f,
                PaddingTop = 5f
            });


            var resumen = model;
            //Recibo
            if (resumen.QuittanceDetails != null)
            {
                foreach (var item in resumen.QuittanceDetails)
                {
                    Chunk cashChunk = new Chunk(model.Cash.ToString(), font2);
                    table.AddCell(new PdfPCell(new Phrase("$" + cashChunk))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(item.Bank, font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(model.Concept, font2))
                    {
                        HorizontalAlignment = Element.ALIGN_CENTER,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase("N°" + item.CheckNumber, font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });


                    table.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + model.Total2), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.LEFT_BORDER,
                        PaddingTop = 10f
                    });
                }

            }
            paragraph.Add(table);
            return paragraph;

        }

        public async Task<Paragraph> DetalleComprobanteCompra(DtoRequestDetallePDF model)
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

            if (resumen.ReceiptDetails != null)
            {
                foreach (var item in resumen.ReceiptDetails)
                {


                    table.AddCell(new PdfPCell(new Phrase(item.ProductName, font2))
                    {
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(item.Quantity.ToString(), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", item.Price), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    if (item.Iva != null)
                    {
                        table.AddCell(new PdfPCell(new Phrase(item.Iva.ToString(), font2))
                        {
                            HorizontalAlignment = Element.ALIGN_RIGHT,
                            Border = PdfPCell.LEFT_BORDER,
                            PaddingTop = 10f
                        });
                    }

                }

            }

            Tabla(resumen);

            paragraph.Add(table);

            Paragraph saltoDeLinea1 = new Paragraph("");
            paragraph.Add(saltoDeLinea1);

            paragraph.Add(Tabla(resumen));

            return paragraph;

        }

        public Paragraph Tabla(DtoRequestDetallePDF model)
        {

            Paragraph paragraph = new Paragraph();


            PdfPTable table2 = new PdfPTable(6);
            float[] columnWidths2 = { 1f, 1f, 1f, 1f, 1f, 1f }; // Ancho relativo de cada columna
            table2.SetWidths(columnWidths2);


            PdfPCell emptyCell = new PdfPCell()
            {
                Border = PdfPCell.NO_BORDER
            };

            var resumen = model;

            var subTotal = resumen.Total - resumen.IvaTotal;

            if (mostrarIvaA == true)
            {
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(new PdfPCell(new Phrase("Conc. No Gravado "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
                });
                table2.AddCell(new PdfPCell(new Phrase("$" + resumen.ConcNoGravado.ToString()))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });

                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("Perc. Iva "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
                });
                table2.AddCell(new PdfPCell(new Phrase("$" + resumen.PercIva.ToString()))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });

                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("Perc. Ing. Bruto "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
                });
                table2.AddCell(new PdfPCell(new Phrase("$" + resumen.PercIngBrutos.ToString()))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });

                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("Iva Total: "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
                });
                table2.AddCell(new PdfPCell(new Phrase("$" + resumen.IvaTotal.ToString()))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });


                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("SubTotal: "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
                });
                table2.AddCell(new PdfPCell(new Phrase("$" + subTotal.ToString()))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });


                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("Total:"))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER
                });
                table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Total.ToString())))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });

            }
            else
            {
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(new PdfPCell(new Phrase("Conc. No Gravado "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
                });
                table2.AddCell(new PdfPCell(new Phrase("" + resumen.ConcNoGravado.ToString()))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });

                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("Perc. Iva "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
                });
                table2.AddCell(new PdfPCell(new Phrase("" + resumen.PercIva.ToString()))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });

                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("Perc. Ing. Bruto "))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,//Saco la linea del medio
                });
                table2.AddCell(new PdfPCell(new Phrase("" + resumen.PercIngBrutos.ToString()))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });


                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);
                table2.AddCell(emptyCell);

                table2.AddCell(new PdfPCell(new Phrase("Total:"))
                {
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER
                });
                table2.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", "$" + resumen.Total.ToString())))
                {
                    HorizontalAlignment = Element.ALIGN_RIGHT,
                    Border = PdfPCell.RIGHT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER,
                });
            }


            paragraph.Add(table2);

            return paragraph;
        }

        public async Task<Paragraph> DetallePresupuestoYRemito(DtoRequestDetallePDF model)
        {

            Paragraph paragraph = new Paragraph();
            PdfPTable table = new PdfPTable(3);

            // Establecer el ancho de las columnas
            float[] columnWidths = { 6f, 2f, 3f }; // Ancho entre columnas
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



            var resumen = model;
            //Presupuesto
            if (resumen.BudgetDetails != null)
            {
                foreach (var item in resumen.BudgetDetails)
                {

                    table.AddCell(new PdfPCell(new Phrase(item.ProductName, font2))
                    {
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(item.Quantity.ToString(), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", item.Price), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                }
            }
            //var subTotal = resumen.Total * resumen.Quantity;

            //Remito
            if (resumen.DeliveryNotesDetails != null)
            {
                foreach (var item in resumen.DeliveryNotesDetails)
                {

                    table.AddCell(new PdfPCell(new Phrase(item.ProductName, font2))
                    {
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(item.Quantity.ToString(), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });

                    table.AddCell(new PdfPCell(new Phrase(string.Format("{0,7:##.00}", item.Price), font2))
                    {
                        HorizontalAlignment = Element.ALIGN_RIGHT,
                        Border = PdfPCell.RIGHT_BORDER,
                        PaddingTop = 10f
                    });
                }
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
            table2.AddCell(emptyCell);

            table2.AddCell(emptyCell);
            table2.AddCell(emptyCell);

            table2.AddCell(emptyCell);
            table2.AddCell(emptyCell);
            table2.AddCell(new PdfPCell(new Phrase("Total:"))
            {
                HorizontalAlignment = Element.ALIGN_LEFT,
                Border = PdfPCell.LEFT_BORDER | PdfPCell.BOTTOM_BORDER | PdfPCell.TOP_BORDER
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
            paragraph.Add(paragraphTotal);

            return paragraph;

        }
    }
}
