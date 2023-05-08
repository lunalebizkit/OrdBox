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
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class QuittanceService : BaseService
    {
        private IConfiguration _configuration;
        public QuittanceService(ErrorManager logger, DBContext context, IMapper mapper, IConfiguration config) : base(logger, context, mapper)
        {
            _configuration = config;
        }

        public async Task<OperationResponse<DtoResponseQuittance>> GetById(long id)
        {
            try
            {

                var model = await _contextSql
                               .Quittance
                               .Include(x => x.QuittanceDetails)
                               .AsNoTracking()
                               .FirstOrDefaultAsync(p => p.Id == id)
                               .ConfigureAwait(false);

                if (model == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoResponseQuittance>(new OperationExceptions("000", $"Recibo no encontrado {id}"));
                }

                var result = _mapper.Map<DtoResponseQuittance>(model);


                return new OperationResponse<DtoResponseQuittance>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<DtoPagination<DtoResponseQuittance>>> ListQuittance(RequestPaginatedData<string> request)
        {

            try
            {
                var query = _contextSql
                                    .Quittance
                                    .Include(p => p.QuittanceDetails)
                                    .AsNoTracking()
                                    .Where(p => ((p.QuittanceNumber.ToString().Contains(request.Filter ?? ""))));

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderByDescending(p => p.DateTime).ThenBy(p => p.QuittanceNumber)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);
                var dto = _mapper.Map<List<DtoResponseQuittance>>(list);

                return new OperationResponse<DtoPagination<DtoResponseQuittance>>(new DtoPagination<DtoResponseQuittance>
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

        public async Task<OperationResponse<IdResponse<long>>> NewQuittance(DtoRequestQuittance model, CancellationToken ct = default)
        {
            model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }

        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoRequestQuittance model, CancellationToken ct = default)
        {
            try
            {

                var newModel = _mapper.Map<Quittance>(model);

                if (newModel.Id == 0)
                {
                    await _contextSql.Quittance.AddAsync(newModel, ct).ConfigureAwait(false);
                }
                else
                {
                    var oldDeliveryNotes = await _contextSql
                                    .DeliveryNotes
                                    .AsNoTracking()
                                    .FirstAsync(p => p.Id == model.Id)
                                    .ConfigureAwait(false);
                    _contextSql.Quittance.Update(newModel);
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

        public async Task<OperationResponse<IdResponse<long>>> Update(DtoRequestQuittance model, CancellationToken ct = default)
        {
            try
            {
                if (model.Id <= 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<IdResponse<long>>(new OperationExceptions("000", "El remito no tiene ID"));
                }
                return await AddOrUpdate(model, ct).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
    }
}
