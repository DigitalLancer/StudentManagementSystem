using System.ComponentModel.DataAnnotations.Schema;

namespace StudentManagement.Api.Models
{
    [Table("enrollment")]
    public class Enrollment
    {
        [Column("id")] public int Id { get; set; }
        [Column("course_id")] public int CourseId { get; set; }
        [Column("student_id")] public int StudentId { get; set; }
        [Column("grade")] public string? Grade { get; set; }= string.Empty;
        [Column("absence")] public int? Absence { get; set; } = 0;
    }
}
