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
        private readonly HttpClient _http;
        private readonly List<string> _apiKeys;
        private readonly object _lock = new();
        private int _idx;

        public ArticleRepository(HttpClient http, IConfiguration cfg)
        {
            _http = http;
            _apiKeys = cfg.GetSection("CoreApi:ApiKeys").Get<List<string>>() ?? new();
            if (!_apiKeys.Any())
                throw new InvalidOperationException("No API keys configured for CORE API");
        }
        private string NextKey()
        {
            lock (_lock)
            {
                _idx = (_idx + 1) % _apiKeys.Count;
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine($"🔄 Usando API key index {_idx} ({_apiKeys[_idx][..6]}…)");
                Console.ResetColor();
                return _apiKeys[_idx];
            }
        }

        private static readonly JsonSerializerSettings _json = new()
        {
            MissingMemberHandling = MissingMemberHandling.Ignore
        };

        private async Task<CoreApiResponse<ArticleDto>?> DoSearchAsync(string q, int offset, int limit)
        {
            // Excluimos documentType para evitar el fallo del servidor.
            string url = $"https://api.core.ac.uk/v3/search/works?" +
                         $"q={Uri.EscapeDataString(q)}&offset={offset}&limit={limit}&exclude=documentType";

            var req = new HttpRequestMessage(HttpMethod.Get, url);
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", NextKey());

            HttpResponseMessage rsp = await _http.SendAsync(req);
            string json = await rsp.Content.ReadAsStringAsync();

            if (!rsp.IsSuccessStatusCode)
            {
                LogException.LogExceptions(new Exception($"CORE API {rsp.StatusCode}: {json}"));
                return null;
            }

            return JsonConvert.DeserializeObject<CoreApiResponse<ArticleDto>>(json, _json);
        }

        public async Task<Article?> GetArticleByIdAsync(string id)
        {
            var req = new HttpRequestMessage(HttpMethod.Get, $"https://api.core.ac.uk/v3/works/{id}?exclude=documentType");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", NextKey());

            var rsp = await _http.SendAsync(req);
            if (rsp.StatusCode == System.Net.HttpStatusCode.NotFound) return null;

            rsp.EnsureSuccessStatusCode();

            string json = await rsp.Content.ReadAsStringAsync();
            var dto = JsonConvert.DeserializeObject<ArticleDto>(json, _json);

            return Convert(dto!);
        }
        public async Task<CoreApiResponse<Article>> SearchArticlesAsync(string term, int page, int size)
        {
            int offset = (page - 1) * size;
            string clean = term.Trim();

            // 1️⃣ consulta sin campos (la que devolvía más resultados antes)
            var dto = await DoSearchAsync(clean, offset, size);
            if (dto?.TotalHits > 0) return Map(dto);

            // 2️⃣ consulta combinada (title OR abstract OR fullText)
            string esc = clean.Contains(' ') ? $"\"{clean}\"" : clean;
            string combo = $"(title:{esc} OR abstract:{esc} OR fullText:{esc})";
            dto = await DoSearchAsync(combo, offset, size);
            if (dto?.TotalHits > 0) return Map(dto);

            // 3️⃣ fallbacks individuales
            foreach (string fld in new[] { "title", "abstract", "fullText" })
            {
                string expr = $"{fld}:{esc}";
                dto = await DoSearchAsync(expr, offset, size);
                if (dto?.TotalHits > 0) return Map(dto);
            }

            throw new Exception("No results returned by CORE API");
        }

        private static CoreApiResponse<Article> Map(CoreApiResponse<ArticleDto> d)
            => new()
            {
                TotalHits = d.TotalHits,
                Limit = d.Limit,
                Offset = d.Offset,
                Results = d.Results.Select(Convert).ToList()
            };

        private static Article Convert(ArticleDto d) => new()
        {
            Id = d.id,
            Title = d.title,
            Abstract = d.@abstract,
            PublishedDate = d.publishedDate,
            DownloadUrl = d.downloadUrl,
            FullText = d.fullText,
            YearPublished = d.yearPublished ?? 0,
            Authors = d.authors?.Select(a => new Author { Name = a.name }).ToList() ?? new(),
            Subjects = d.subjects ?? new(),
            Links = d.links ?? new()
        };
    }
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
    public class AuthorDto { public string? name { get; set; } }
}
