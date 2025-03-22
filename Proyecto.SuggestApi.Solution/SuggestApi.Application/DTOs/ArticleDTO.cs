using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Application.DTOs
{
    public class ArticleDTO
    {
        public string? Id { get; set; }
        public string? Title { get; set; }
        public List<string>? Authors { get; set; } = new List<string>();
        public string? Abstract { get; set; }
        public string? PublishedDate { get; set; }
        public string? DownloadUrl { get; set; }
        public string? ViewUrl { get; set; }
    }
}
