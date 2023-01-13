using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class DebitMemoService : BaseService
    {
        public DebitMemoService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        { }
        public async Task<OperationResponse<DtoRequestDebitMemo>> GetById(long id)
        {
            try
            {
                var debitMemo = await _contextSql
                                    .DebitMemos
                                    .Include(x => x.DebitMemoDetails)
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(c => c.Id == id)
                                    .ConfigureAwait(false);

                if (debitMemo == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoRequestDebitMemo>(new OperationExceptions("000", $"Nota de debito no encontrada Id: {id}"));
                }

                var result = _mapper.Map<DtoRequestDebitMemo>(debitMemo);


                return new OperationResponse<DtoRequestDebitMemo>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }

        }
        public async Task<OperationResponse<IdResponse<long>>> Add(DtoRequestDebitMemo model, CancellationToken ct = default)
        {
            model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestDebitMemo model, CancellationToken ct = default)
        {
            var transaction = _contextSql.Database.BeginTransaction();
            DebitMemo debitMemoModel = null;

            try
            {
                if (model.Id == 0)
                {
                    foreach (var detail in model.DebitMemoDetails)
                    {
                        var oldProduct = await _contextSql.Products.AsNoTracking().FirstAsync(p => p.Id == detail.ProductId).ConfigureAwait(false);
                        detail.Price = oldProduct.SalePrice;
                    }
                    debitMemoModel = _mapper.Map<DebitMemo>(model);
                    debitMemoModel.InvoiceId = debitMemoModel.InvoiceId == 0 ? null : debitMemoModel.InvoiceId;
                    await _contextSql.DebitMemos.AddAsync(debitMemoModel, ct).ConfigureAwait(false);

                }
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

                transaction.Commit();

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }


            return Ok(new IdResponse<long>(debitMemoModel.Id));
        }
        public async Task<OperationResponse<IdResponse<long>>> Update(DtoRequestDebitMemo model, CancellationToken ct = default)
        {
            try
            {
                if (model.Id == 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<IdResponse<long>>(new OperationExceptions("000", "La nota de debito no tiene ID"));
                }
                return await AddOrUpdate(model, ct).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
        public async Task<OperationResponse<DtoPagination<DtoRequestDebitMemo>>> List(RequestPaginatedData<string> request)
        {
            try
            {
                var query = _contextSql
                                    .DebitMemos
                                    .AsNoTracking()
                                    .Include(p => p.DebitMemoDetails)
                                    .Where(p => p.CustomerCuit.ToLower().Contains(request.Filter ?? ""));

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderByDescending(p => p.DateTime)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);

                var result = _mapper.Map<List<DtoRequestDebitMemo>>(list);


                return new OperationResponse<DtoPagination<DtoRequestDebitMemo>>(new DtoPagination<DtoRequestDebitMemo>
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
    }
}
