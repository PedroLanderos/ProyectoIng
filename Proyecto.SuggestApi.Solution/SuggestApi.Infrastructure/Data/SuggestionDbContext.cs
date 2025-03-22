using Microsoft.EntityFrameworkCore;
using SuggestApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Infrastructure.Data
{
    public class SuggestionDbContext(DbContextOptions<SuggestionDbContext> options) : DbContext(options)
    {
        public DbSet<UserActivity> UserActivities { get; set; }
    }
}
