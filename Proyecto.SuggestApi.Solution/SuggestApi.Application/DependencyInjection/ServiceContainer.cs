using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SuggestApi.Application.Interfaces;
using SuggestApi.Application.Services;
using Polly;
using Polly.Retry;
using Llaveremos.SharedLibrary.Logs;

namespace SuggestApi.Application.DependencyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration config)
        {
            // 🔹 HttpClient para IArticles (ruta directa al microservicio de artículos)
            services.AddHttpClient<IArticles, Article>(client =>
            {
                client.BaseAddress = new Uri("http://articlesapiservice:5002"); 
            });

            // 🔹 HttpClient para ISuggestion (ruta directa al microservicio de autenticación)
            services.AddHttpClient<ISuggestion, Suggestion>(client =>
            {
                client.BaseAddress = new Uri("http://authenticationapiservice:5000"); 
            });

            return services;
        }
    }
}
