FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy solution and project files for restoring dependencies
COPY src/ReviewLoom.Domain/ReviewLoom.Domain.csproj src/ReviewLoom.Domain/
COPY src/ReviewLoom.Application/ReviewLoom.Application.csproj src/ReviewLoom.Application/
COPY src/ReviewLoom.Infrastructure/ReviewLoom.Infrastructure.csproj src/ReviewLoom.Infrastructure/
COPY src/ReviewLoom.Api/ReviewLoom.Api.csproj src/ReviewLoom.Api/

# Restore dependencies
RUN dotnet restore src/ReviewLoom.Api/ReviewLoom.Api.csproj

# Copy remaining source code and publish
COPY src/ src/
WORKDIR /app/src/ReviewLoom.Api
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 80
ENTRYPOINT ["dotnet", "ReviewLoom.Api.dll"]
