using ArticlesApi.Application.Interfaces;
using ArticlesApi.Domain.Entities;
using Llaveremos.SharedLibrary.Logs;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using ArticlesApi.Application.Responses;

namespace ArticlesApi.Infrastructure.Infrastructure
{
    public class ArticleRepository : IArticle
    {
        private readonly HttpClient? _httpClient;
        private readonly string? _apiKey = null;

        public ArticleRepository(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Article> GetArticleByIdAsync(string id)
        {
            try
            {
                var response = await _httpClient!.GetAsync($"https://api.core.ac.uk/v3/works/{id}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var article = JsonConvert.DeserializeObject<Article>(json);

                return article!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex); 
                throw new Exception("Error while getting an article by id");
            }
        }

        public async Task<IEnumerable<Article>> SearchArticlesAsync(string query, int page, int pageSize)
        {
            try
            {
                int offset = (page - 1) * pageSize;
                var response = await _httpClient!.GetAsync($"https://api.core.ac.uk/v3/search/works?q={query}&offset={offset}&limit={pageSize}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<CoreApiResponse<Article>>(json);

                return result!.Results!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Error (infrastructure) while getting articles");
            }
        }
    }
}
