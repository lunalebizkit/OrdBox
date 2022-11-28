

using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.EntityFrameworkCore;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class CategoryService : BaseService
    {
        public CategoryService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        { }

        //Get Categoria
        public async Task<OperationResponse<DtoResponseCategory>> GetById(long id)
        {
            try
            {
                var categoria = await _contextSql
                                .Category
                                .AsNoTracking()
                                .FirstOrDefaultAsync(p => p.Id == id)
                                .ConfigureAwait(false);
                if (categoria == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<DtoResponseCategory>(new OperationExceptions("000", $"Usuario no encontrado Id:{id}"));
                }

                var result = new DtoResponseCategory()
                {
                    Id = id,
                    Description = categoria.Description
                };

                return new OperationResponse<DtoResponseCategory>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
            
        }
        public async Task<OperationResponse<IdResponse<long>>> Add(DtoResponseCategory model, CancellationToken ct = default)
        {
            model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoResponseCategory model, CancellationToken ct = default)
        {
            try
            {
                var countCategory = await _contextSql
                                .Category
                                .AsNoTracking()
                                .CountAsync(p => p.Description.ToLower() == model.Description.ToLower() && p.Id != model.Id, ct);
                if (countCategory > 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_009_ERROR_DUPLICATE));
                    return Error <IdResponse<long>> (new OperationExceptions("009", "Ya existe una categoria con ese nombre")); 
                }

                var categoryModel = new Category()
                {
                    Id = model.Id,
                    Description = model.Description
                };
                if (categoryModel.Id == 0)
                {
                    await _contextSql.Category.AddAsync(categoryModel, ct).ConfigureAwait(false);
                }
                else
                {
                    var oldCategory = await _contextSql
                                    .Category
                                    .AsNoTracking()
                                    .FirstAsync(p => p.Id == categoryModel.Id)
                                    .ConfigureAwait(false);
                    _contextSql.Category.Update(categoryModel);
                }
                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

                return Ok(new IdResponse<long>(categoryModel.Id));
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }

        public async Task<OperationResponse<IdResponse<long>>> Update(DtoResponseCategory model, CancellationToken ct = default)
        {
            if (model.Id <= 0)
            {
                _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                return Error<IdResponse<long>>(new OperationExceptions("000", "La Categoria no tiene ID"));
            }

            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        public async Task<OperationResponse<DtoPagination<DtoResponseCategory>>> ListCategory(RequestPaginatedData<string> request)
        {
            try
            {
                var query = _contextSql
                                    .Category
                                    .AsNoTracking()
                                    .Where(p => ((p.Description.ToLower().Contains(request.Filter ?? ""))));

                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderBy(p => p.Id)
                                      .Skip(request.Page * request.PageSize)
                                      .Take(request.PageSize)                                
                                      .ToListAsync()
                                      .ConfigureAwait(false);
                var dto = _mapper.Map<List<DtoResponseCategory>>(list);

                return new OperationResponse<DtoPagination<DtoResponseCategory>>(new DtoPagination<DtoResponseCategory>
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
