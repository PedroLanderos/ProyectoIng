using ArticlesApi.Application.Interfaces;
using ArticlesApi.Application.Responses;
using ArticlesApi.Domain.Entities;
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
            catch (InvalidOperationException ex) when (ex.Message.Contains("Rate limit"))
            {
                Console.WriteLine("⚠️ CORE API rate limit reached.");
                throw new InvalidOperationException("Rate limit exceeded");
            }
            catch (HttpRequestException)
            {
                Console.WriteLine("❌ Problema de red o servidor CORE no disponible.");
                throw new Exception("CORE API error");
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return null!;
            }
        }

        public async Task<CoreApiResponse<Article>> SearchArticlesAsync(string query, int page, int pageSize, string author, int? year, string subject)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                List<string> queryFilters = new();

                if (!string.IsNullOrWhiteSpace(query))
                {
                    queryFilters.Add($"(title:\"{query}\" OR fullText:\"{query}\")");
                }

                if (!string.IsNullOrWhiteSpace(author))
                {
                    queryFilters.Add($"authors:\"{author}\"");
                }

                if (year.HasValue)
                {
                    queryFilters.Add($"yearPublished:{year.Value}");
                }

                if (!string.IsNullOrWhiteSpace(subject))
                {
                    queryFilters.Add($"subjects:\"{subject}\"");
                }

                string coreQuery = queryFilters.Any() ? string.Join(" AND ", queryFilters) : "fullText:science";

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
