using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Application.DTOs
{
    public class UserActivityDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? ArticleId { get; set; }
        public bool IsFavorite { get; set; } = false;
    }
}
