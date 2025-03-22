using Llaveremos.SharedLibrary.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SuggestApi.Application.Interfaces;
using SuggestApi.Infrastructure.Data;
using SuggestApi.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Infrastructure.DependencyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration config)
        {
            SharedServiceContainer.AddSharedServices<SuggestionDbContext>(services, config, config["MySerilog:FileName"]!);

            services.AddScoped<ISearchHistory, SearchHistory>();

            return services;
        }

        public static IApplicationBuilder UseInfrastructurePolicy(this IApplicationBuilder app)
        {
            //api gateway dependency 
            SharedServiceContainer.UseSharedPolicies(app);
            return app;
        }
    }
}
