namespace ECommerceApp.DTOs
{
    public class RegisterDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }  // Role bilgisini burada alacağız
    }
}
