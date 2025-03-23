# Etapa de construcción
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar los archivos del proyecto
COPY Proyecto.SuggestApi.Solution/SuggestApi.Presentation/SuggestApi.Presentation.csproj SuggestApi.Presentation/
COPY Proyecto.SuggestApi.Solution/SuggestApi.Application/SuggestApi.Application.csproj SuggestApi.Application/
COPY Proyecto.SuggestApi.Solution/SuggestApi.Domain/SuggestApi.Domain.csproj SuggestApi.Domain/
COPY Proyecto.SuggestApi.Solution/SuggestApi.Infrastructure/SuggestApi.Infrastructure.csproj SuggestApi.Infrastructure/
COPY Proyecto.SharedLibrarySolution/Proyecto.SharedLibrary/Proyecto.SharedLibrary.csproj Proyecto.SharedLibrary/

# Restaurar dependencias
RUN dotnet restore SuggestApi.Presentation/SuggestApi.Presentation.csproj

# Copiar el código fuente completo
COPY Proyecto.SuggestApi.Solution/ SuggestApi.Solution/
COPY Proyecto.SharedLibrarySolution/ Proyecto.SharedLibrarySolution/

# Cambiar al directorio del proyecto principal
WORKDIR /src/SuggestApi.Solution/SuggestApi.Presentation

# Publicar la aplicación
RUN dotnet publish SuggestApi.Presentation.csproj -c Release -o /app/publish

# Etapa final: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .


# Configurar el punto de entrada
ENTRYPOINT ["dotnet", "SuggestApi.Presentation.dll"]