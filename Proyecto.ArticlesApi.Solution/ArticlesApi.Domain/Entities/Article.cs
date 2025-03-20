using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArticlesApi.Domain.Entities
{
    public class Article
    {
        [Key]
        public string? Id { get; set; }
        public string? Title { get; set; }
        public List<Author> Authors { get; set; } = new List<Author>(); 
        public string? Abstract { get; set; }
        public string? PublishedDate { get; set; }
        public string? Journal { get; set; }
        public string? DownloadUrl { get; set; }
        public List<Links> Links { get; set; } = new List<Links>(); 
        public string? FullText { get; set; }
        public List<string> Subjects { get; set; } = new List<string>();
        public int YearPublished { get; set; }
    }
}
