using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Dtos;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class RolService : BaseService
    {
        public RolService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)
        { }

        public async Task<OperationResponse<IdResponse<long>>> Add(RequestAddRol model, CancellationToken ct = default)
        {
            model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
   
        public async Task<OperationResponse<List<DtoRol>>> ListRoles(CancellationToken ct = default)
        {
            return new OperationResponse<List<DtoRol>>(
                await _contextSql
                        .Rols
                        .AsNoTracking()
                        .Select(p => new DtoRol()
                        {
                            Id = p.Id,
                            Name = p.Name,
                        }).ToListAsync(cancellationToken: ct));
        }
        //Agregar o actualizar Rol
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(RequestAddRol model, CancellationToken ct = default)
        {
            var countRols = await _contextSql
                                .Rols
                                .AsNoTracking()
                                .CountAsync(p => p.Name.ToLower() == model.Name.ToLower() && p.Id != model.Id, ct);
            if (countRols > 0)
            {
                return Error<IdResponse<long>>(ErrorsCodes.C_009_ERROR_DUPLICATE, "Ya existe un Rol con ese nombre");
            }

            var rolmodel = new Rol()
            {
                Id = model.Id,
                Name = model.Name,
                Key = model.Key
            };
            if (rolmodel.Id == 0)
            {
                await _contextSql.Rols.AddAsync(rolmodel, ct).ConfigureAwait(false);
            }
            else
            {            
               var oldRol = await _contextSql
                               .Rols
                               .AsNoTracking()
                               .FirstAsync(p => p.Id == rolmodel.Id)
                               .ConfigureAwait(false);  
                
                    _contextSql.Rols.Update(rolmodel);
            }
            await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

            return Ok(new IdResponse<long>(rolmodel.Id));
        }
        public async Task<OperationResponse<IdResponse<long>>> Update(RequestAddRol model, CancellationToken ct = default)
        {
            if (model.Id <= 0)
            {
                return Error<IdResponse<long>>("000", "El Rol no tiene ID");
            }

            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        //Get Rol
        public async Task<OperationResponse<DtoRol>> GetById(long id)
        {
            var rol = await _contextSql
                                .Rols
                                .AsNoTracking()
                                .FirstOrDefaultAsync(p => p.Id == id)
                                .ConfigureAwait(false);
            if (rol == null)

                return new OperationResponse<DtoRol>(null, false, new OperationExceptions("000", $"Rol no encontrado {id}"));

            var result = new DtoRol()
            {
                Id = id,
                Name = rol.Name,
                Key = rol.Key,
             
            };

            return new OperationResponse<DtoRol>(result);
        }
        //get Lista de Roles
        public async Task<OperationResponse<List<DtoPermission>>> ListPermissions(CancellationToken ct = default)
        {       

            return new OperationResponse<List<DtoPermission>>(
                await _contextSql
                    .Permissions
                    .AsNoTracking()
                    .Select(p => new DtoPermission()
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Key = p.Key
                    }).ToListAsync(cancellationToken: ct));
        }
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdatePermission(RequestAddPermissionXRol model, CancellationToken ct= default)
        {
            var rolesExistentes = await _contextSql
                                    .Rols
                                    .FirstOrDefaultAsync(p => p.Id == model.Id);

            if (rolesExistentes == null)
            {
                return Error<IdResponse<long>>(ErrorsCodes.C_009_ERROR_DUPLICATE, "No existe un Rol con ese nombre");
            }

            var oldPermission = await _contextSql.PermissionXRols.Where(p => p.RoleId == model.Id).ToListAsync(cancellationToken: ct);
            _contextSql.PermissionXRols.RemoveRange(oldPermission);

            var permissions = new PermissionXRol();
            foreach (var newPermission in model.PermissionIds)
            {
                var isPermissions = await _contextSql.Permissions.FirstOrDefaultAsync(p => p.Id == newPermission);

                if (isPermissions != null)
                {
                     permissions = new PermissionXRol()
                    {
                        RoleId = model.Id,
                        PermissionId = newPermission
                    };
                    await _contextSql.PermissionXRols.AddAsync(permissions, ct).ConfigureAwait(false);
                }
            }

            await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);    

            return Ok(new IdResponse<long>(permissions.Id));
        }
    }
}
