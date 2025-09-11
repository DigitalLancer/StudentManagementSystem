namespace StudentManagement.Api.Models
{
    public class UpdateUserRequest
    {
        public string Email { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string Role { get; set; } = default!;
        public string? Password { get; set; }
    }
}
