using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Data;

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

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

{
    app.MapGet("/music-artist-photo", async (AppDbContext dbContext) =>
    {
        var musicArtistPhotos = await dbContext.MusicArtistPhoto.ToListAsync();
        return Results.Ok(musicArtistPhotos);
    });
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();