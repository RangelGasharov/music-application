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
    public DbSet<Queue> Queue { get; set; }
    public DbSet<QueueItem> QueueItem { get; set; }
    public DbSet<QueueProgress> QueueProgress { get; set; }
    public DbSet<MusicTrackPlaylist> MusicTrackPlaylist { get; set; }
    public DbSet<MusicStream> MusicStream { get; set; }
    public DbSet<MusicTrackStat> MusicTrackStat { get; set; }

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

        modelBuilder.Entity<MusicTrackPlaylist>()
            .HasKey(mtp => mtp.Id);
        modelBuilder.Entity<MusicTrackPlaylist>()
            .HasOne(mtp => mtp.MusicTrack)
            .WithMany(mt => mt.MusicTrackPlaylist)
            .HasForeignKey(mtp => mtp.TrackId);

        modelBuilder.Entity<MusicTrackPlaylist>()
            .Property(mtp => mtp.PlayListId)
            .HasColumnName("playlist_id");

        modelBuilder.Entity<MusicTrackPlaylist>()
            .HasOne(mtp => mtp.Playlist)
            .WithMany(p => p.MusicTrackPlaylists)
            .HasForeignKey(mtp => mtp.PlayListId);

        modelBuilder.Entity<MusicStream>()
            .Property(e => e.TrackId)
            .HasColumnName("track_id");

        modelBuilder.Entity<MusicStream>()
           .Property(e => e.UserId)
           .HasColumnName("user_id");

        modelBuilder.Entity<MusicStream>()
            .HasOne(ms => ms.MusicTrack)
            .WithMany(mt => mt.MusicStream)
            .HasForeignKey(ms => ms.TrackId);

        modelBuilder.Entity<MusicTrackStat>(entity =>
        {
            entity.HasKey(mts => mts.TrackId);

            entity.HasOne(mts => mts.MusicTrack)
                .WithOne(mt => mt.MusicTrackStat)
                .HasForeignKey<MusicTrackStat>(mts => mts.TrackId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MusicTrack>()
                .HasOne(mt => mt.MusicTrackStat)
                .WithOne(stat => stat.MusicTrack)
                .HasForeignKey<MusicTrackStat>(stat => stat.TrackId)
                .OnDelete(DeleteBehavior.Cascade);
    }
}