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

        public Suggestion(HttpClient client, ISearchHistory searchHistoryRepository, IArticles articlesService)
        {
            _client = client;
            _searchHistoryRepository = searchHistoryRepository;
            _articlesService = articlesService;
        }

        public async Task<UserDTO> Getuser(int userId)
        {
            var getuser = await _client.GetAsync($"{userId}");
            if (!getuser.IsSuccessStatusCode)
                return null!;

            var product = await getuser.Content.ReadFromJsonAsync<UserDTO>();
            return product!;
        }

        public async Task<IEnumerable<ArticleDTO>> GetRecommendations(int userId)
        {
            try
            {
                //var userExists = await Getuser(userId);
                //if (userExists is null) return new List<ArticleDTO>();

                var userActivities = await _searchHistoryRepository.GetByCriteriaAsync(x => x.UserId == userId);
                if (!userActivities.Any()) return new List<ArticleDTO>();

                var favoriteActivities = userActivities.Where(x => x.IsFavorite).ToList();
                var nonFavoriteActivities = userActivities.Where(x => !x.IsFavorite).ToList();

                List<ArticleDTO> recommendedArticles = new();

                foreach (var activity in favoriteActivities)
                {
                    var articles = await _articlesService.GetArticleAsync(activity.ArticleId!);
                    recommendedArticles.AddRange(articles);
                }

                foreach (var activity in nonFavoriteActivities)
                {
                    var articles = await _articlesService.GetArticleAsync(activity.ArticleId!);
                    if (articles.Any())
                    {
                        try
                        {
                            var fieldsToSearch = GetRelevantFields(articles.First());
                            var similarArticles = await _articlesService.SearchArticlesByFields(fieldsToSearch);
                            recommendedArticles.AddRange(similarArticles);
                        }
                        catch (Exception ex)
                        {
                            LogException.LogToConsole($"⚠️ No se pudo buscar similares para artículo {activity.ArticleId}: {ex.Message}");
                        }
                    }
                }

                var result = recommendedArticles
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

                if (!result.Any())
                {
                    LogException.LogToConsole($"⚠️ No recommendations found for user {userId}");
                    return new List<ArticleDTO>();
                }

                return result;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Error while setting the recommendation");
            }
        }

        private List<string> GetRelevantFields(ArticleDTO article)
        {
            List<string> fields = new();

            if (!string.IsNullOrWhiteSpace(article.Title))
                fields.Add(article.Title);

            if (article.Authors != null && article.Authors.Any())
                fields.AddRange(article.Authors.Select(a => a.Name).Where(name => !string.IsNullOrWhiteSpace(name)));

            if (!string.IsNullOrWhiteSpace(article.Abstract))
                fields.Add(article.Abstract);

            if (article.Subjects != null && article.Subjects.Any())
                fields.AddRange(article.Subjects.Where(s => !string.IsNullOrWhiteSpace(s)));

            return fields.Take(3).ToList();
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
