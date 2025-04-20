using Llaveremos.SharedLibrary.Logs;
using Newtonsoft.Json;
using SuggestApi.Application.DTOs;
using SuggestApi.Application.Interfaces;
using System.Net.Http;
using System.Threading.Tasks;

namespace SuggestApi.Application.Services
{
    public class Article : IArticles
    {
        private readonly HttpClient _httpClient;

        public Article(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<ArticleDTO>> GetArticleAsync(string query)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/api/article/search?query={query}&page=1&pageSize=5");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var wrapper = JsonConvert.DeserializeObject<ArticleSearchResponseDTO>(json);
                return wrapper?.Results ?? new List<ArticleDTO>();
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("error in the articles service");
            }
        }

        public async Task<IEnumerable<ArticleDTO>> SearchArticlesByFields(IEnumerable<string> fieldsToSearch)
        {
            try
            {
                var query = string.Join(" ", fieldsToSearch);
                var response = await _httpClient.GetAsync($"/api/article/search?query={query}&page=1&pageSize=5");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var wrapper = JsonConvert.DeserializeObject<ArticleSearchResponseDTO>(json);
                return wrapper?.Results ?? new List<ArticleDTO>();
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("error in the articles service");
            }
        }
    }

    public class ArticleSearchResponseDTO
    {
        [JsonProperty("results")]
        public List<ArticleDTO> Results { get; set; } = new();
    }
}
