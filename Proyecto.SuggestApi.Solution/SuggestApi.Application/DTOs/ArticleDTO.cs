public class ArticleDTO
{
    public string? Id { get; set; }
    public string? Title { get; set; }
    public List<AuthorDTO> Authors { get; set; } = new();
    public string? Abstract { get; set; }
    public string? PublishedDate { get; set; }
    public string? DownloadUrl { get; set; }
    public string? ViewUrl { get; set; }
}
public class AuthorDTO
{
    public string? Name { get; set; }
}
