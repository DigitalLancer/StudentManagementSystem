using Microsoft.EntityFrameworkCore;

namespace StudentManagement.Api.Models
{
    public class StudentManagementContext: DbContext
    {
        public StudentManagementContext(DbContextOptions<StudentManagementContext> options)
            : base(options)
        {
        }
        public DbSet<User> User { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
    }
}
