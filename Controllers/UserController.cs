using Microsoft.AspNetCore.Mvc;
using ECommerceApp.DTOs;
using ECommerceApp.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using ECommerceApp.Helpers;

namespace ECommerceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;

        public UserController(ApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var hashedPassword = HashPassword(dto.Password);

            var user = new User
            {
                UserName = dto.UserName,
                Password = hashedPassword,
                Role = Role.User // Artık tüm kayıtlar kullanıcı rolünde olacak
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Kayıt başarılı");
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto dto)
        {
            var hashedPassword = HashPassword(dto.Password);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == dto.UserName && u.Password == hashedPassword);

            if (user == null)
                return Unauthorized("Geçersiz kullanıcı adı veya şifre.");

            var token = _tokenService.GenerateToken(user);

            return Ok(new { token });
        }


        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
