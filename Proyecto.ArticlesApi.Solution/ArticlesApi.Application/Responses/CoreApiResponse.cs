using ArticlesApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ArticlesApi.Application.Responses
{
    public class CoreApiResponse<T>
    {
        [JsonProperty("results")]
        public List<T>? Results { get; set; }

        [JsonProperty("totalHits")]
        public int TotalHits { get; set; }

        [JsonProperty("limit")]
        public int Limit { get; set; }

        [JsonProperty("offset")]
        public int Offset { get; set; }

        public int CurrentPage => (Offset / Limit) + 1;
    }
}
