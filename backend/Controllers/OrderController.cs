using ECommerceApp.DTOs;
using ECommerceApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrderController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetOrdersByUserId(int userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
            .Include(o => o.User)
            .Select(o => new OrderDto
            {
                UserId = o.UserId,
                UserName = o.User.UserName, // 👈 kullanıcı adı geliyor
                ProductIds = o.OrderProducts.Select(op => op.ProductId).ToList(),
                ProductNames = o.OrderProducts.Select(op => op.Product.Name).ToList() // 👈 ürün isimleri geliyor
            })
            .ToListAsync();

        if (orders == null || !orders.Any())
            return NotFound("No orders found for this user.");

        return Ok(orders);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
            .Include(o => o.User)
            .Select(o => new OrderDto
            {
                UserId = o.UserId,
                UserName = o.User.UserName,
                ProductIds = o.OrderProducts.Select(op => op.ProductId).ToList(),
                ProductNames = o.OrderProducts.Select(op => op.Product.Name).ToList()
            })
            .ToListAsync();

        if (!orders.Any())
            return NotFound("No orders found.");

        return Ok(orders);
    }


    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderDto orderDto)
    {
        var productsExist = await _context.Products
            .Where(p => orderDto.ProductIds.Contains(p.Id))
            .CountAsync() == orderDto.ProductIds.Count;

        if (!productsExist)
            return BadRequest("One or more products do not exist.");

        var order = new Order
        {
            UserId = orderDto.UserId,
            OrderProducts = orderDto.ProductIds.Select(productId => new OrderProduct
            {
                ProductId = productId
            }).ToList()
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return Ok(new { OrderId = order.Id, Message = "Order created successfully." });
    }
}
