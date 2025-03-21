using Llaveremos.SharedLibrary.Responses;
using SuggestApi.Application.DTOs;
using SuggestApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Application.Interfaces
{
    public interface ISearchHistory
    {
        Task<Response> SaveAsync(UserActivityDTO userActivity);
        Task<Response> EditAsync(UserActivityDTO userActivityDTO);
        Task<Response> DeleteAsync(UserActivityDTO userActivityDTO);
        Task<List<UserActivity>> GetByCriteriaAsync(Expression<Func<UserActivity, bool>> predicate);
        Task<List<ArticleDTO>> SetSuggestionAsync();
    }
}
