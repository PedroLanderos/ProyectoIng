using Llaveremos.SharedLibrary.Logs;
using SuggestApi.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SuggestApi.Application.Services
{
    public class Article : IArticles
    {
        private readonly HttpClient _httpClient;
        public Article(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<IEnumerable<ArticleDTO>> GetArticleAsync(string query)
        {
			try
			{
                // Hacer la solicitud al microservicio ArticlesApi
                var response = await _httpClient.GetAsync($"http://articles-api-url/api/article/search?query={query}&page=1&pageSize=5");

                // Si la respuesta no es exitosa, manejar el error
                response.EnsureSuccessStatusCode();

                // Leer la respuesta JSON
                var json = await response.Content.ReadAsStringAsync();

                // Deserializar la respuesta en un listado de ArticleDTO
                var result = JsonConvert.DeserializeObject<List<ArticleDTO>>(json);

                return result!;
            }
			catch (Exception ex)
			{
				LogException.LogExceptions(ex);
				throw new Exception("error in the articles service");
			}
        }

        public async Task<IEnumerable<ArticleDTO>> SearchArticlesByFields(IEnumerable<string> fieldsToSearch)
        {
            try
            {
                // Crear el query de búsqueda basado en los campos seleccionados
                var query = string.Join(" ", fieldsToSearch);  // Combina los campos para formar un query de búsqueda

                // Hacer la solicitud al microservicio ArticlesApi
                var response = await _httpClient.GetAsync($"http://articles-api-url/api/article/search?query={query}&page=1&pageSize=5");

                // Si la respuesta no es exitosa, manejar el error
                response.EnsureSuccessStatusCode();

                // Leer la respuesta JSON
                var json = await response.Content.ReadAsStringAsync();

                // Deserializar la respuesta en un listado de ArticleDTO
                var result = JsonConvert.DeserializeObject<List<ArticleDTO>>(json);

                return result!;
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                throw new Exception("error in the articles service");
            }
        }

    }
}
