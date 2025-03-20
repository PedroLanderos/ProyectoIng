using ArticlesApi.Application.Services;
using ArticlesApi.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArticlesApi.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IScientificArticleService _articleService;
        public ArticleController(IScientificArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Article>>> SearchArticles(
            [FromQuery] string query,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 15,
            [FromQuery] string author = null!,
            [FromQuery] int? year = null,
            [FromQuery] string subject = null!)
        {
            var articles = await _articleService.SearchArticlesAsync(query, page, pageSize, author, year, subject);
            return Ok(articles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Article>> GetArticleById(string id)
        {
            var article = await _articleService.GetArticleByIdAsync(id);
            if (article == null) return NotFound();
            return Ok(article);
        }
    }
}
