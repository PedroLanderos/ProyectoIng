# Usa una imagen oficial de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
COPY server.js ./

# Instala las dependencias
RUN npm install

# Asegura que el directorio de imágenes exista dentro del contenedor
RUN mkdir -p ../proyectoFront/public/user_profiles

# Expone el puerto del servidor de imágenes
EXPOSE 5004

# Comando para iniciar el servidor
CMD ["node", "server.js"]
