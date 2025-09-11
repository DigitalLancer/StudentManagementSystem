using System.ComponentModel.DataAnnotations.Schema;

namespace StudentManagement.Api.Models
{
    [Table("Users")]
    public class User
    {
        
        [Column("user_id")] public int Id { get; set; }

        [Column("email")] public string Email { get; set; }

        [Column("user_name")] public string Username { get; set; }

        [Column("password_hash")] public string Password { get; set; }

        [Column("role")] public string Role { get; set; }
    }
}
