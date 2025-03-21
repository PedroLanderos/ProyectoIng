using ArticlesApi.Application.Interfaces;
using ArticlesApi.Application.Services;
using ArticlesApi.Infrastructure.Infrastructure;
using Llaveremos.SharedLibrary.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArticlesApi.Infrastructure.DependencyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddInfrastructureService(this IServiceCollection services, IConfiguration config)
        {
            //agregar la conexion a la database y el scheme de authentication

            //SharedServiceContainer.AddSharedServices<OrderDbContext>(services, config, config["MySerilog:FileName"]!);
            services.AddScoped<IScientificArticleService, ScientificArticleService>();
            services.AddHttpClient<IArticle, ArticleRepository>();


            return services;
        }
    }
}
