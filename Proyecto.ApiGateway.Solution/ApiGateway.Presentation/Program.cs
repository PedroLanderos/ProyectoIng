using ApiGateway.Presentation.Middleware;
using Llaveremos.SharedLibrary.DependencyInjection;
using Ocelot.Cache.CacheManager;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
builder.Services.AddOcelot().AddCacheManager(x => x.WithDictionaryHandle());
JWTAuthenticationScheme.AddJWTSchemeCollection(builder.Services, builder.Configuration);

// Configuración de CORS: permitir cualquier origen
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();

// Usar política de CORS abierta
app.UseCors("AllowAll");

app.UseMiddleware<AttachSignatureToRequest>();

// Esperar que Ocelot cargue correctamente
app.UseOcelot().Wait();

app.Run();
