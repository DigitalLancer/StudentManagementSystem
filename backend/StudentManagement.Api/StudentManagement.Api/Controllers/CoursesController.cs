using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Migrations;
using StudentManagement.Api.Models;

namespace StudentManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : Controller
    {
        private readonly StudentManagementContext _context;
        public CoursesController(StudentManagementContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Courses
                .ToListAsync();
            return Ok(courses);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var c = await _context.Courses
                .FirstOrDefaultAsync(x => x.Id == id);
            return c is null ? NotFound() : Ok(c);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddCourseRequest input)
        {
            if (string.IsNullOrWhiteSpace(input.CourseName))
                return BadRequest("Enter a name");

            var course = new Course
            {
                CourseName = input.CourseName.Trim(),
            };
            if (input.TeacherId.HasValue)
                course.TeacherId = input.TeacherId.Value;

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = course.Id }, course);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AddCourseRequest input)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course is null) return NotFound();

            if (!string.IsNullOrWhiteSpace(input.CourseName))
                course.CourseName = input.CourseName;

            if (input.TeacherId.HasValue)
            {
                var teacherExists = await _context.User.AnyAsync(u => u.Id == input.TeacherId.Value);
                if (!teacherExists) return BadRequest("Teacher (User) not found.");
                course.TeacherId = input.TeacherId;
            }
            else
            {
                course.TeacherId = null;
            }
            await _context.SaveChangesAsync();
            return Ok(course);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course is null) return NotFound();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}