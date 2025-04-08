#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Kiltex.SitemaGestion.Api/Kiltex.SistemaGestion.Api.csproj", "Kiltex.SitemaGestion.Api/"]
COPY ["Kiltex.SistemaGestion.Services/Kiltex.SistemaGestion.Services.csproj", "Kiltex.SistemaGestion.Services/"]
COPY ["Kiltex.SistemaGestion.SDK/Kiltex.SistemaGestion.SDK.csproj", "Kiltex.SistemaGestion.SDK/"]
COPY ["Kiltex.SistemaGestion.Domain/Kiltex.SistemaGestion.Domain.csproj", "Kiltex.SistemaGestion.Domain/"]

RUN dotnet restore "Kiltex.SitemaGestion.Api/Kiltex.SistemaGestion.Api.csproj"
COPY . .
WORKDIR "/src/Kiltex.SitemaGestion.Api"
RUN dotnet build "Kiltex.SistemaGestion.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Kiltex.SistemaGestion.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Kiltex.SistemaGestion.Api.dll"]