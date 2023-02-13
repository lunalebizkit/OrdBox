using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal;


namespace Kiltex.SistemaGestion.Services.Services
{
    public  class ReporteZService : BaseService
    {
        private readonly IPrinter _printer;
        public ReporteZService(ErrorManager logger, DBContext context, IMapper maper, IPrinter printer) :
            base(logger, context, maper)
        {
            _printer = printer;
        }
        public async Task<OperationResponse<bool>> ReporteZ()
        {
            try
            {
                var cerrarJornada = await _printer.CerrarJornadaFiscal();

                if(cerrarJornada == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<bool>(new OperationExceptions("000", "No se pudo realizar reporte Z , verifique conexion a la impresora"));
                }

                return new OperationResponse<bool>(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
    }
}
