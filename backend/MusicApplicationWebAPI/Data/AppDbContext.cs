using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<MusicAlbum> MusicAlbum { get; set; }
    public DbSet<MusicArtist> MusicArtist { get; set; }
    public DbSet<MusicArtistAlbum> MusicArtistAlbum { get; set; }
    public DbSet<MusicArtistPhoto> MusicArtistPhoto { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

    }
}
