namespace ECommerceApp.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; } 
        public User User { get; set; } // İlişkili kullanıcı
        public ICollection<OrderProduct> OrderProducts { get; set; }
    }
}
