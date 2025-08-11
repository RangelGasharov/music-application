using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Minio;
using MusicApplicationWebAPI.Data;
using MusicApplicationWebAPI.Interfaces;
using MusicApplicationWebAPI.Repository;
using MusicApplicationWebAPI.Services;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var host = Environment.GetEnvironmentVariable("DB_HOST");
    var dbName = Environment.GetEnvironmentVariable("DB_NAME");
    var user = Environment.GetEnvironmentVariable("DB_USER");
    var password = Environment.GetEnvironmentVariable("DB_PASSWORD");

    var connectionString = $"Host={host};Database={dbName};Username={user};Password={password}";

    options.UseNpgsql(connectionString).UseSnakeCaseNamingConvention();
});

builder.Services.AddSingleton(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();

    var baseUrl = Environment.GetEnvironmentVariable("MINIO_BASE_URL") ?? "";
    var accessKey = Environment.GetEnvironmentVariable("MINIO_ACCESS_KEY");
    var secretKey = Environment.GetEnvironmentVariable("MINIO_SECRET_KEY");

    return new MinioClient()
        .WithEndpoint(new Uri(baseUrl).Host, 9002)
        .WithCredentials(accessKey, secretKey)
        .WithSSL(baseUrl.StartsWith("https"))
        .Build();
});

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IMusicAlbumRepository, MusicAlbumRepository>();
builder.Services.AddScoped<IMusicArtistRepository, MusicArtistRepository>();
builder.Services.AddScoped<IMusicTrackRepository, MusicTrackRepository>();
builder.Services.AddScoped<PlaylistRepository>();
builder.Services.AddScoped<IQueueRepository, QueueRepository>();
builder.Services.AddScoped<IQueueProgressRepository, QueueProgressRepository>();
builder.Services.AddScoped<IMusicStreamRepository, MusicStreamsRepository>();

builder.Services.AddSingleton<MinioFileService>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        var jwtAuthority = Environment.GetEnvironmentVariable("JWT_AUTHORITY");
        var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");

        options.Authority = jwtAuthority;
        options.Audience = jwtAudience;
        options.RequireHttpsMetadata = false;

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("Authentication failed: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated for: " + context.Principal.Identity.Name);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

{

}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();