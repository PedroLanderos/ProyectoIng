using ArticlesApi.Application.Interfaces;
using ArticlesApi.Domain.Entities;
using ArticlesApi.Application.Responses;
using Llaveremos.SharedLibrary.Logs;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;

namespace ArticlesApi.Infrastructure.Infrastructure
{
    public class ArticleRepository : IArticle
    {
        private readonly HttpClient _httpClient;
        private readonly List<string> _apiKeys;
        private int _currentApiKeyIndex = 0;
        private readonly object _lock = new();

        public ArticleRepository(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKeys = config.GetSection("CoreApi:ApiKeys").Get<List<string>>() ?? new List<string>();

            if (!_apiKeys.Any())
                throw new InvalidOperationException("No API keys configured for Core API");
        }

        private void RotateApiKey()
        {
            lock (_lock)
            {
                _currentApiKeyIndex = (_currentApiKeyIndex + 1) % _apiKeys.Count;
                var currentKey = _apiKeys[_currentApiKeyIndex];
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", currentKey);

                // ✅ Opcional: Log para ver cuál key se está usando
                Console.WriteLine($"🔄 Usando API key index: {_currentApiKeyIndex}");
            }
        }

        public async Task<Article> GetArticleByIdAsync(string id)
        {
            try
            {
                RotateApiKey(); // 🔁 Rota siempre antes de cada request

                var response = await _httpClient.GetAsync($"https://api.core.ac.uk/v3/works/{id}");

                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    return null!;

                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var article = JsonConvert.DeserializeObject<Article>(json);
                return article!;
            }
            catch (JsonException ex)
            {
                LogException.LogExceptions(ex);
                Console.WriteLine("❌ No se pudo deserializar la respuesta de CORE.");
                return null!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Error while getting an article by id");
            }
        }

        public async Task<CoreApiResponse<Article>> SearchArticlesAsync(string query, int page, int pageSize)
        {
            try
            {
                RotateApiKey(); // 🔁 Rota siempre antes de cada request

                int offset = (page - 1) * pageSize;
                var url = $"https://api.core.ac.uk/v3/search/works?q={Uri.EscapeDataString(query)}&offset={offset}&limit={pageSize}";

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<CoreApiResponse<Article>>(json);
                return result!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw;
            }
        }
    }
}
