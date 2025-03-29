using Llaveremos.SharedLibrary.Logs;
using Polly.Registry;
using SuggestApi.Application.DTOs;
using SuggestApi.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Application.Services
{
    public class Suggestion(HttpClient client, ResiliencePipelineProvider<string> resiliencePipeline, ISearchHistory _searchHistoryRepository, IArticles _articlesService) : ISuggestion
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
            /*
            1. Get all the user's search 
            2. Filter if they have favorites (if favorites is not null prioritize them)
            3. get random fields to search similar articles based on those fields
            4. search 5 new articles
            5. save the response on a list
            6. set the list 
            */
            try
            {
                var userExists = await Getuser(userId);
                if(userExists is null ) return null!;

                //get user historial 
                var userActivities = await _searchHistoryRepository.GetByCriteriaAsync(x => x.UserId == userId);
                //get the articles
                var favoriteActivities = userActivities.Where(x => x.IsFavorite).ToList();
                var nonFavoriteActivities = userActivities.Where(x => !x.IsFavorite).ToList();

                List<ArticleDTO> recommendedArticles = new List<ArticleDTO>();

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
                    var articles = await _articlesService.GetArticleAsync(activity.ArticleId!); // Obtener artículo
                    var fieldsToSearch = GetRandomFields(articles.First());

                    var similarArticles = await _articlesService.SearchArticlesByFields(fieldsToSearch);
                    recommendedArticles.AddRange(similarArticles);
                }

                return recommendedArticles.Distinct().Take(5);

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
            var fields = new List<string>();

            var possibleFields = new List<string>();

            if (article.Authors != null && article.Authors.Any())
                possibleFields.Add("authors");

            if (!string.IsNullOrEmpty(article.Title))
                possibleFields.Add("title");

            if (!string.IsNullOrEmpty(article.PublishedDate))
                possibleFields.Add("publishedDate");

            var selectedFields = possibleFields.OrderBy(x => random.Next()).Take(2).ToList();

            return selectedFields;
        }

    }
}
