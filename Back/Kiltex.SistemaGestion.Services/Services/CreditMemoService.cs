using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Microsoft.EntityFrameworkCore;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class CreditMemoService : BaseService
    {
        public CreditMemoService(ErrorManager logger, DBContext context, IMapper mapper) :
          base(logger, context, mapper)
        { }

        //Metodo Get By Id
        public async Task<OperationResponse<DtoRequestCreditMemo>> GetById(long id)
        {
            try
            {
                var creditMemo = await _contextSql
                                    .CreditMemo
                                    .Include(x => x.CreditMemoDetail)
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(c => c.Id == id)
                                    .ConfigureAwait(false);

                if (creditMemo == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoRequestCreditMemo>(new OperationExceptions("000", $"Nota de Credito no encontrado ID: {id}"));
                }

                var result = _mapper.Map<DtoRequestCreditMemo>(creditMemo);

                return new OperationResponse<DtoRequestCreditMemo>(result);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> NewMemo(DtoRequestCreditMemo model, CancellationToken ct = default)
        {
            try
            {
                model.Id = 0;
                if (String.IsNullOrEmpty(model.CustomerName))
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<IdResponse<long>>(new OperationExceptions("000", "Datos incompletos"));
                }
                return await AddOrUpdate(model, ct).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<DtoPagination<DtoRequestCreditMemo>>> List(RequestPaginatedData<string> request)
        {
            try
            {
                var query = _contextSql
                                    .CreditMemo
                                    .OrderByDescending(p => p.DateTime)
                                    .AsNoTracking()
                                    .Include(p => p.CreditMemoDetail)
                                    .Where(p => p.CustomerCuit.ToLower().Contains(request.Filter ?? ""));

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderByDescending(p => p.Id)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);

                var result = _mapper.Map<List<DtoRequestCreditMemo>>(list);


                return new OperationResponse<DtoPagination<DtoRequestCreditMemo>>(new DtoPagination<DtoRequestCreditMemo>
                {
                    Data = result,
                    PageSize = request.PageSize,
                    TotalCount = count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestCreditMemo model, CancellationToken ct = default)
        {
            var transaction = _contextSql.Database.BeginTransaction();
            CreditMemo creditModel = new();

            try
            {
                if (model.Id == 0)
                {
                    foreach (var detail in model.CreditMemoDetail)
                    {
                        var oldProduct = await _contextSql.Products.AsNoTracking().FirstAsync(p => p.Id == detail.ProductId).ConfigureAwait(false);

                        detail.Price = oldProduct.SalePrice;
                    }
                    creditModel = _mapper.Map<CreditMemo>(model);
                    await _contextSql.CreditMemo.AddAsync(creditModel, ct).ConfigureAwait(false);
                }
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);
                transaction.Commit();
                return Ok(new IdResponse<long>(creditModel.Id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                return Error<IdResponse<long>>(new OperationExceptions(ErrorsCodes.C_999_ERROR_GENERICO, ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO)));
            }
        }
    }
}
