
using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;


namespace Kiltex.SistemaGestion.Services.Services
{
    public class BudgetService : BaseService
    {
        private IConfiguration _configuration;
        public BudgetService(ErrorManager logger, DBContext context, IMapper mapper, IConfiguration config) : base(logger, context, mapper)
        {
            _configuration = config;
        }

        public async Task<OperationResponse<DtoResponseBudget>> GetById(long id)
        {
            try
            {

                var model = await _contextSql
                               .Budgets
                               .Include(x => x.BudgetDetails)
                               .Include(x => x.User)
                               .AsNoTracking()
                               .FirstOrDefaultAsync(p => p.Id == id)
                               .ConfigureAwait(false);
                if (model == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoResponseBudget>(new OperationExceptions("000", $"Presupuesto no encontrado {id}"));
                }

                var result = _mapper.Map<DtoResponseBudget>(model);
              

                return new OperationResponse<DtoResponseBudget>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
        public async Task<OperationResponse<IdResponse<long>>> New(DtoRequestBudget model, CancellationToken ct = default)
        {

            model.Id = 0;

            return await AddOrUpdate(model, ct).ConfigureAwait(false);

        }

        public async Task<OperationResponse<IdResponse<long>>> Add(DtoRequestBudget model, CancellationToken ct = default)
        {
            model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }



        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestBudget model, CancellationToken ct = default)
        {
            try
            {
                var newModel = _mapper.Map<Budget>(model);

                if (newModel.Id == 0)
                {
                    await _contextSql.Budgets.AddAsync(newModel, ct).ConfigureAwait(false);
                }
                else
                {
                    var oldBrand = await _contextSql
                                    .Budgets
                                    .Include(x => x.BudgetDetails)                   
                                    .FirstAsync(p => p.Id == model.Id)
                                    .ConfigureAwait(false);

                   //_contextSql.BudgetDetails.RemoveRange(oldBrand.BudgetDetails.Where(p => !newModel.BudgetDetails.Any(m => m.Id == p.Id)));
                    _contextSql.BudgetDetails.RemoveRange(oldBrand.BudgetDetails);

                    _contextSql.Entry(oldBrand).State = EntityState.Detached;
                    await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

                    newModel.Total = 0;
                    
                    var newModel2 = _mapper.Map <Budget>(newModel);
                    foreach (var item in newModel.BudgetDetails)
                    {
                        item.Id = 0;
                        newModel.Total += item.Price * item.Quantity;
                        oldBrand.BudgetDetails.Add(item);
                    }

                   
                    //oldBrand.BudgetDetails = newModel.BudgetDetails;
                  
                    _contextSql.Attach(newModel2);
                  // _contextSql.Entry(oldBrand).State = EntityState.Modified;
                    //_contextSql.Entry<Budget>(newModel2).State= EntityState.Modified;
                    _contextSql.Update(newModel2);
              

                }
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);
                return Ok(new IdResponse<long>(newModel.Id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                return Error<IdResponse<long>>(new OperationExceptions(ErrorsCodes.C_999_ERROR_GENERICO, ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO)));
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> Update(DtoRequestBudget model, CancellationToken ct = default)
        {

            try
            {
                if (model.Id <= 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<IdResponse<long>>(new OperationExceptions("000", "La Marca no tiene ID"));
                }

                return await AddOrUpdate(model, ct).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<DtoPagination<DtoResponseBudget>>> ListBudget(RequestPaginatedData<string> request)
        {

            try
            {
                var query = _contextSql
                                    .Budgets
                                    .Include(p=>p.BudgetDetails)
                                    .Include(p => p.User)
                                    .AsNoTracking()
                                    .Where(p => ((p.BudgetNumber.ToString().Contains(request.Filter ?? ""))));

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderByDescending(p => p.DateTime).ThenBy(p => p.BudgetNumber)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);
                var dto = _mapper.Map<List<DtoResponseBudget>>(list);

                return new OperationResponse<DtoPagination<DtoResponseBudget>>(new DtoPagination<DtoResponseBudget>
                {
                    Data = dto,
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

