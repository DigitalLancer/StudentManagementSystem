using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Models;

namespace StudentManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly StudentManagementContext _ctx;
        public EnrollmentsController(StudentManagementContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int? courseId = null, [FromQuery] int? studentId = null)
        {
            var enrollment = await _ctx.Enrollments
                .ToListAsync();
            return Ok(enrollment);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var e = await _ctx.Enrollments
                .FirstOrDefaultAsync(e => e.Id == id);
            return e is null ? NotFound() : Ok(e);
        }

        [HttpPost]
        public async Task<IActionResult> Enroll([FromBody] Enrollment enrollment)
        {
            bool dup = await _ctx.Enrollments.AnyAsync(e => e.CourseId == enrollment.CourseId && e.StudentId == enrollment.StudentId);
            if (dup) return Conflict("Student already enrolled to this course.");

            if (!await _ctx.Courses.AnyAsync(c => c.Id == enrollment.CourseId))
                return BadRequest("Course not found.");

            _ctx.Enrollments.Add(enrollment);
            await _ctx.SaveChangesAsync();
            return Ok(enrollment);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateEnrollment(int id, [FromBody] Enrollment input)
        {          
            var enrollment = await _ctx.Enrollments.FindAsync(id);
            if (enrollment is null)
                return NotFound(new { message = "Enrollment not found" });

            enrollment.Grade = input.Grade;
            enrollment.Absence = input.Absence;

            await _ctx.SaveChangesAsync();

            return Ok(enrollment);
        }

            [HttpDelete]
        public async Task<IActionResult> Unenroll([FromQuery] int courseId, [FromQuery] int studentId)
        {
            var e = await _ctx.Enrollments.FirstOrDefaultAsync(x => x.CourseId == courseId && x.StudentId == studentId);
            if (e is null) return NotFound();

            _ctx.Enrollments.Remove(e);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}