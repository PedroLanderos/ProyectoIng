using ArticlesApi.Application.Interfaces;
using ArticlesApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArticlesApi.Infrastructure.Infrastructure
{
    public class ArticleRepository : IArticle
    {
        public Task<Article> GetArticleByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Article>> SearchArticlesAsync(string query, int page, int pageSize)
        {
            throw new NotImplementedException();
        }
    }
}
