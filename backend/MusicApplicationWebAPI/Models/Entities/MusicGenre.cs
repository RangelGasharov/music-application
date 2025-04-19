namespace MusicApplicationWebAPI.Models.Entities
{
    public class MusicGenre
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
    }
}