using System.ComponentModel.DataAnnotations;

namespace ECommerceApp.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public int Price { get; set; }
        public int StockAmount { get; set; }
        public List<CategoryDto> Categories { get; set; }
    }
}
