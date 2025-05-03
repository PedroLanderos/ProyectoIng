using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuggestApi.Application.Services
{
    public interface IHeap
    {
        //decifrar la combinacion de id titulo
        string Decipher(string encrypted, string key);
        //crear el heap
        Dictionary<string, int> CreateHeap(string tittle);
    }
}
