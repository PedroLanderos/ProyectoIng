const express = require("express");
const cors = require("cors"); // ✅ <- IMPORTANTE
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const app = express();
const PORT = 5006;

// ✅ Habilitar CORS para permitir requests desde el frontend
app.use(cors());

// 📁 Ruta donde se guardarán las imágenes procesadas
const uploadFolder = path.join(__dirname, "../proyectoFront/public/user_profiles");

// Crear carpeta si no existe
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
  console.log("📂 Carpeta de salida creada:", uploadFolder);
}

// ⚙️ Configuración de Multer para guardar temporalmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempPath = path.join(__dirname, "temp");
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
      console.log("📂 Carpeta temporal creada:", tempPath);
    }
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ Endpoint para subir la imagen
app.post("/upload/:userId", upload.single("image"), async (req, res) => {
  const userId = req.params.userId;
  console.log("📨 Subiendo imagen para usuario:", userId);

  if (!req.file) {
    console.warn("⚠️ No se recibió ninguna imagen.");
    return res.status(400).json({ message: "No se subió ninguna imagen." });
  }

  const tempFilePath = req.file.path;
  const outputFilePath = path.join(uploadFolder, `user_${userId}.png`);
  console.log("🛠️ Procesando imagen temporal:", tempFilePath);

  try {
    const mimeType = req.file.mimetype;
    console.log("🧾 Tipo MIME:", mimeType);

    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
      fs.unlinkSync(tempFilePath);
      console.warn("⚠️ Formato no soportado:", mimeType);
      return res.status(400).json({ message: "Formato de imagen no soportado." });
    }

    await sharp(tempFilePath)
      .resize(300, 300)
      .png({ quality: 80 })
      .toFile(outputFilePath);

    console.log("✅ Imagen procesada y guardada en:", outputFilePath);

    setTimeout(() => {
      try {
        fs.unlinkSync(tempFilePath);
        console.log("🧹 Temporal eliminado:", tempFilePath);
      } catch (err) {
        console.error("⚠️ Error al borrar archivo temporal:", err.message);
      }
    }, 100);

    res.json({ filePath: `/user_profiles/user_${userId}.png` });
  } catch (error) {
    console.error("❌ Error al procesar imagen:", error);
    res.status(500).json({ message: "Error al procesar la imagen." });
  }
});

// 🖼️ Servir imágenes
app.use("/user_profiles", express.static(uploadFolder));

// 🌐 Error global de rutas no encontradas
app.use((req, res) => {
  console.warn(`🔍 Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).send("Ruta no encontrada");
});

// 🚨 Errores globales del proceso
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err.stack || err.message);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
});

app.listen(PORT, () => {
  console.log(`🖼️ Servidor de imágenes corriendo en http://localhost:${PORT}`);
});
