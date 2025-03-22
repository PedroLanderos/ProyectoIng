using SuggestApi.Application.DTOs;
using SuggestApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Application.Mappers
{
    public static class UserActivityMapper
    {
        public static UserActivityDTO ToDTO(UserActivity userActivity)
        {
            if (userActivity == null)
                return null!;

            return new UserActivityDTO
            {
                Id = userActivity.Id,
                UserId = userActivity.UserId,
                ArticleId = userActivity.ArticleId,
                IsFavorite = userActivity.IsFavorite
            };
        }

        public static IEnumerable<UserActivityDTO> ToDTO(IEnumerable<UserActivity> userActivities)
        {
            if (userActivities == null)
                return Enumerable.Empty<UserActivityDTO>();

            return userActivities.Select(userActivity => ToDTO(userActivity));
        }

        // Convertir un UserActivityDTO a un UserActivity
        public static UserActivity ToEntity(UserActivityDTO userActivityDTO)
        {
            if (userActivityDTO == null)
                return null!;

            return new UserActivity
            {
                Id = userActivityDTO.Id,
                UserId = userActivityDTO.UserId,
                ArticleId = userActivityDTO.ArticleId,
                IsFavorite = userActivityDTO.IsFavorite
            };
        }

        // Convertir una lista de UserActivityDTO a una lista de UserActivity
        public static IEnumerable<UserActivity> ToEntity(IEnumerable<UserActivityDTO> userActivityDTOs)
        {
            if (userActivityDTOs == null)
                return Enumerable.Empty<UserActivity>();

            return userActivityDTOs.Select(userActivityDTO => ToEntity(userActivityDTO));
        }
    }
}
