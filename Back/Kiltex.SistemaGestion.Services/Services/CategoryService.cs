

using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class CategoryService : BaseService
    {
        public CategoryService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        { }

     
        //Get Categoria
        public async Task<OperationResponse<DtoCategory>> GetById(long id)
        {
            var categoria = await _contextSql
                                .Category
                                .AsNoTracking()
                                .FirstOrDefaultAsync(p => p.Id == id)
                                .ConfigureAwait(false);
            if (categoria == null)

                return new OperationResponse<DtoCategory>(null, false, new OperationExceptions("000", $"Usuario no encontrado {id}"));

            var result = new DtoCategory()
            {
                Id = id,
              Description = categoria.Description
            };

            return new OperationResponse<DtoCategory>(result);
        }
        public async Task<OperationResponse<IdResponse<long>>> Add(DtoCategory model, CancellationToken ct = default)
        {
            model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(DtoCategory model, CancellationToken ct = default)
        {
            var countCategory = await _contextSql
                                .Category
                                .AsNoTracking()
                                .CountAsync(p => p.Description.ToLower() == model.Description.ToLower() && p.Id != model.Id, ct);
            if (countCategory > 0)
            {
                return Error<IdResponse<long>>(ErrorsCodes.C_009_ERROR_DUPLICATE, "Ya existe una categoria con ese nombre");
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

        public async Task<OperationResponse<IdResponse<long>>> Update(DtoCategory model, CancellationToken ct = default)
        {
            if (model.Id <= 0)
            {
                return Error<IdResponse<long>>("000", "La Categoria no tiene ID");
            }

            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        public async Task<OperationResponse<DtoPagination<DtoCategory>>> ListCategory(RequestPaginatedData<string> request)
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
            var dto = _mapper.Map<List<DtoCategory>>(list);

            return new OperationResponse<DtoPagination<DtoCategory>>(new DtoPagination<DtoCategory>
            {
                Data = dto,
                PageSize = request.PageSize,
                TotalCount = count
            });
        }
    }
}
