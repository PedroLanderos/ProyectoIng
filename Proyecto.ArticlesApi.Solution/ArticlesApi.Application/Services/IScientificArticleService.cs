using ArticlesApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArticlesApi.Application.Services
{
    public interface IScientificArticleService
    {
        Task<IEnumerable<Article>> SearchArticlesAsync(string query, int page, int pageSize, string author, int? year, string subject);
        Task<Article> GetArticleByIdAsync(string id);
    }
}
