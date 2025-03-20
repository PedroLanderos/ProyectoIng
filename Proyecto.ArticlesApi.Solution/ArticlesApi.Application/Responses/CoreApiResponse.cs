using ArticlesApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArticlesApi.Application.Responses
{
    public class CoreApiResponse<T>
    {
        public int TotalHits { get; set; }
        public int Limit { get; set; }
        public int Offset { get; set; }
        public List<T>? Results { get; set; }
    }
}
