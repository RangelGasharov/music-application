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
    public DbSet<MusicTrack> MusicTrack { get; set; }
    public DbSet<MusicTrackAlbum> MusicTrackAlbum { get; set; }
    public DbSet<Playlist> Playlist { get; set; }
    public DbSet<MusicTrackPlaylist> MusicTrackPlaylist { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MusicArtistAlbum>()
            .HasKey(artist_album => artist_album.Id);

        modelBuilder.Entity<MusicArtistAlbum>()
            .HasOne(artist_album => artist_album.MusicArtist)
            .WithMany(artist => artist.MusicArtistAlbums)
            .HasForeignKey(artist_album => artist_album.MusicArtistId);

        modelBuilder.Entity<MusicArtistAlbum>()
            .HasOne(artist_album => artist_album.MusicAlbum)
            .WithMany(album => album.MusicArtistAlbums)
            .HasForeignKey(artist_album => artist_album.MusicAlbumId);
    }
}