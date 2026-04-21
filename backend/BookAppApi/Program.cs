var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

/* app.UseHttpsRedirection(); */


var books = new List<Book>
{
   new Book(1, "Infinite Jest", "David Foster Wallace", new DateOnly(1996, 2, 1)),
   new Book(2, "Mannen som förväxlade sin hustru med en hatt", "Oliver Sacks", new DateOnly(1985, 1, 1))
};

app.MapGet("/", () => "Book API is running");

app.MapGet("/api/books", () => books);

app.MapPost("/api/books", (Book newBook) =>
{
    books.Add(newBook);
    return Results.Created($"/api/books/{newBook.Id}", newBook);
});

app.Run();


public record Book(int Id, string Title, string Author, DateOnly PublishedDate);