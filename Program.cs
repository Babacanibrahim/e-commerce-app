using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
//using ECommerceApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Veritaban� ba�lant� dizesini `appsettings.json`'dan alacak �ekilde yap�land�r�n.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger yap�land�rmas�
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Web API i�in gerekli di�er servisleri ekleyin.
builder.Services.AddControllers();

var app = builder.Build();

// Swagger'� geli�tirme ortam�nda aktif et
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();  // Swagger'� etkinle�tir
    app.UseSwaggerUI(); // Swagger UI'yi etkinle�tir
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
