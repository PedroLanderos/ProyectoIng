using Llaveremos.SharedLibrary.Logs;
using Microsoft.AspNetCore.Mvc;
using SuggestApi.Application.DTOs;
using SuggestApi.Application.Interfaces;
using SuggestApi.Application.Mappers;
using SuggestApi.Application.Services;
using SuggestApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        #region **Recomendaciones**

        // Endpoint para obtener recomendaciones basadas en el historial del usuario
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

        #endregion

        #region **Historial de Actividades**

        // Endpoint para obtener el historial de actividades de un usuario
        [HttpGet("history/{userId}")]
        public async Task<ActionResult<IEnumerable<UserActivityDTO>>> GetUserHistory(int userId)
        {
            try
            {
                // Obtener historial de búsquedas del usuario (artículos visitados)
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

        // Endpoint para eliminar una actividad del historial de un usuario
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

        #endregion

        #region **Guardar Actividad**

        // Endpoint para guardar una nueva actividad del usuario (por ejemplo, un artículo marcado como favorito)
        [HttpPost("history")]
        public async Task<ActionResult> SaveUserHistory([FromBody] UserActivityDTO userActivityDTO)
        {
            try
            {
                // Mapear el DTO a la entidad
                var userActivity = UserActivityMapper.ToEntity(userActivityDTO);

                // Guardar la actividad del usuario
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

        #endregion

        #region **Editar Actividad**

        // Endpoint para editar una actividad del historial del usuario
        [HttpPut("history/{id}")]
        public async Task<ActionResult> EditUserHistory(int id, [FromBody] UserActivityDTO userActivityDTO)
        {
            try
            {
                if (id != userActivityDTO.Id)
                {
                    return BadRequest("ID mismatch");
                }

                // Mapear el DTO a la entidad
                var userActivity = UserActivityMapper.ToEntity(userActivityDTO);

                // Editar la actividad del usuario
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

        #endregion
    }
}
