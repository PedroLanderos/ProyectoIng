using ArticlesApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArticlesApi.Application.Interfaces
{
    public interface IArticle
    {
        Task<IEnumerable<Article>> SearchArticlesAsync(string query, int page, int pageSize);
        Task<Article> GetArticleByIdAsync(string id);
    }
}
