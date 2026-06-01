using Kiltex.SistemaGestion.Services.ARCA.Dto.Response;

namespace Kiltex.SistemaGestion.Services.ARCA.Interface
{
    public interface IArcaIntegracion
    {
        Task<LoginTicketResponseDto> ObtenerLoginTicketAsync(string pfxPath, string pfxPassword, string service, string wsaaUrl, CancellationToken ct = default);
    }
}
