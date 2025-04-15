using ECommerceApp.DTOs;
using ECommerceApp.Models;
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

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                StockAmount = p.StockAmount,
                CategoryId = p.CategoryId
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct(ProductDto productDto)
    {
        var product = new Product
        {
            Name = productDto.Name,
            Price = productDto.Price,
            StockAmount = productDto.StockAmount,
            CategoryId = productDto.CategoryId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        productDto.Id = product.Id;
        return Ok(productDto);
    }

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
