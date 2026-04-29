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

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://book-app-rho-sable.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("FrontendPolicy");
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

app.MapGet("/api/books", async (AppDbContext db, HttpContext http) =>
{
    var userId = int.Parse(http.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    return await db.Books.Where(b => b.UserId == userId).ToListAsync();
}).RequireAuthorization();

app.MapPost("/api/books", async (Book newBook, AppDbContext db, HttpContext http) =>
{
    var userId = int.Parse(http.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    newBook.UserId = userId;
    db.Books.Add(newBook);
    await db.SaveChangesAsync();
    return Results.Created($"/api/books/{newBook.Id}", newBook);
}).RequireAuthorization();



app.MapPut("/api/books/{id}", async (int id, Book updatedBook, AppDbContext db, HttpContext http) =>
{
    var userId = int.Parse(http.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);


    if (id != updatedBook.Id)
    {
        return Results.BadRequest("Id mismatch");
    }

    var existingBook = await db.Books.FindAsync(id);

    if (existingBook == null)
    {
        return Results.NotFound();
    }

    if (existingBook.UserId != userId)
    {
        return Results.Forbid();
    }

    existingBook.Title = updatedBook.Title;
    existingBook.Author = updatedBook.Author;
    existingBook.PublishedDate = updatedBook.PublishedDate;

    await db.SaveChangesAsync();

    return Results.Ok(existingBook);
}).RequireAuthorization();

app.MapDelete("/api/books/{id}", async (int id, AppDbContext db, HttpContext http) =>
{
    var userId = int.Parse(http.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    var book = await db.Books.FindAsync(id);
    if (book is null)
    {
        return Results.NotFound();
    }
    if (book.UserId != userId)
    {
        return Results.Forbid();
    }

    db.Books.Remove(book);
    await db.SaveChangesAsync();

    return Results.NoContent();
}).RequireAuthorization();

app.MapPost("/api/register", async (User newUser, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(newUser.Username) || string.IsNullOrWhiteSpace(newUser.Password))
    {
        return Results.BadRequest("Username and password are required");
    }

    if (newUser.Username.Length < 3 || newUser.Password.Length < 6)
    {
        return Results.BadRequest("Username must be at least 3 characters and password at least 6");
    }

    newUser.Username = newUser.Username.ToLower();

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
    u.Username == loginUser.Username.ToLower() &&
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

app.MapGet("/api/quotes", async (AppDbContext db, HttpContext http) =>
{
    var userId = int.Parse(http.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    return await db.Quotes.Where(q => q.UserId == userId).ToListAsync();
}).RequireAuthorization();

app.MapPost("/api/quotes", async (Quote newQuote, AppDbContext db, HttpContext http) =>
{
    var userId = int.Parse(http.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    newQuote.UserId = userId;
    db.Quotes.Add(newQuote);
    await db.SaveChangesAsync();
    return Results.Created($"/api/quotes/{newQuote.Id}", newQuote);
}).RequireAuthorization();

app.MapPut("/api/quotes/{id}", async (int id, Quote updatedQuote, AppDbContext db, HttpContext http) =>
{
    var userId = int.Parse(http.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);


    if (id != updatedQuote.Id)
    {
        return Results.BadRequest("Id mismatch");
    }
    var existingQuote = await db.Quotes.FindAsync(id);
    if (existingQuote == null)
    {
        return Results.NotFound();
    }
    if (existingQuote.UserId != userId)
    {
        return Results.Forbid();
    }
    existingQuote.Content = updatedQuote.Content;
    existingQuote.Author = updatedQuote.Author;

    await db.SaveChangesAsync();
    return Results.Ok(existingQuote);

}).RequireAuthorization();

app.MapDelete("/api/quotes/{id}", async (int id, AppDbContext db, HttpContext http) =>
{

    var userId = int.Parse(http.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    var quote = await db.Quotes.FindAsync(id);
    if (quote is null)
    {
        return Results.NotFound();
    }
    if (quote.UserId != userId)
    {
        return Results.Forbid();
    }
    db.Quotes.Remove(quote);
    await db.SaveChangesAsync();
    return Results.NoContent();

}).RequireAuthorization();

app.Run();
