using AuthenticationApi.Infrastructure.DependencyInjection;
using AuthenticationApi.Infrastructure.Data; // Para el contexto de datos
using Microsoft.EntityFrameworkCore; // Para Migrate()

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddInfrastructureService(builder.Configuration);

// Configuración de CORS: permitir cualquier origen
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
        // IMPORTANTE: No uses AllowCredentials() si usás AllowAnyOrigin()
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

// Aplicar CORS para todos los orígenes
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
