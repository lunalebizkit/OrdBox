using AutoMapper;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal.Printer250F;
using Kiltex.SistemaGestion.Services.ImpresoraFiscal;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class ReimprimirDocService : BaseService
    {
        private readonly IPrinter _printer;
        private readonly PrinterStatus _config;

        public ReimprimirDocService(ErrorManager logger, DBContext context, IMapper maper, IPrinter printer,
            PrinterStatus config) :
            base(logger, context, maper)
        {
            _config = config;
            _printer = printer;
        }

        public async Task<OperationResponse<bool>> ReimprmirDoc(ETypeReceipt tipoDocumento, string numeroComprobante)
        {
            try
            {

                if (tipoDocumento == ETypeReceipt.B)
                {
                    tipoDocumento = ETypeReceipt.BImpresion;
                }

                if (tipoDocumento == ETypeReceipt.C)
                {
                    tipoDocumento = ETypeReceipt.CImpresion;
                }

                if (numeroComprobante == "0")
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<bool>(new OperationExceptions("000",
                        "El numero de comprobante no puede ser 0"));
                }

                if (_config.Status == false)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<bool>(new OperationExceptions("000",
                        "La impresora esta desactivada, reactive para realizar el Reimpresion"));
                }

                var reimpirmirDoc = await _printer.ReimprimirDocumento(tipoDocumento, numeroComprobante);

                if (reimpirmirDoc == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<bool>(new OperationExceptions("000",
                        "No se pudo realizar la Reimpresion , verifique conexion a la impresora"));
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
