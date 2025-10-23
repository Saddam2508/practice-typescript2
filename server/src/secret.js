require("dotenv").config();

const serverPort = process.env.PORT || 5000;

// Cloudinary
const cloudinaryName = process.env.CLOUDINARY_NAME || "";
const cloudinaryApiKey = process.env.CLOUDINARY_API || "";
const cloudinarySecret = process.env.CLOUDINARY_SECRET || ""; // Corrected spelling

module.exports = {
  serverPort,
  databaseUrl: process.env.DATABASE_URL, // Neon বা অন্য PostgreSQL URL
  cloudinaryName,
  cloudinaryApiKey,
  cloudinarySecret,
};
