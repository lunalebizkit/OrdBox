using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.Domain.Model;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.SDK.Security;
using Kiltex.SistemaGestion.Services.Common;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoRequest;
using Kiltex.SistemaGestion.Services.Models.Dtos.DtoResponse;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Kiltex.SistemaGestion.Services.Services
{
    public class UserService : BaseService

    {
        private readonly EmailService _emailService;
        public UserService(ErrorManager logger, DBContext context, IMapper maper, IConfiguration configuration, EmailService emailService) :
            base(logger, context, maper, configuration)

        {
            this._emailService = emailService;
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
                         .ThenInclude(y => y.PermissionXRols)
                         .ThenInclude(y => y.Permission)
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
        public async Task<OperationResponse<DtoResponseUser>> GetById(long id)
        {
            try
            {
                var user = await _contextSql
                                    .Users
                                    .Include(p => p.Rol)
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
                                    .ConfigureAwait(false);

                if (user == null)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_S002_CLIENTID_INVALIDO));
                    return Error<DtoResponseUser>(new OperationExceptions("001", "El usuario no es valido"));
                }

                var result = _mapper.Map<DtoResponseUser>(user);
                return new OperationResponse<DtoResponseUser>(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
        //get Lista Usuario
        public async Task<OperationResponse<DtoPagination<DtoResponseUser>>> ListUsers(RequestPaginatedData<string> request)
        {
            try
            {
                var query = _contextSql
                                    .Users.Include(P => P.Rol)
                                    .AsNoTracking()
                                    .Where(p => ((p.FirstName.ToLower().Contains(request.Filter ?? "")) || (p.LastName.ToLower().Contains(request.Filter ?? "")))
                                                  && !p.IsDeleted);


                var count = await query.CountAsync().ConfigureAwait(false);

                var list = await query.OrderBy(p => p.FirstName)
                                      .Skip(request.Page * request.PageSize)
                                      //.Take(request.PageSize)                                
                                      .ToListAsync()
                                      .ConfigureAwait(false);
                var dto = _mapper.Map<List<DtoResponseUser>>(list);

                return new OperationResponse<DtoPagination<DtoResponseUser>>(new DtoPagination<DtoResponseUser>
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

        //Agregar o actualizar usuario
        public async Task<OperationResponse<IdResponse<long>>> AddOrUpdate(RequestAddUser model, CancellationToken ct = default)
        {
            try
            {
                var countEmails = await _contextSql
                                    .Users
                                    .AsNoTracking()
                                    .CountAsync(p => p.Email.ToLower() == model.Email.ToLower() && p.Id != model.Id && !p.IsDeleted && p.UserName == model.UserName, ct);
                if (countEmails > 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_009_ERROR_DUPLICATE));
                    return Error<IdResponse<long>>(new OperationExceptions("009", "Ya existe un usuario con ese correo"));
                }

                var usermodel = _mapper.Map<User>(model);

                var email = await _emailService.SendUser(model.Email, model.UserName, model.Password);

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
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_010_ERROR_EXCEPTION), ex);
                throw;
            }

        }
        //Actualizar usuario
        public async Task<OperationResponse<IdResponse<long>>> Update(RequestAddUser model, CancellationToken ct = default)
        {
            try
            {
                if (model.Id <= 0)
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO));
                    return Error<IdResponse<long>>(new OperationExceptions("000", "El usuario no tiene ID"));
                }

                return await AddOrUpdate(model, ct).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }
        //Elimianr usuario
        public async Task<OperationResponse<IdResponse<long>>> Delete(long id, CancellationToken ct = default)
        {
            try
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
                else
                {
                    _logger.LogWarning(ErrorsMessages.GetMessage(ErrorsCodes.C_002_CLIENTE_INACTIVO));
                    return Error<IdResponse<long>>(new OperationExceptions(ErrorsCodes.C_002_CLIENTE_INACTIVO, ErrorsMessages.GetMessage(ErrorsCodes.C_002_CLIENTE_INACTIVO)));
                }

                return Ok(new IdResponse<long>(id));

            }
            catch (Exception ex)
            {
                _logger.LogError(ErrorsMessages.GetMessage(ErrorsCodes.C_000_MENSAJE_INVALIDO), ex: ex);
                throw;
            }
        }


    }
}
