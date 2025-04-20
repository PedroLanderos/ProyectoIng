using Llaveremos.SharedLibrary.Logs;
using SuggestApi.Application.DTOs;
using SuggestApi.Application.Interfaces;
using System.Net.Http.Json;

namespace SuggestApi.Application.Services
{
    public class Suggestion(HttpClient client, ISearchHistory _searchHistoryRepository, IArticles _articlesService) : ISuggestion
    {
        public async Task<UserDTO> Getuser(int userId)
        {
            var getuser = await client.GetAsync($"/api/authentication/{userId}");
            if (!getuser.IsSuccessStatusCode)
                return null!;

            var product = await getuser.Content.ReadFromJsonAsync<UserDTO>();
            return product!;
        }

        public async Task<IEnumerable<ArticleDTO>> GetRecommendations(int userId)
        {
            try
            {
                var userExists = await Getuser(userId);
                if (userExists is null) return new List<ArticleDTO>(); // 👈 Devuelve vacío si no existe el user

                var userActivities = await _searchHistoryRepository.GetByCriteriaAsync(x => x.UserId == userId);

                var favoriteActivities = userActivities.Where(x => x.IsFavorite).ToList();
                var nonFavoriteActivities = userActivities.Where(x => !x.IsFavorite).ToList();

                List<ArticleDTO> recommendedArticles = new();

                if (favoriteActivities.Any())
                {
                    foreach (var activity in favoriteActivities)
                    {
                        var articles = await _articlesService.GetArticleAsync(activity.ArticleId!);
                        recommendedArticles.AddRange(articles);
                    }
                }

                foreach (var activity in nonFavoriteActivities)
                {
                    var articles = await _articlesService.GetArticleAsync(activity.ArticleId!);
                    if (articles.Any())
                    {
                        var fieldsToSearch = GetRandomFields(articles.First());
                        var similarArticles = await _articlesService.SearchArticlesByFields(fieldsToSearch);
                        recommendedArticles.AddRange(similarArticles);
                    }
                }

                var result = recommendedArticles.Distinct().Take(5).ToList();

                if (!result.Any())
                {
                    LogException.LogToConsole($"⚠️ No recommendations found for user {userId}");
                    LogException.LogToDebugger($"⚠️ No recommendations found for user {userId}");
                    return new List<ArticleDTO>(); // 👈 Devuelve lista vacía si no hay resultados
                }

                return result;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("error while setting the recommendation");
            }
        }

        private List<string> GetRandomFields(ArticleDTO article)
        {
            var random = new Random();
            var possibleFields = new List<string>();

            if (article.Authors != null && article.Authors.Any())
                possibleFields.Add("authors");

            if (!string.IsNullOrEmpty(article.Title))
                possibleFields.Add("title");

            if (!string.IsNullOrEmpty(article.PublishedDate))
                possibleFields.Add("publishedDate");

            return possibleFields.OrderBy(_ => random.Next()).Take(2).ToList();
        }
    }
}
