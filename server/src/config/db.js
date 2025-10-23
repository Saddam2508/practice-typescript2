const { Sequelize } = require("sequelize");
const logger = require("../controllers/loggerController");

// 🔹 PostgreSQL connection using Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST || "localhost",
//     port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
//     dialect: "postgres",
//     logging: false,
//   }
// );

// 🔹 Connect function
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.log("info", "✅ Connected to PostgreSQL via Sequelize!");
  } catch (error) {
    logger.log("error", `❌ Could not connect to PostgreSQL: ${error.message}`);
    process.exit(1);
  }
};

// 🔹 Graceful exit handler
const gracefulExit = async (signal) => {
  try {
    await sequelize.close();
    logger.log(
      "info",
      `🧹 PostgreSQL connection closed${signal ? ` (${signal})` : ""}`
    );
  } catch (err) {
    logger.log("error", "⚠️ Error during disconnect:", err.message);
  } finally {
    process.exit(signal === "SIGINT" ? 0 : 1);
  }
};

process.on("beforeExit", () => gracefulExit());
process.on("SIGINT", () => gracefulExit("SIGINT"));
process.on("SIGTERM", () => gracefulExit("SIGTERM"));

module.exports = { sequelize, connectDatabase };
