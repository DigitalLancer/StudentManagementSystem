using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Models;
using System.Text.Json;
using System.Threading.Channels;

namespace StudentManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly StudentManagementContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UsersController(StudentManagementContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        //GET api/users
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.User.Select(u => new
            {
                u.Id,
                u.Email,
                u.Username,
                u.Role
            }).ToListAsync();
            return Ok(users);
        }

        //GET api/users/id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.User
                .Where(u => u.Id == id)
                .Select(u => new { u.Id, u.Username, u.Email, u.Role })
                .FirstOrDefaultAsync();

            if (user is null) return NotFound();
            return Ok(user);
        }

        // POST api/users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest input)
        {
            if (string.IsNullOrWhiteSpace(input.Email) || string.IsNullOrWhiteSpace(input.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var user = await _context.User
                .FirstOrDefaultAsync(u => u.Email == input.Email.Trim());

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(
                user,
                user.Password,    
                input.Password 
            );

            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            if (passwordVerificationResult == PasswordVerificationResult.SuccessRehashNeeded)
            {
                user.Password = _passwordHasher.HashPassword(user, input.Password);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Username,
                user.Role
            });
        }

        // POST api/users/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AddUserRequest input)
        {
            if (string.IsNullOrWhiteSpace(input.Username) ||
                string.IsNullOrWhiteSpace(input.Password) ||
                string.IsNullOrWhiteSpace(input.Role))
            {
                return BadRequest("Username, role and password are required.");
            }

            var existingUser = await _context.User
                .AnyAsync(u => u.Email == input.Email.Trim());

            if (existingUser)
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var user = new User
            {
                Email = input.Email?.Trim() ?? string.Empty,
                Username = input.Username.Trim(),
                Role = input.Role.Trim()
            };

            user.Password = _passwordHasher.HashPassword(user, input.Password);

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id },
                new { user.Id, user.Username, user.Email, user.Role });
        }


        // PUT api/users/id
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequest input)
        {
            var user = await _context.User.FindAsync(id);
            if (user is null)
                return NotFound();

            user.Username = input.Username;
            user.Email = input.Email;
            user.Role = input.Role;

            if (!string.IsNullOrWhiteSpace(input.Password))
            {
                user.Password = _passwordHasher.HashPassword(user, input.Password);
            }

            await _context.SaveChangesAsync();
            return Ok(new { user.Id, user.Username, user.Email, user.Role });
        }

        // DELETE api/users/id
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null) return NotFound();

            _context.User.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
