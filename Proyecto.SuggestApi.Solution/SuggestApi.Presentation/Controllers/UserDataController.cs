using Llaveremos.SharedLibrary.Logs;
using Microsoft.AspNetCore.Mvc;
using SuggestApi.Application.DTOs;
using SuggestApi.Application.Interfaces;
using SuggestApi.Application.Mappers;
using SuggestApi.Application.Services;
using SuggestApi.Domain.Entities;

namespace SuggestiApi.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDataController : ControllerBase
    {
        private readonly ISuggestion _suggestionService;
        private readonly ISearchHistory _searchHistoryService;

        public UserDataController(ISuggestion suggestionService, ISearchHistory searchHistoryService)
        {
            _suggestionService = suggestionService;
            _searchHistoryService = searchHistoryService;
        }

        [HttpGet("recommendations/{userId}")]
        public async Task<ActionResult<IEnumerable<ArticleDTO>>> GetRecommendations(int userId)
        {
            try
            {
                var recommendations = await _suggestionService.GetRecommendations(userId);

                if (recommendations == null || !recommendations.Any())
                {
                    return NotFound("No recommendations found for this user.");
                }

                return Ok(recommendations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("history/{userId}")]
        public async Task<ActionResult<IEnumerable<UserActivityDTO>>> GetUserHistory(int userId)
        {
            try
            {
                var userHistory = await _searchHistoryService.GetByCriteriaAsync(x => x.UserId == userId);

                if (userHistory == null || !userHistory.Any())
                {
                    return NotFound("No history found for this user.");
                }

                var userHistoryDTOs = UserActivityMapper.ToDTO(userHistory);
                return Ok(userHistoryDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("history/{id}")]
        public async Task<ActionResult> DeleteUserHistory(int id)
        {
            try
            {
                var userActivity = await _searchHistoryService.FindByIdAsync(id);

                if (userActivity == null)
                {
                    return NotFound("User activity not found.");
                }

                var response = await _searchHistoryService.DeleteAsync(userActivity);

                if (!response.Flag)
                {
                    return BadRequest(response.Message);
                }

                return Ok(response.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("history")]
        public async Task<ActionResult> SaveUserHistory([FromBody] UserActivityDTO userActivityDTO)
        {
            try
            {
                var userActivity = UserActivityMapper.ToEntity(userActivityDTO);

                var response = await _searchHistoryService.SaveAsync(userActivity);

                if (!response.Flag)
                {
                    return BadRequest(response.Message);
                }

                return CreatedAtAction(nameof(GetUserHistory), new { userId = userActivity.UserId }, userActivityDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("history/{id}")]
        public async Task<ActionResult> EditUserHistory(int id, [FromBody] UserActivityDTO userActivityDTO)
        {
            try
            {
                if (id != userActivityDTO.Id)
                    return BadRequest("ID mismatch");

                var userActivity = UserActivityMapper.ToEntity(userActivityDTO);

                var response = await _searchHistoryService.EditAsync(userActivity);

                if (!response.Flag)
                {
                    return BadRequest(response.Message);
                }

                return Ok(userActivityDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("favorites/{userId}")]
        public async Task<ActionResult<IEnumerable<UserActivityDTO>>> GetFavorites(int userId)
        {
            try
            {
                var favorites = await _searchHistoryService.GetByCriteriaAsync(x => x.UserId == userId && x.IsFavorite);

                if (favorites == null || !favorites.Any())
                {
                    return NotFound("No favorite articles found for this user.");
                }

                var dtoList = UserActivityMapper.ToDTO(favorites);
                return Ok(dtoList);
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("favorites/{userId}/check/{articleId}")]
        public async Task<ActionResult<bool>> IsArticleFavorite(int userId, string articleId)
        {
            try
            {
                var match = await _searchHistoryService.GetByCriteriaAsync(
                    x => x.UserId == userId && x.ArticleId == articleId && x.IsFavorite
                );

                return Ok(match.Any());
            }
            catch (Exception ex)
            {
                LogException.LogExceptions(ex);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("ping")]
        public async Task<IActionResult> Ping()
        {
            try
            {
                var authResponse = await _suggestionService.PingAuthentication();
                var articlesResponse = await _suggestionService.PingArticles();

                return Ok(new
                {
                    AuthenticationStatus = authResponse,
                    ArticlesStatus = articlesResponse
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ping error: {ex.Message}");
            }
        }
    }
}
