using AutoMapper;
using Kiltex.SistemaGestion.Domain;
using Kiltex.SistemaGestion.SDK.Error;
using Kiltex.SistemaGestion.Services.Common;
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
    }
}
