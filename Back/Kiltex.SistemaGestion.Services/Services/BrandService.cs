

using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.EntityFrameworkCore;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class BrandService : BaseService
    {
        public BrandService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        {}
        public async Task<OperationResponse<DtoResponseBrand>> GetById(long id)
        {
            try 
            {
                var marca = await _contextSql
                                   .Brands
                                   .AsNoTracking()
                                   .FirstOrDefaultAsync(p => p.Id == id)
                                   .ConfigureAwait(false);
                if (marca == null) 
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoResponseBrand>(new OperationExceptions("000", $"Marca no encontrada Id: {id}"));
                    
                }

                var result = _mapper.Map<DtoResponseBrand>(marca);

                return new OperationResponse<DtoResponseBrand>(result);
            
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
        public async Task<OperationResponse<IdResponse<long>>> Add(DtoResponseBrand model, CancellationToken ct = default)
        {
            model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoResponseBrand model, CancellationToken ct = default)
        {
            try 
            {
                var countBrands = await _contextSql
                                    .Brands
                                    .AsNoTracking()
                                    .CountAsync(p => p.Description.ToLower() == model.Description.ToLower() && p.Id != model.Id, ct);
                if (countBrands > 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_009_ERROR_DUPLICATE));
                    return Error < IdResponse<long>>(new OperationExceptions("009", "Ya existe una marca con ese nombre"));
                }

                var brandModel = _mapper.Map<Brand>(model);
            
                if (brandModel.Id == 0)
                {
                    await _contextSql.Brands.AddAsync(brandModel, ct).ConfigureAwait(false);
                }
                else
                {
                    var oldBrand = await _contextSql
                                    .Brands
                                    .AsNoTracking()
                                    .FirstAsync(p => p.Id == brandModel.Id)
                                    .ConfigureAwait(false);
                    _contextSql.Brands.Update(brandModel);
                }
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

                return Ok(new IdResponse<long>(brandModel.Id));
            
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> Update(DtoResponseBrand model, CancellationToken ct = default)
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
        public async Task<OperationResponse<DtoPagination<DtoResponseBrand>>> ListBrands(RequestPaginatedData<string> request)
        {

            try 
            {
                var query = _contextSql
                                    .Brands
                                    .AsNoTracking()
                                    .Where(p => ((p.Description.ToLower().Contains(request.Filter ?? ""))));

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderBy(p => p.Id)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)
                                      .ToListAsync()
                                      .ConfigureAwait(false);
                var dto = _mapper.Map<List<DtoResponseBrand>>(list);

                return new OperationResponse<DtoPagination<DtoResponseBrand>>(new DtoPagination<DtoResponseBrand>
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
