using ArticlesApi.Application.Interfaces;
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
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("error while getting an article by id");
            }
        }

        public async Task<IEnumerable<Article>> SearchArticlesAsync(string query, int page, int pageSize, string author, int? year, string subject)
        {
            try
            {

                var results = await _coreApiClient.SearchArticlesAsync(query, page, pageSize);

                // Aplicar filtros
                if (!string.IsNullOrEmpty(author))
                    results = results.Where(a => a.Authors.Any(x => x.Name.Contains(author, StringComparison.OrdinalIgnoreCase)));

                if (year.HasValue)
                    results = results.Where(a => a.YearPublished == year.Value);

                if (!string.IsNullOrEmpty(subject))
                    results = results.Where(a => a.Subjects.Any(x => x.Contains(subject, StringComparison.OrdinalIgnoreCase)));

                return results;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("Error while searching an article");
            }
        }
    }
}
