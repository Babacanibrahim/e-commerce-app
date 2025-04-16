using ECommerceApp.DTOs;
using ECommerceApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Ürünleri getiren metod
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.ProductCategories) // Ürünlerin bağlı olduğu ProductCategories
            .ThenInclude(pc => pc.Category) // ProductCategory üzerinden Category'yi dahil et
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                StockAmount = p.StockAmount,
                Categories = p.ProductCategories
                    .Select(pc => new CategoryDto
                    {
                        Id = pc.Category.Id,
                        Name = pc.Category.Name
                    })
                    .ToList() // Kategorileri liste olarak döndür
            })
            .ToListAsync();

        return Ok(products);
    }

    // Yeni bir ürün ekleyen metod
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct(ProductDto productDto)
    {
        // Ürünü oluştur
        var product = new Product
        {
            Name = productDto.Name,
            Price = productDto.Price,
            StockAmount = productDto.StockAmount,
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Ürün ekleme başarılı olduğunda, ürün ile ilişkili kategorileri ekleyelim
        foreach (var categoryDto in productDto.Categories)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == categoryDto.Id);

            if (category != null)
            {
                var productCategory = new ProductCategory
                {
                    ProductId = product.Id,
                    CategoryId = category.Id
                };

                _context.ProductCategories.Add(productCategory);
            }
        }

        await _context.SaveChangesAsync();

        productDto.Id = product.Id;
        return Ok(productDto);
    }

    // Ürün stok miktarını güncelleyen metod
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStock(int id, [FromBody] int stock)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.StockAmount = stock;
        await _context.SaveChangesAsync();

        return Ok(product);
    }
}
