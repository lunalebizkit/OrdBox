using iTextSharp.text;
using iTextSharp.text.pdf;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class FooterWithCAEEvent : PdfPageEventHelper
    {
        private readonly DtoRequestInvoice _invoice;
        private readonly float _marginFromBottom;

        public FooterWithCAEEvent(DtoRequestInvoice invoice, float marginFromBottom = 40f)
        {
            _invoice = invoice;
            _marginFromBottom = marginFromBottom;
        }

        public override void OnEndPage(PdfWriter writer, Document document)
        {
            PdfContentByte cb = writer.DirectContent;
            var table = new PdfPTable(1) { TotalWidth = document.PageSize.Width - document.LeftMargin - document.RightMargin };
            var fontBold = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10);
            var font = FontFactory.GetFont(FontFactory.HELVETICA, 10);

            var phrase = new Phrase();
            phrase.Add(new Chunk("CAE: ", fontBold));
            phrase.Add(new Chunk(_invoice.CAE ?? string.Empty, font));
            phrase.Add(new Chunk("  |  Fecha Vto: ", fontBold));
            phrase.Add(new Chunk(_invoice.CAEExpirationDate?.ToString("dd/MM/yyyy") ?? string.Empty, font));

            var cell = new PdfPCell(phrase) { Border = PdfPCell.TOP_BORDER, Padding = 5f, HorizontalAlignment = Element.ALIGN_RIGHT };
            table.AddCell(cell);

            float x = document.LeftMargin;
            float y = document.BottomMargin + _marginFromBottom;
            table.WriteSelectedRows(0, -1, x, y + table.TotalHeight, cb);
        }
    }
}