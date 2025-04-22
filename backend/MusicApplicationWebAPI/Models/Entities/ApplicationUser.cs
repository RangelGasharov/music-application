namespace MusicApplicationWebAPI.Models.Entities
{
    public class ApplicationUser
    {
        public Guid Id { get; set; }
        public required Guid KeyCloakId { get; set; }
        public required string UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
        public string? PhotoURL { get; set; }
    }
}