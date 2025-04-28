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
            // Kullanıcı adı zaten var mı kontrol et
            if (_context.Users.Any(u => u.UserName == dto.UserName))
            {
                return BadRequest("Username already exists");
            }

            var hashedPassword = HashPassword(dto.Password);

            var user = new User
            {
                UserName = dto.UserName,
                Password = hashedPassword,
                Role = Role.User
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Kayıt başarılı");
        }




        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto dto)
        {
            // Kullanıcı adı kontrolü
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == dto.UserName);

            // Eğer kullanıcı adı bulunmazsa
            if (user == null)
                return Unauthorized("Böyle bir kullanıcı bulunmuyor.");

            // Şifre kontrolü
            var hashedPassword = HashPassword(dto.Password);
            if (user.Password != hashedPassword)
                return Unauthorized("Şifre yanlış.");

            // Eğer her şey doğruysa, token oluşturuluyor
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
