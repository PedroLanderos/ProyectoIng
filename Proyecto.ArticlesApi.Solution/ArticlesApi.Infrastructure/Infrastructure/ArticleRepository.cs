using ArticlesApi.Application.Interfaces;
using ArticlesApi.Domain.Entities;
using Llaveremos.SharedLibrary.Logs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using System.Threading.Tasks;

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

        public Task<Article> GetArticleByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Article>> SearchArticlesAsync(string query, int page, int pageSize)
        {
            try
            {
                int offset = (page - 1) * pageSize;
                var response = await _httpClient.GetAsync($"https://api.core.ac.uk/v3/search/works?q={query}&offset={offset}&limit={pageSize}&api_key={_apiKey}");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonConverter.DeserializeObject<CoreApiResponse>(json);

                return result.Results.Select(article => new Article
                {
                    Id = article.Id,
                    Title = article.Title,
                    Authors = article.Authors?.Select(a => a.Name).ToList() ?? new List<string>(),
                    Abstract = article.Abstract,
                    PublishedDate = article.PublishedDate,
                    DownloadUrl = article.DownloadUrl,
                    ViewUrl = article.Links?.FirstOrDefault(l => l.Type == "display")?.Url,
                    FullText = article.FullText,
                    Subjects = article.Subjects,
                    YearPublished = article.YearPublished
                }).ToList();
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Error (infrastructure) while getting articles");
            }
        }
    }
}
