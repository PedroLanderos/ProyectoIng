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

        private string GetNextApiKey()
        {
            lock (_lock)
            {
                _currentApiKeyIndex = (_currentApiKeyIndex + 1) % _apiKeys.Count;
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine($"🔄 Usando API key index: {_currentApiKeyIndex} ({_apiKeys[_currentApiKeyIndex][..6]}...)");
                Console.ResetColor();
                return _apiKeys[_currentApiKeyIndex];
            }
        }

        public async Task<Article> GetArticleByIdAsync(string id)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.core.ac.uk/v3/works/{id}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetNextApiKey());

                var response = await _httpClient.SendAsync(request);
                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    return null!;

                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var dto = JsonConvert.DeserializeObject<ArticleDto>(json);

                return ConvertToDomain(dto!);
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

                var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", GetNextApiKey());

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var dtoResponse = JsonConvert.DeserializeObject<CoreApiResponse<ArticleDto>>(json);

                var domainResponse = new CoreApiResponse<Article>
                {
                    TotalHits = dtoResponse!.TotalHits,
                    Results = dtoResponse.Results.Select(ConvertToDomain).ToList()
                };

                return domainResponse;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw;
            }
        }

        private Article ConvertToDomain(ArticleDto dto)
        {
            return new Article
            {
                Id = dto.id,
                Title = dto.title,
                Abstract = dto.@abstract,
                PublishedDate = dto.publishedDate,
                DownloadUrl = dto.downloadUrl,
                FullText = dto.fullText,
                YearPublished = dto.yearPublished ?? 0,
                Authors = dto.authors?.Select(a => new Author { Name = a.name }).ToList() ?? new(),
                Subjects = dto.subjects ?? new(),
                Links = dto.links ?? new()
            };
        }
    }

    // DTOs actualizados según la respuesta real de CORE
    public class ArticleDto
    {
        public string? id { get; set; }
        public string? title { get; set; }
        public List<AuthorDto>? authors { get; set; }
        public string? @abstract { get; set; }
        public string? publishedDate { get; set; }
        public string? downloadUrl { get; set; }
        public List<Links>? links { get; set; }
        public string? fullText { get; set; }
        public List<string>? subjects { get; set; }
        public int? yearPublished { get; set; }
    }

    public class AuthorDto
    {
        public string? name { get; set; }
    }
}
