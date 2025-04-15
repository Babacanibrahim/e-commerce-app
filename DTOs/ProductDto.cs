namespace ECommerceApp.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public int StockAmount { get; set; }
        public int CategoryId { get; set; }
    }
}
