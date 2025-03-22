using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
            services.AddHttpClient<IArticles, Article>(options =>
            {
                options.BaseAddress = new Uri(config["ApiGateway:BaseAddress"]!);
                options.Timeout = TimeSpan.FromSeconds(1);
            });

            var retryStrategy = new RetryStrategyOptions()
            {
                ShouldHandle = new PredicateBuilder().Handle<TaskCanceledException>(),
                BackoffType = DelayBackoffType.Constant,
                UseJitter = true,
                MaxRetryAttempts = 3,
                Delay = TimeSpan.FromMilliseconds(500),
                OnRetry = args => {
                    string message = $"OnRetry, attempt: {args.AttemptNumber} outcome {args.Outcome}";
                    LogException.LogToConsole(message);
                    LogException.LogToDebugger(message);
                    return ValueTask.CompletedTask;
                }
            };


            services.AddResiliencePipeline("retry-pipeline", builder =>
            {
                builder.AddRetry(retryStrategy);
            });

            return services;
        }


    }
}
