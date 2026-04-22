using BookAppApi.Data;
using BookAppApi.Models;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlite("Data Source=books.db"));

var app = builder.Build();

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
await db.Books.ToListAsync());

app.MapPost("/api/books", async (Book newBook, AppDbContext db) =>
{
    db.Books.Add(newBook);
    await db.SaveChangesAsync();
    return Results.Created($"/api/books/{newBook.Id}", newBook);
});

app.MapPut("/api/books/{id}", async (int id, Book updatedBook, AppDbContext db) =>
{
    if (id != updatedBook.Id)
    {
        return Results.BadRequest("Id mismatch");
    }
    ;

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
});



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
});

app.Run();
