using Llaveremos.SharedLibrary.Logs;
using SuggestApi.Application.DTOs;
using SuggestApi.Application.Interfaces;
using System.Net.Http.Json;

namespace SuggestApi.Application.Services
{
    public class Suggestion : ISuggestion
    {
        private readonly HttpClient _client;
        private readonly ISearchHistory _searchHistoryRepository;
        private readonly IArticles _articlesService;
        private readonly IHeap _heapService;

        // Control por usuario: última vez que se usaron palabras frecuentes
        private static readonly Dictionary<int, DateTime> _frequentWordsUsedAt = new();

        public Suggestion(HttpClient client, ISearchHistory searchHistoryRepository, IArticles articlesService, IHeap heapService)
        {
            _client = client;
            _searchHistoryRepository = searchHistoryRepository;
            _articlesService = articlesService;
            _heapService = heapService;
        }

        public async Task<IEnumerable<ArticleDTO>> GetRecommendations(int userId)
        {
            try
            {
                var userActivities = await _searchHistoryRepository.GetByCriteriaAsync(x => x.UserId == userId);
                if (!userActivities.Any()) return new List<ArticleDTO>();

                const string clave = "aXv92Lk01Zm48Tyz";

                var titulos = new List<string>();
                foreach (var activity in userActivities)
                {
                    try
                    {
                        var titulo = _heapService.Decipher(activity.ArticleId!, clave);
                        if (!string.IsNullOrWhiteSpace(titulo))
                            titulos.Add(titulo);
                    }
                    catch (Exception ex)
                    {
                        LogException.LogToConsole($"❌ No se pudo descifrar ArticleId: {activity.ArticleId}. Error: {ex.Message}");
                    }
                }

                if (!titulos.Any())
                {
                    LogException.LogToConsole($"⚠️ No se pudieron descifrar títulos para el usuario {userId}");
                    return new List<ArticleDTO>();
                }

                var textoUnido = string.Join(" ", titulos);
                var heap = _heapService.CreateHeap(textoUnido);

                if (!heap.Any())
                {
                    LogException.LogToConsole($"⚠️ Heap vacío generado para usuario {userId}");
                    return new List<ArticleDTO>();
                }

                List<string> keywords;
                var now = DateTime.UtcNow;

                bool usarFrecuentes = !_frequentWordsUsedAt.ContainsKey(userId) ||
                                      (now - _frequentWordsUsedAt[userId]) > TimeSpan.FromMinutes(30);

                if (usarFrecuentes || heap.Count <= 3)
                {
                    // Usar las más frecuentes
                    keywords = heap.Keys.Take(Math.Min(3, heap.Count)).ToList();
                    _frequentWordsUsedAt[userId] = now;
                }
                else
                {
                    // Usar palabras aleatorias (solo si hay suficientes)
                    var random = new Random();
                    var shuffled = heap.Keys.OrderBy(_ => random.Next()).ToList();
                    keywords = shuffled.Take(3).ToList();
                }

                var recomendados = await _articlesService.SearchArticlesByFields(keywords);

                var resultado = recomendados
                    .DistinctBy(a => a.Id)
                    .Take(3)
                    .Select(a => new ArticleDTO
                    {
                        Id = a.Id,
                        Title = a.Title,
                        Authors = a.Authors,
                        Abstract = a.Abstract,
                        PublishedDate = a.PublishedDate,
                        DownloadUrl = a.DownloadUrl,
                        ViewUrl = a.ViewUrl,
                        Subjects = a.Subjects,
                        Links = a.Links
                    })
                    .ToList();

                if (!resultado.Any())
                {
                    LogException.LogToConsole($"⚠️ No se encontraron recomendaciones para el usuario {userId}");
                }

                return resultado;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Error while setting the recommendation");
            }
        }

        public async Task<UserDTO> Getuser(int userId)
        {
            var getuser = await _client.GetAsync($"{userId}");
            if (!getuser.IsSuccessStatusCode)
                return null!;

            var product = await getuser.Content.ReadFromJsonAsync<UserDTO>();
            return product!;
        }

        public async Task<string> PingAuthentication()
        {
            try
            {
                var response = await _client.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    LogException.LogToConsole("✅ AuthenticationApi reachable from SuggestionApi");
                    return "AuthenticationApi reachable ✅";
                }
                else
                {
                    LogException.LogToConsole($"❌ AuthenticationApi unreachable. Status: {response.StatusCode}");
                    return $"AuthenticationApi unreachable ❌ (Status: {response.StatusCode})";
                }
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return $"AuthenticationApi unreachable ❌ ({ex.Message})";
            }
        }

        public async Task<string> PingArticles()
        {
            try
            {
                var response = await _articlesService.GetArticleAsync("test-id");
                if (response.Any())
                {
                    LogException.LogToConsole("✅ ArticlesApi reachable from SuggestionApi");
                    return "ArticlesApi reachable ✅";
                }
                else
                {
                    LogException.LogToConsole("⚠️ ArticlesApi responded but no articles found.");
                    return "ArticlesApi responded ⚠️";
                }
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return $"ArticlesApi unreachable ❌ ({ex.Message})";
            }
        }
    }
}
