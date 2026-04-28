namespace BookAppApi.Models;

public class Quote
{
    public int Id { get; set; }

    public string Content { get; set; } = "";
    public string Author { get; set; } = "";
    public int UserId { get; set; }
}