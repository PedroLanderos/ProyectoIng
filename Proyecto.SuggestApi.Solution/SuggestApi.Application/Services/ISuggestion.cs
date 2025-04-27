using SuggestApi.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Application.Services
{
    public interface ISuggestion
    {
        Task<IEnumerable<ArticleDTO>> GetRecommendations(int userId);
        Task<string> PingAuthentication();   
        Task<string> PingArticles();
    }
}
