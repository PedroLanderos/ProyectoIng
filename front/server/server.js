const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const app = express();
const PORT = 50005;

// 📁 Ruta donde se guardarán las imágenes procesadas
const uploadFolder = path.join(__dirname, "../proyectoFront/public/user_profiles");

// Asegurarse que la carpeta exista
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// ⚙️ Configuración de Multer para archivos temporales
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempPath = path.join(__dirname, "temp");
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
    }
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// 📤 Ruta para subir imagen del usuario
app.post("/upload/:userId", upload.single("image"), async (req, res) => {
  const userId = req.params.userId;

  if (!req.file) {
    return res.status(400).json({ message: "No se subió ninguna imagen." });
  }

  const tempFilePath = req.file.path;
  const outputFilePath = path.join(uploadFolder, `user_${userId}.png`);

  try {
    const mimeType = req.file.mimetype;
    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
      fs.unlinkSync(tempFilePath);
      return res.status(400).json({ message: "Formato de imagen no soportado." });
    }

    // 🔧 Procesar y guardar imagen
    await sharp(tempFilePath)
      .resize(300, 300) // opcional: tamaño estándar
      .png({ quality: 80 })
      .toFile(outputFilePath);

    // 🧹 Borrar temporal
    setTimeout(() => {
      try {
        fs.unlinkSync(tempFilePath);
        console.log("🧹 Temporal eliminado:", tempFilePath);
      } catch (err) {
        console.error("⚠️ Error al eliminar temp:", err.message);
      }
    }, 100);

    res.json({ filePath: `/user_profiles/user_${userId}.png` });
  } catch (error) {
    console.error("❌ Error al procesar imagen:", error.message);
    res.status(500).json({ message: "Error al procesar la imagen." });
  }
});

// 🌐 Servir imágenes procesadas
app.use("/user_profiles", express.static(path.join(__dirname, "../proyectoFront/public/user_profiles")));

app.listen(PORT, () => {
  console.log(`🖼️ Servidor de imágenes corriendo en http://localhost:${PORT}`);
});
