# Etapa de construcción
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar los archivos del proyecto
COPY Proyecto.ArticlesApi.Solution/ArticlesApi.Presentation/ArticlesApi.Presentation.csproj ArticlesApi.Presentation/
COPY Proyecto.ArticlesApi.Solution/ArticlesApi.Application/ArticlesApi.Application.csproj ArticlesApi.Application/
COPY Proyecto.ArticlesApi.Solution/ArticlesApi.Domain/ArticlesApi.Domain.csproj ArticlesApi.Domain/
COPY Proyecto.ArticlesApi.Solution/ArticlesApi.Infrastructure/ArticlesApi.Infrastructure.csproj ArticlesApi.Infrastructure/
COPY Proyecto.SharedLibrarySolution/Proyecto.SharedLibrary/Proyecto.SharedLibrary.csproj Proyecto.SharedLibrary/

# Restaurar dependencias
RUN dotnet restore ArticlesApi.Presentation/ArticlesApi.Presentation.csproj

# Copiar el código fuente completo
COPY Proyecto.ArticlesApi.Solution/ ArticlesApi.Solution/
COPY Proyecto.SharedLibrarySolution/ Proyecto.SharedLibrarySolution/

# Cambiar al directorio del proyecto principal
WORKDIR /src/ArticlesApi.Solution/ArticlesApi.Presentation

# Publicar la aplicación
RUN dotnet publish ArticlesApi.Presentation.csproj -c Release -o /app/publish

# Etapa final: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .


# Configurar el punto de entrada
ENTRYPOINT ["dotnet", "ArticlesApi.Presentation.dll"]