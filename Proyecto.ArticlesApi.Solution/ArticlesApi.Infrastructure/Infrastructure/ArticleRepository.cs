using ArticlesApi.Application.Interfaces;
using ArticlesApi.Domain.Entities;
using ArticlesApi.Application.Responses;
using Llaveremos.SharedLibrary.Logs;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

namespace ArticlesApi.Infrastructure.Infrastructure
{
    public class ArticleRepository : IArticle
    {
        private readonly HttpClient _httpClient;
        private readonly string? _apiKey;

        public ArticleRepository(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["CoreApi:ApiKey"];
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<Article> GetArticleByIdAsync(string id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"https://api.core.ac.uk/v3/works/{id}");

                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    throw new InvalidOperationException("Rate limit exceeded");
                }

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

        public async Task<CoreApiResponse<Article>> SearchArticlesAsync(string query, int page, int pageSize)
        {
            try
            {
                int offset = (page - 1) * pageSize;
                var url = $"https://api.core.ac.uk/v3/search/works?q={Uri.EscapeDataString(query)}&offset={offset}&limit={pageSize}";
                var response = await _httpClient.GetAsync(url);

                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    throw new InvalidOperationException("Rate limit exceeded");
                }

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
