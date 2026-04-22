using BookAppApi.Data;
using BookAppApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();



builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlite("Data Source=books.db"));

var key = "super_secret_key_123!super_secret_key_123!";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.MapGet("/", () => "Book API is running");

app.MapGet("/api/books", async (AppDbContext db) =>
await db.Books.ToListAsync())
.RequireAuthorization();

app.MapPost("/api/books", async (Book newBook, AppDbContext db) =>
{
    db.Books.Add(newBook);
    await db.SaveChangesAsync();
    return Results.Created($"/api/books/{newBook.Id}", newBook);
}).RequireAuthorization();

app.MapPut("/api/books/{id}", async (int id, Book updatedBook, AppDbContext db) =>
{
    if (id != updatedBook.Id)
    {
        return Results.BadRequest("Id mismatch");
    }

    var existingBook = await db.Books.FindAsync(id);

    if (existingBook == null)
    {
        return Results.NotFound();
    }

    existingBook.Title = updatedBook.Title;
    existingBook.Author = updatedBook.Author;
    existingBook.PublishedDate = updatedBook.PublishedDate;

    await db.SaveChangesAsync();

    return Results.Ok(existingBook);
}).RequireAuthorization();



app.MapDelete("/api/books/{id}", async (int id, AppDbContext db) =>
{
    var book = await db.Books.FindAsync(id);
    if (book is null)
    {
        return Results.NotFound();
    }

    db.Books.Remove(book);
    await db.SaveChangesAsync();

    return Results.NoContent();
}).RequireAuthorization();

app.MapPost("/api/register", async (User newUser, AppDbContext db) =>
{
    var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Username == newUser.Username);

    if (existingUser is not null)
    {
        return Results.BadRequest("User already Exists");
    }
    db.Users.Add(newUser);
    await db.SaveChangesAsync();

    return Results.Ok(newUser);
});

app.MapPost("/api/login", async (User loginUser, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u =>
    u.Username == loginUser.Username &&
    u.Password == loginUser.Password);

    if (user is null)
    {
        return Results.Unauthorized();
    }
    var claims = new[]
    {
    new Claim(ClaimTypes.Name, user.Username),
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
};
    var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    var credentials = new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: credentials
    );
    var jwt = new JwtSecurityTokenHandler().WriteToken(token);
    return Results.Ok(new { token = jwt });
});


app.Run();
