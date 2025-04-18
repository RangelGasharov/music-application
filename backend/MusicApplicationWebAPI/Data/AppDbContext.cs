using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using MusicApplicationWebAPI.Models;
using DotNetEnv;
using EFCore.NamingConventions;

namespace MusicApplicationWebAPI.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<MusicAlbum> MusicAlbums { get; set; }
        public DbSet<MusicArtist> MusicArtists { get; set; }
        public DbSet<MusicArtistAlbum> MusicArtistAlbums { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            Env.Load();
            var host = Env.GetString("DB_HOST");
            var dbName = Env.GetString("DB_NAME");
            var user = Env.GetString("DB_USER");
            var password = Env.GetString("DB_PASSWORD");
            var connectionString = $"Host={host};Database={dbName};Username={user};Password={password}";

            optionsBuilder.UseNpgsql(connectionString).UseSnakeCaseNamingConvention();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MusicAlbum>().ToTable("music_album");
            modelBuilder.Entity<MusicArtist>().ToTable("music_artist");
            modelBuilder.Entity<MusicArtistAlbum>().ToTable("music_artist_album");
        }
    }
}
