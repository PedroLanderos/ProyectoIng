public class ArticleDTO
{
    public string? Id { get; set; }
    public string? Title { get; set; }
    public List<AuthorDTO> Authors { get; set; } = new();
    public string? Abstract { get; set; }
    public string? PublishedDate { get; set; }
    public string? DownloadUrl { get; set; }
    public string? ViewUrl { get; set; }

    // ✅ Campos útiles para recomendaciones
    public List<string> Subjects { get; set; } = new();
    public string? FullText { get; set; }

    // Opcional: si querés mostrar más fuentes
    public List<LinkDTO> Links { get; set; } = new();
}

public class AuthorDTO
{
    public string? Name { get; set; }
}

public class LinkDTO
{
    public string? Type { get; set; }
    public string? Url { get; set; }
}
