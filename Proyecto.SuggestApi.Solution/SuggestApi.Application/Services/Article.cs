using Llaveremos.SharedLibrary.Logs;
using Newtonsoft.Json;
using SuggestApi.Application.DTOs;
using SuggestApi.Application.Interfaces;
using System.Net.Http;

namespace SuggestApi.Application.Services
{
    public class Article : IArticles
    {
        private readonly HttpClient _httpClient;

        public Article(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<ArticleDTO>> GetArticleAsync(string id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{id}");

                Console.WriteLine($"🔍 Intentando obtener artículo {id} - StatusCode: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"⚠️ Error al obtener artículo: {errorContent}");
                    return new List<ArticleDTO>();
                }

                var json = await response.Content.ReadAsStringAsync();
                var article = JsonConvert.DeserializeObject<ArticleDTO>(json);
                return article is not null ? new List<ArticleDTO> { article } : new List<ArticleDTO>();
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new List<ArticleDTO>();
            }
        }

        public async Task<IEnumerable<ArticleDTO>> SearchArticlesByFields(IEnumerable<string> fieldsToSearch)
        {
            try
            {
                var query = string.Join(" ", fieldsToSearch.Where(f => !string.IsNullOrWhiteSpace(f)));

                if (query.Length > 300)
                    query = query[..300];

                var encodedQuery = Uri.EscapeDataString(query);

                var response = await _httpClient.GetAsync($"search?query={encodedQuery}&page=1&pageSize=5");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var wrapper = JsonConvert.DeserializeObject<ArticleSearchResponseDTO>(json);
                return wrapper?.Results ?? new List<ArticleDTO>();
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return new List<ArticleDTO>();
            }
        }
    }

    public class ArticleSearchResponseDTO
    {
        [JsonProperty("results")]
        public List<ArticleDTO> Results { get; set; } = new();
    }
}
