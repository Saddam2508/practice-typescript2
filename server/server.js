require("dotenv").config();
const app = require("./src/app");
const { connectDatabase } = require("./src/config/db");
const logger = require("./src/controllers/loggerController");
const { serverPort } = require("./src/secret");

const PORT = serverPort || 5000;

const startServer = async () => {
  try {
    await connectDatabase(); // ✅ PostgreSQL via Sequelize connect
    app.listen(PORT, () => {
      logger.log("info", `🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.log("error", "❌ Failed to start server:", err.message);
  }
};

startServer();
