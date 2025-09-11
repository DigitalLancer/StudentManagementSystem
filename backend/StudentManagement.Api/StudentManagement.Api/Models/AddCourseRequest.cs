namespace StudentManagement.Api.Models
{
    public class AddCourseRequest
    {
        public string CourseName { get; set; } = string.Empty;
        public int? TeacherId { get; set; }
    }
}
