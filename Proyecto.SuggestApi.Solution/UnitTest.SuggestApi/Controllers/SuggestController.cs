using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using SuggestApi.Application.DTOs;
using SuggestApi.Application.Interfaces;
using SuggestiApi.Presentation.Controllers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Llaveremos.SharedLibrary.Responses;
using SuggestApi.Domain.Entities;
using SuggestApi.Application.Services;

namespace UnitTest.SuggestApi.Controllers
{
    public class SuggestController
    {
        private readonly ISuggestion _suggestionService;
        private readonly ISearchHistory _searchHistoryService;
        private readonly UserDataController _userDataController;

        public SuggestController()
        {
            _suggestionService = A.Fake<ISuggestion>();
            _searchHistoryService = A.Fake<ISearchHistory>();
            _userDataController = new UserDataController(_suggestionService, _searchHistoryService);
        }

        [Fact]
        public async Task GetRecommendations_ShouldReturnOk_WhenRecommendationsExist()
        {
            // Arrange
            var recommendations = new List<ArticleDTO>
            {
                new ArticleDTO { Id = "1", Title = "Sample Article" }
            };

            A.CallTo(() => _suggestionService.GetRecommendations(1))
                .Returns(Task.FromResult<IEnumerable<ArticleDTO>>(recommendations));

            // Act
            var result = await _userDataController.GetRecommendations(1);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task GetRecommendations_ShouldReturnNotFound_WhenNoRecommendations()
        {
            // Arrange
            A.CallTo(() => _suggestionService.GetRecommendations(1)).Returns(Task.FromResult<IEnumerable<ArticleDTO>>(new List<ArticleDTO>()));

            // Act
            var result = await _userDataController.GetRecommendations(1);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult?.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task GetUserHistory_ShouldReturnOk_WhenHistoryExists()
        {
            // Arrange
            var history = new List<UserActivity>
            {
                new UserActivity { Id = 1, UserId = 1, ArticleId = "A1", IsFavorite = true }
            };

            A.CallTo(() => _searchHistoryService.GetByCriteriaAsync(A<System.Linq.Expressions.Expression<System.Func<UserActivity, bool>>>._))
                .Returns(Task.FromResult(history));

            // Act
            var result = await _userDataController.GetUserHistory(1);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task GetUserHistory_ShouldReturnNotFound_WhenNoHistory()
        {
            // Arrange
            A.CallTo(() => _searchHistoryService.GetByCriteriaAsync(A<System.Linq.Expressions.Expression<System.Func<UserActivity, bool>>>._))
                .Returns(Task.FromResult(new List<UserActivity>()));

            // Act
            var result = await _userDataController.GetUserHistory(1);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult?.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task DeleteUserHistory_ShouldReturnOk_WhenActivityDeleted()
        {
            // Arrange
            var userActivity = new UserActivity { Id = 1 };
            var response = new Response(true, "Deleted successfully");

            A.CallTo(() => _searchHistoryService.FindByIdAsync(1)).Returns(Task.FromResult(userActivity));
            A.CallTo(() => _searchHistoryService.DeleteAsync(userActivity)).Returns(Task.FromResult(response));

            // Act
            var result = await _userDataController.DeleteUserHistory(1);

            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task DeleteUserHistory_ShouldReturnNotFound_WhenActivityDoesNotExist()
        {
            // Arrange
            A.CallTo(() => _searchHistoryService.FindByIdAsync(1)).Returns(Task.FromResult<UserActivity>(null!));

            // Act
            var result = await _userDataController.DeleteUserHistory(1);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult?.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task SaveUserHistory_ShouldReturnCreated_WhenSuccessful()
        {
            // Arrange
            var userActivityDTO = new UserActivityDTO { Id = 1, UserId = 1, ArticleId = "A1" };
            var response = new Response(true, "Saved successfully");

            A.CallTo(() => _searchHistoryService.SaveAsync(A<UserActivity>._)).Returns(Task.FromResult(response));

            // Act
            var result = await _userDataController.SaveUserHistory(userActivityDTO);

            // Assert
            var createdResult = result as CreatedAtActionResult;
            createdResult.Should().NotBeNull();
            createdResult?.StatusCode.Should().Be(201);
        }

        [Fact]
        public async Task EditUserHistory_ShouldReturnOk_WhenSuccessful()
        {
            // Arrange
            var userActivityDTO = new UserActivityDTO { Id = 1, UserId = 1, ArticleId = "A1" };
            var response = new Response(true, "Edited successfully");

            A.CallTo(() => _searchHistoryService.EditAsync(A<UserActivity>._)).Returns(Task.FromResult(response));

            // Act
            var result = await _userDataController.EditUserHistory(1, userActivityDTO);

            // Assert
            var okResult = result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task EditUserHistory_ShouldReturnBadRequest_WhenIdMismatch()
        {
            // Arrange
            var userActivityDTO = new UserActivityDTO { Id = 2, UserId = 1, ArticleId = "A1" };

            // Act
            var result = await _userDataController.EditUserHistory(1, userActivityDTO);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult.Should().NotBeNull();
            badRequestResult?.StatusCode.Should().Be(400);
        }

        [Fact]
        public async Task GetFavorites_ShouldReturnOk_WhenFavoritesExist()
        {
            // Arrange
            var favorites = new List<UserActivity>
            {
                new UserActivity { Id = 1, UserId = 1, ArticleId = "A1", IsFavorite = true }
            };

            A.CallTo(() => _searchHistoryService.GetByCriteriaAsync(A<System.Linq.Expressions.Expression<System.Func<UserActivity, bool>>>._))
                .Returns(Task.FromResult(favorites));

            // Act
            var result = await _userDataController.GetFavorites(1);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task GetFavorites_ShouldReturnNotFound_WhenNoFavorites()
        {
            // Arrange
            A.CallTo(() => _searchHistoryService.GetByCriteriaAsync(A<System.Linq.Expressions.Expression<System.Func<UserActivity, bool>>>._))
                .Returns(Task.FromResult(new List<UserActivity>()));

            // Act
            var result = await _userDataController.GetFavorites(1);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult?.StatusCode.Should().Be(404);
        }

        [Fact]
        public async Task IsArticleFavorite_ShouldReturnTrue_WhenFavoriteExists()
        {
            // Arrange
            var favoriteList = new List<UserActivity>
            {
                new UserActivity { Id = 1, UserId = 1, ArticleId = "A1", IsFavorite = true }
            };

            A.CallTo(() => _searchHistoryService.GetByCriteriaAsync(A<System.Linq.Expressions.Expression<System.Func<UserActivity, bool>>>._))
                .Returns(Task.FromResult(favoriteList));

            // Act
            var result = await _userDataController.IsArticleFavorite(1, "A1");

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be(200);
            okResult?.Value.Should().Be(true);
        }

        [Fact]
        public async Task IsArticleFavorite_ShouldReturnFalse_WhenFavoriteDoesNotExist()
        {
            // Arrange
            A.CallTo(() => _searchHistoryService.GetByCriteriaAsync(A<System.Linq.Expressions.Expression<System.Func<UserActivity, bool>>>._))
                .Returns(Task.FromResult(new List<UserActivity>()));

            // Act
            var result = await _userDataController.IsArticleFavorite(1, "A1");

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult?.StatusCode.Should().Be(200);
            okResult?.Value.Should().Be(false);
        }
    }
}
