const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const app = express();
const PORT = 50005; // Servidor para imágenes

// 📁 Carpeta donde se guardarán las imágenes
const uploadDir = path.join(__dirname, "../proyectoFront/public/user_profiles");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🎯 Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.params.userId;
    cb(null, `user_${userId}.png`); // Nombre fijo por usuario
  },
});

const upload = multer({ storage });

// 📤 Ruta para subir imagen de perfil de usuario
app.post("/upload-profile/:userId", upload.single("image"), async (req, res) => {
  const userId = req.params.userId;
  const outputFilePath = path.join(uploadDir, `user_${userId}.png`);

  if (!req.file) {
    return res.status(400).json({ message: "No se subió ninguna imagen." });
  }

  try {
    // Validar tipo
    const mimeType = req.file.mimetype;
    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Formato de imagen no soportado." });
    }

    // Convertir y guardar como PNG
    await sharp(req.file.path).resize(300, 300).png().toFile(outputFilePath);

    res.json({ filePath: `/user_profiles/user_${userId}.png` });
  } catch (error) {
    console.error("❌ Error al procesar imagen:", error.message);
    res.status(500).json({ message: "Error al procesar la imagen." });
  }
});

// 📥 Servir imágenes públicamente
app.use("/user_profiles", express.static(uploadDir));

// 🚀 Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🖼️ Servidor de imágenes corriendo en http://localhost:${PORT}`);
});
