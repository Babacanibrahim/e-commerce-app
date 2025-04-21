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

    // Ürünleri kategoriye göre listeleme
    [Authorize]
    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetProductsByCategory(int categoryId)
    {
        var products = await _context.Products
            .Where(p => p.ProductCategories.Any(pc => pc.CategoryId == categoryId))
            .Include(p => p.ProductCategories)
            .ThenInclude(pc => pc.Category)
            .ToListAsync();

        if (!products.Any()) return NotFound("No products found in this category.");

        return Ok(products);
    }

    // Ürün arama (ad içeriklerine göre)
    [Authorize]
    [HttpGet("search/{searchTerm}")]
    public async Task<IActionResult> SearchProducts(string searchTerm)
    {
        var products = await _context.Products
            .Where(p => p.Name.Contains(searchTerm))
            .Include(p => p.ProductCategories)
            .ThenInclude(pc => pc.Category)
            .ToListAsync();

        if (!products.Any()) return NotFound("No products found.");

        return Ok(products);
    }

    // Ürünü silen metod
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
