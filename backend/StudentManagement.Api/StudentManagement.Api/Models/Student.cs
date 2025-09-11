using System.ComponentModel.DataAnnotations.Schema;

namespace StudentManagement.Api.Models
{
    [Table("students")]
    public class Student
    {
        [Column("student_id")] public int Id { get; set; }
        [Column("user_id")] public int? UserId { get; set; }
        [Column("name")] public string Name { get; set; } = string.Empty;
        [Column("surname")] public string Surname { get; set; } = string.Empty;
    }
}
