using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace SuggestApi.Application.Services
{
    public class Heap : IHeap
    {
        private static readonly HashSet<string> StopWords = new HashSet<string>
        {
            "el", "la", "los", "las", "de", "del", "y", "en", "a", "un", "una", "con",
            "por", "para", "es", "al", "lo", "su", "que", "se", "o", "como", "más", "sin",
            "sus", "sobre", "ya", "pero", "le", "entre",

            "the", "and", "in", "on", "at", "of", "for", "with", "without", "by", "to",
            "a", "an", "is", "are", "was", "were", "be", "been", "being", "has", "have",
            "had", "that", "this", "these", "those", "it", "its", "as", "from", "not",
            "or", "do", "does", "did", "can", "could", "would", "should", "will", "just",
            "also", "if", "then", "than", "too", "very", "such", "into", "about", "out"
        };

        public Dictionary<string, int> CreateHeap(string tittle)
        {
            if (string.IsNullOrEmpty(tittle))
                return new Dictionary<string, int>();

            var palabras = tittle
                .ToLower()
                .Split(new[] { ' ', ',', '.', ';', ':', '!', '?', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries);

            var frecuencia = new Dictionary<string, int>();
            foreach (var palabra in palabras)
            {
                if (StopWords.Contains(palabra)) continue;

                if (frecuencia.ContainsKey(palabra))
                    frecuencia[palabra]++;
                else
                    frecuencia[palabra] = 1;
            }

            var resultado = frecuencia
                .OrderByDescending(pair => pair.Value)
                .ToDictionary(pair => pair.Key, pair => pair.Value);

            return resultado;
        }

        public string Decipher(string encrypted, string key)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(encrypted) || key.Length != 16)
                    throw new ArgumentException("Clave inválida o string vacío.");

                byte[] keyBytes = Encoding.UTF8.GetBytes(key);
                byte[] ivBytes = Encoding.UTF8.GetBytes("c9P6u1GvTqR4Bn7f"); 

                using Aes aes = Aes.Create();
                aes.Key = keyBytes;
                aes.IV = ivBytes;

                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                using MemoryStream ms = new(Convert.FromBase64String(encrypted));
                using CryptoStream cs = new(ms, decryptor, CryptoStreamMode.Read);
                using StreamReader sr = new(cs);
                string plainText = sr.ReadToEnd();

                string[] partes = plainText.Split('-', 2);
                return partes.Length == 2 ? partes[1] : string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
