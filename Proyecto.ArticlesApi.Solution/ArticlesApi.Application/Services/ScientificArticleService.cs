using ArticlesApi.Application.Interfaces;
using ArticlesApi.Domain.Entities;
using ArticlesApi.Application.Responses;
using Llaveremos.SharedLibrary.Logs;

namespace ArticlesApi.Application.Services
{
    public class ScientificArticleService : IScientificArticleService
    {
        private readonly IArticle _coreApiClient;

        public ScientificArticleService(IArticle coreApiclient)
        {
            _coreApiClient = coreApiclient;
        }

        public async Task<Article> GetArticleByIdAsync(string id)
        {
            try
            {
                return await _coreApiClient.GetArticleByIdAsync(id);
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Error while getting an article by id");
            }
        }

        public async Task<CoreApiResponse<Article>> SearchArticlesAsync(string query, int page, int pageSize, string author, int? year, string subject)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                var queryFilters = new List<string>();

                if (!string.IsNullOrWhiteSpace(query))
                {
                    if (query.Contains(":"))
                        queryFilters.Add(query);
                    else
                        queryFilters.Add($"fullText:\"{query}\"");
                }

                if (!string.IsNullOrWhiteSpace(author))
                    queryFilters.Add($"authors:\"{author}\"");

                if (year.HasValue)
                    queryFilters.Add($"yearPublished:{year.Value}");

                if (!string.IsNullOrWhiteSpace(subject))
                    queryFilters.Add($"subjects:\"{subject}\"");

                var coreQuery = string.Join(" AND ", queryFilters);

                var result = await _coreApiClient.SearchArticlesAsync(coreQuery, page, pageSize);

                stopwatch.Stop();
                if (stopwatch.ElapsedMilliseconds > 2000)
                {
                    Console.WriteLine($"⚠️ Búsqueda lenta: {stopwatch.ElapsedMilliseconds}ms - Query: {coreQuery}");
                }

                return result;
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("Rate limit"))
            {
                Console.WriteLine("⚠️ CORE API rate limit reached.");
                throw new Exception("Has alcanzado el límite de peticiones. Intenta más tarde.");
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                LogException.LogExceptions(ex);
                Console.WriteLine($"❌ Error en búsqueda - Query: {query}, Author: {author}, Year: {year}, Subject: {subject}");
                throw new Exception("Error while searching an article");
            }
        }
    }
}
