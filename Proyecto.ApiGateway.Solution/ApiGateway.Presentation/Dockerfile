FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Proyecto.ApiGateway.Solution/ApiGateway.Presentation/ApiGateway.Presentation.csproj ApiGateway.Presentation/
COPY Proyecto.SharedLibrarySolution/Proyecto.SharedLibrary/Proyecto.SharedLibrary.csproj Proyecto.SharedLibrary/

RUN dotnet restore ApiGateway.Presentation/ApiGateway.Presentation.csproj

COPY Proyecto.ApiGateway.Solution/ ApiGateway.Solution/
COPY Proyecto.SharedLibrarySolution/ Proyecto.SharedLibrarySolution/

# Cambiar al directorio del proyecto principal
WORKDIR /src/ApiGateway.Solution/ApiGateway.Presentation

# Publicar la aplicación
RUN dotnet publish ApiGateway.Presentation.csproj -c Release -o /app/publish

# Etapa final: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .


# Configurar el punto de entrada
ENTRYPOINT ["dotnet", "ApiGateway.Presentation.dll"]

