using Llaveremos.SharedLibrary.Logs;
using Llaveremos.SharedLibrary.Responses;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using SuggestApi.Application.DTOs;
using SuggestApi.Application.Interfaces;
using SuggestApi.Domain.Entities;
using SuggestApi.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Infrastructure.Repositories
{
    public class SearchHistory(SuggestionDbContext context) : ISearchHistory
    {
        public async Task<Response> DeleteAsync(UserActivity userActivity)
        {
            try
            {
                var data = await FindByIdAsync(userActivity.Id);
                if (data is null) return new Response(false, "error while deleting");

                context.UserActivities.Remove(data);
                await context.SaveChangesAsync();

                return new Response(true, "historial removed");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new Response(false, "error while deleting");
            }
        }

        public async Task<Response> EditAsync(UserActivity userActivityDTO)
        {
            try
            {
                var data = await FindByIdAsync(userActivityDTO.Id);
                if (data is null) return new Response(false, "Data not found");

                context.Entry(data).State = EntityState.Detached;
                context.UserActivities.Update(userActivityDTO);

                await context.SaveChangesAsync();

                return new Response(true, "Data edited");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new Response(false, "error while editing");
            }
        }

        public async Task<UserActivity> FindByIdAsync(int id)
        {
            try
            {
                var data = await context.UserActivities.FindAsync(id);
                if (data is null) return null!;
                return data;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("error in getting by id");
            }
        }

        public async Task<List<UserActivity>> GetByCriteriaAsync(Expression<Func<UserActivity, bool>> predicate)
        {
            try
            {
                var data = await context.UserActivities.Where(predicate).ToListAsync();
                if (data is null) return null!;

                return data;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("error while getting the specific data");
            }
        }

        public async Task<Response> SaveAsync(UserActivity userActivity)
        {
            try
            {
                var data = context.UserActivities.Add(userActivity).Entity;
                await context.SaveChangesAsync();

                if (data is null) return new Response(false, "Error while creating historial");
                return new Response(true, "historial saved");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new Response(false, "Error while saving historial");
            }
        }
    }
}
