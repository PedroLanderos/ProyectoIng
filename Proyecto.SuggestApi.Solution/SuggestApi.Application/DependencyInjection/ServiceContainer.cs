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
            // HttpClient para IArticles apuntando al API Gateway
            services.AddHttpClient<IArticles, Article>(client =>
            {
                client.BaseAddress = new Uri("http://apigateway:5003/api/article/");
            });

            // HttpClient para ISuggestion apuntando al API Gateway
            services.AddHttpClient<ISuggestion, Suggestion>(client =>
            {
                client.BaseAddress = new Uri("http://apigateway:5003/api/authentication/");
            });

            services.AddScoped<IHeap, Heap>();

            return services;
        }
    }
}
