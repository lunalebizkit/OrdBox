using Kiltex.SistemaGestion.Services.ARCA.Dto.Response;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;

namespace Kiltex.SistemaGestion.Services.ARCA.Interface
{
    public interface IArcaIntegracion
    {
        Task<FEParamGetTiposDocResponseDto> ObtenerTiposDocumentoAsync(CancellationToken ct = default);

        Task<DtoResponseARCAInvoice> CrearComprobanteAsync(DtoRequestInvoice invoice, CancellationToken ct = default);

        Task<FEParamGetTiposDocResponseDto> ObtenerTiposIvaAsync(CancellationToken ct = default);

        Task<DtoResponseArcaUltimoComprobante> ConsultarUltimoComprobanteAsync(int docType, string token, string sign, CancellationToken ct = default);

        Task<LoginTicketResponseDto> ObtenerLoginTicketAsync(CancellationToken ct = default);

        Task<DtoResponseARCAInvoice> CreateDebitNoteAsync(DtoRequestDebitMemo invoice, CancellationToken ct = default);

        Task<DtoResponseARCAInvoice> CreateCreditNoteAsync(DtoRequestCreditMemo invoice, CancellationToken ct = default);
    }
}
