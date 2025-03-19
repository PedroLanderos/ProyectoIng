using AuthenticationApi.Infrastructure.DependencyInjection;
using AuthenticationApi.Infrastructure.Data; // Para el contexto de datos
using Microsoft.EntityFrameworkCore; // Para Migrate()

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddInfrastructureService(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Permite peticiones desde React
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Esto es necesario si usas `withCredentials: true` en axios
    });
});

var app = builder.Build();

// Aplicar migraciones pendientes
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AuthenticationDbContext>();
    context.Database.Migrate();
}

app.UseInfrastructurePolicy();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
