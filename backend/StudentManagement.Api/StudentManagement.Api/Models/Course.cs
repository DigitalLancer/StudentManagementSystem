using System.ComponentModel.DataAnnotations.Schema;

namespace StudentManagement.Api.Models
{
    [Table("courses")]
    public class Course
    {
        [Column("id")] public int Id { get; set; }
        [Column("course_name")] public string CourseName { get; set; } = string.Empty;
        [Column("teacher_id")] public int? TeacherId { get; set; }
    }
}
