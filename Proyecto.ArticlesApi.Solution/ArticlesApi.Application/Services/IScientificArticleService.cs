using ArticlesApi.Domain.Entities;
using ArticlesApi.Application.Responses;

namespace ArticlesApi.Application.Interfaces
{
    public interface IScientificArticleService
    {
        Task<Article> GetArticleByIdAsync(string id);
        Task<CoreApiResponse<Article>> SearchArticlesAsync(string query, int page, int pageSize, string author, int? year, string subject);
    }
}
