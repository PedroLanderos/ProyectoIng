using ArticlesApi.Application.Interfaces;
using ArticlesApi.Application.Responses;
using ArticlesApi.Domain.Entities;
using ArticlesApi.Presentation.Controllers;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace UnitTest.ArticlesApi.Controllers
{
    public class ArticlesTest
    {
        private readonly IScientificArticleService _articleService;
        private readonly ArticleController _articleController;

        public ArticlesTest()
        {
            _articleService = A.Fake<IScientificArticleService>();
            _articleController = new ArticleController(_articleService);
        }

        [Fact]
        public async Task SearchArticles200()
        {
            // Arrange
            var response = new CoreApiResponse<Article>
            {
                Results = new List<Article>
                {
                    new Article
                    {
                        Id = "1",
                        Title = "Test Article",
                        Abstract = "This is a test article",
                        YearPublished = 2024
                    }
                },
                TotalHits = 1,
                Limit = 15,
                Offset = 0
            };

            A.CallTo(() => _articleService.SearchArticlesAsync("", 1, 15, "", null, "")).Returns(Task.FromResult(response));

            // Act
            var result = await _articleController.SearchArticles();

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be(200);

            var returnedResponse = okResult?.Value as CoreApiResponse<Article>;
            returnedResponse.Should().NotBeNull();
            returnedResponse?.Results.Should().HaveCount(1);
        }

        [Fact]
        public async Task SearchArticles429()
        {
            // Arrange
            A.CallTo(() => _articleService.SearchArticlesAsync(A<string>.Ignored, A<int>.Ignored, A<int>.Ignored, A<string>.Ignored, A<int?>.Ignored, A<string>.Ignored))
                .Throws(new InvalidOperationException("Rate limit"));

            // Act
            var result = await _articleController.SearchArticles();

            // Assert
            var statusCodeResult = result.Result as ObjectResult;
            statusCodeResult.Should().NotBeNull();
            statusCodeResult?.StatusCode.Should().Be(429);
        }

        [Fact]
        public async Task SearchArticles500()
        {
            // Arrange
            A.CallTo(() => _articleService.SearchArticlesAsync(A<string>.Ignored, A<int>.Ignored, A<int>.Ignored, A<string>.Ignored, A<int?>.Ignored, A<string>.Ignored))
                .Throws(new Exception("Internal server error"));

            // Act
            var result = await _articleController.SearchArticles();

            // Assert
            var statusCodeResult = result.Result as ObjectResult;
            statusCodeResult.Should().NotBeNull();
            statusCodeResult?.StatusCode.Should().Be(500);
        }

        [Fact]
        public async Task GetArticleById200()
        {
            // Arrange
            var article = new Article
            {
                Id = "1",
                Title = "Test Article"
            };

            A.CallTo(() => _articleService.GetArticleByIdAsync("1")).Returns(Task.FromResult(article));

            // Act
            var result = await _articleController.GetArticleById("1");

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be(200);

            var returnedArticle = okResult?.Value as Article;
            returnedArticle.Should().NotBeNull();
            returnedArticle?.Id.Should().Be("1");
        }

        [Fact]
        public async Task GetArticleById404()
        {
            // Arrange
            A.CallTo(() => _articleService.GetArticleByIdAsync("1")).Returns(Task.FromResult<Article>(null!));

            // Act
            var result = await _articleController.GetArticleById("1");

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult?.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task GetArticleById429()
        {
            // Arrange
            A.CallTo(() => _articleService.GetArticleByIdAsync("1")).Throws(new InvalidOperationException("Rate limit"));

            // Act
            var result = await _articleController.GetArticleById("1");

            // Assert
            var statusCodeResult = result.Result as ObjectResult;
            statusCodeResult.Should().NotBeNull();
            statusCodeResult?.StatusCode.Should().Be(429);
        }

        [Fact]
        public async Task GetArticleById500()
        {
            // Arrange
            A.CallTo(() => _articleService.GetArticleByIdAsync("1")).Throws(new Exception("Internal server error"));

            // Act
            var result = await _articleController.GetArticleById("1");

            // Assert
            var statusCodeResult = result.Result as ObjectResult;
            statusCodeResult.Should().NotBeNull();
            statusCodeResult?.StatusCode.Should().Be(500);
        }
    }
}
