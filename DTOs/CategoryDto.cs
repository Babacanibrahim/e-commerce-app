using System.ComponentModel.DataAnnotations;

namespace ECommerceApp.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        [Required] public string Name { get; set; }
    }
}
