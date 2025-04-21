namespace ECommerceApp.DTOs
{
    public class OrderDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public List<int> ProductIds { get; set; }
        public List<string> ProductNames { get; set; }
    }
}
