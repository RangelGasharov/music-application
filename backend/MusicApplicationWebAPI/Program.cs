using MusicApplicationWebAPI.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    builder.Services.AddDbContext<AppDbContext>();
}

var app = builder.Build();

{
    app.MapGet("/", () => "Hello World!");

    app.MapGet("/music-album", async (AppDbContext dbContext) =>
    {
        var musicAlbums = await dbContext.MusicAlbums.ToListAsync();
        return Results.Ok(musicAlbums);
    });
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();