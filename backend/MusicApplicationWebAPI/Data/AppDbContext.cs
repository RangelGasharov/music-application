using Microsoft.EntityFrameworkCore;
using MusicApplicationWebAPI.Models.Entities;

namespace MusicApplicationWebAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
    {

    }

    public DbSet<MusicAlbum> MusicAlbum { get; set; }
    public DbSet<MusicArtist> MusicArtist { get; set; }
    public DbSet<MusicArtistAlbum> MusicArtistAlbum { get; set; }
    public DbSet<MusicArtistPhoto> MusicArtistPhoto { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

    }
}
