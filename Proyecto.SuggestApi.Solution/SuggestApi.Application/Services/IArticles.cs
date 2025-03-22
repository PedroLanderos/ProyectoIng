using SuggestApi.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Application.Services
{
    public interface IArticles
    {
        Task<IEnumerable<ArticleDTO>> GetArticleAsync(string query);
        Task<IEnumerable<ArticleDTO>> SearchArticlesByFields(IEnumerable<string> fieldsToSearch);
    }
}
