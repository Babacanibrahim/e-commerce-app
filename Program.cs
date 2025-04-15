using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
//using ECommerceApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Veritabaný baðlantý dizesini `appsettings.json`'dan alacak þekilde yapýlandýrýn.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger yapýlandýrmasý
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Web API için gerekli diðer servisleri ekleyin.
builder.Services.AddControllers();

var app = builder.Build();

// Swagger'ý geliþtirme ortamýnda aktif et
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();  // Swagger'ý etkinleþtir
    app.UseSwaggerUI(); // Swagger UI'yi etkinleþtir
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
