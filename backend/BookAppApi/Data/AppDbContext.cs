using BookAppApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookAppApi.Data;

public class AppDbContext : DbContext

{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    public DbSet<Book> Books => Set<Book>();
    public DbSet<User> Users => Set<User>();
}