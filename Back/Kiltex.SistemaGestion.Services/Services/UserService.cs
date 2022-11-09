using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.SDK.Security;
using Kiltex.SistemaGestion.Services.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Dtos;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class UserService : BaseService
    {
        public UserService(ErrorManager logger, DBContext context, IMapper maper) :
            base(logger, context, maper)

        {

        }
        //Login de Usuario
        public async Task<OperationResponse<User>> GetUserLogin(string userName, string password)
        {
            try
            {
                var user = await _contextSql
                         .Users
                         .AsNoTracking()
                         .Include(x => x.Rol)
                         .FirstOrDefaultAsync(x => x.UserName == userName && !x.IsDeleted)
                         .ConfigureAwait(false);
               

                if (user == null || !SecurePasswordHasher.Verify(password, user.Password))
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_S002_CLIENTID_INVALIDO), userName);
                    return Error<User>(new OperationExceptions("001", "El usuario no es valido"));

                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
         
        }
        //Agregar usuario nuevo
        public async Task<OperationResponse<IdResponse<long>>> Add(RequestAddUser model, CancellationToken ct = default)
        {
            model.Id = 0;
            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        //Get usuario
        public async Task<OperationResponse<DtoUser>> GetById(long id)
        {
            var user = await _contextSql
                                .Users
                                .Include(p => p.Rol)
                                .AsNoTracking()
                                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
                                .ConfigureAwait(false);
            if (user == null)
                
                return new OperationResponse<DtoUser>(null, false, new OperationExceptions("000", $"Usuario no encontrado {id}"));

            var result = new DtoUser()
            {
                Id = id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                RoleId = user.RoleId
            };

            return new OperationResponse<DtoUser>(result);
        }
        //get Lista Usuario
        public async Task<OperationResponse<DtoPagination<DtoUser>>> ListUsers(RequestPaginatedData<string> request)
        {
            var query = _contextSql
                                .Users
                                .AsNoTracking()
                                .Where(p => ((p.FirstName.ToLower().Contains(request.Filter ?? "")) || (p.LastName.ToLower().Contains(request.Filter ?? "")))
                                              && !p.IsDeleted);

            var count = await query.CountAsync().ConfigureAwait(false);

            var list = await query.OrderBy(p => p.FirstName)
                                  .Skip(request.Page * request.PageSize)
                                  //.Take(request.PageSize)                                
                                  .ToListAsync()
                                  .ConfigureAwait(false);
            var dto = _mapper.Map<List<DtoUser>>(list);

            return new OperationResponse<DtoPagination<DtoUser>>(new DtoPagination<DtoUser>
            {
                Data = dto,
                PageSize = request.PageSize,
                TotalCount = count
            });
        }

        //Agregar o actualizar usuario
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(RequestAddUser model, CancellationToken ct = default)
        {
            var countEmails = await _contextSql
                                .Users
                                .AsNoTracking()
                                .CountAsync(p => p.Email.ToLower() == model.Email.ToLower() && p.Id != model.Id && !p.IsDeleted && p.UserName == model.UserName, ct);
            if (countEmails > 0)
            {
                return Error<IdResponse<long>>(ErrorsCodes.C_009_ERROR_DUPLICATE, "Ya existe un usuario con ese correo");
            }

            var usermodel = new User()
            {
                Id = model.Id,
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.UserName,
                Email = model.Email,
                RoleId = model.RoleId,
                Password = model.Password,
            };
            if (usermodel.Id == 0)
            {
                usermodel.Password = SecurePasswordHasher.Hash(usermodel.Password, 100);
                await _contextSql.Users.AddAsync(usermodel, ct).ConfigureAwait(false);
            }
            else
            {
                if (!String.IsNullOrEmpty(usermodel.Password))
                {
                    usermodel.Password = SecurePasswordHasher.Hash(usermodel.Password, 100);
                    _contextSql.Users.Update(usermodel);
                }

                else
                {
                    var oldUser = await _contextSql
                               .Users
                               .AsNoTracking()
                               .FirstAsync(p => p.Id == usermodel.Id, ct)
                               .ConfigureAwait(false);

                    usermodel.Password = oldUser.Password;
                    _contextSql.Users.Update(usermodel);
                }

            }
            await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);

            return Ok(new IdResponse<long>(usermodel.Id));
        }
        //Actualizar usuario
        public async Task<OperationResponse<IdResponse<long>>> Update(RequestAddUser model, CancellationToken ct = default)
        {
            if (model.Id <= 0)
            {
                return Error<IdResponse<long>>("000", "El usuario no tiene ID");
            }

            return await AddOrUpdate(model, ct).ConfigureAwait(false);
        }
        //Elimianr usuario
        public async Task<OperationResponse<IdResponse<long>>> Delete(long id, CancellationToken ct = default)
        {
            var user = await _contextSql
                                         .Users
                                         .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted, ct)
                                         .ConfigureAwait(false);
            if (user != null)
            {
                user.IsDeleted = true;

                await _contextSql.SaveChangesAsync(ct).ConfigureAwait(false);
            }

            return Ok(new IdResponse<long>(id));
        }
    }
}
