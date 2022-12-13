using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Enum;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.EntityFrameworkCore;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class PeriodService: BaseService
    {
        public PeriodService(ErrorManager logger, DBContext context, IMapper maper) :
           base(logger, context, maper)

        { }
        public async Task<OperationResponse<DtoResponsePeriod>> GetById(long id)
        {
            try
            {
                var periodo = await _contextSql
                                   .Periods
                                   .AsNoTracking()
                                   .FirstOrDefaultAsync(p => p.Id == id)
                                   .ConfigureAwait(false);
                if (periodo == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoResponsePeriod>(new OperationExceptions("000", $"Periodo no encontrada Id: {id}"));

                }

                var result = _mapper.Map<DtoResponsePeriod>(periodo);

                return new OperationResponse<DtoResponsePeriod>(result);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> Add(DtoRequestPeriod model, CancellationToken ct = default)
        {
            //model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestPeriod model, CancellationToken ct = default)
        {
            try
            {
                var countPeriods = await _contextSql
                                    .Periods
                                    .AsNoTracking()
                                    .CountAsync(p => p.InitPeriod.Date == model.InitPeriod.Date && p.Id != model.Id, ct);

                var activePeriods =  _contextSql
                                    .Periods
                                    .AsNoTracking()
                                    .Where(p => (p.Status == true)  || ( p.EndPeriod.Date >= model.InitPeriod.Date));
               
                if (countPeriods > 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_009_ERROR_DUPLICATE));
                    return Error<IdResponse<long>>(new OperationExceptions("009", "Ya existe este periodo"));
                }

                var NewModel = _mapper.Map<Period>(model);

                if (NewModel.Id == 0)
                {
                    if (activePeriods.Count() > 0)
                    {
                        return Error<IdResponse<long>>(new OperationExceptions("009", "hay periodos activos"));
                    }
                    else
                    {
                        await _contextSql.Periods.AddAsync(NewModel, ct).ConfigureAwait(false);
                    }
                
                }
                   
                else
                {
                    var oldPeriod = await _contextSql
                                    .Periods
                                    .AsNoTracking()
                                    .FirstAsync(p => p.Id == NewModel.Id)
                                    .ConfigureAwait(false);
                    _contextSql.Periods.Update(NewModel);
                }
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

                return Ok(new IdResponse<long>(NewModel.Id));

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
        public async Task<OperationResponse<IdResponse<long>>> Update(DtoRequestPeriod model, CancellationToken ct = default)
        {

            try
            {
                if (model.Id <= 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<IdResponse<long>>(new OperationExceptions("000", "Periodo no tiene ID"));
                }

                return await AddOrUpdate(model, ct).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<DtoPagination<DtoResponsePeriod>>> ListPeriods(RequestPaginatedData<string> request)
        {

            try
            {
                var query = _contextSql
                                    .Periods
                                    .AsNoTracking()
                                    .Where(p => p.InitPeriod.ToString().Contains(request.Filter ?? "") ||
                                     p.EndPeriod.ToString().Contains(request.Filter ?? "")); 
                                   

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderBy(p => p.Id)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);

                var dto = _mapper.Map<List<DtoResponsePeriod>>(list);

                return new OperationResponse<DtoPagination<DtoResponsePeriod>>(new DtoPagination<DtoResponsePeriod>
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
