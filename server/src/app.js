const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const morgan = require("morgan");
const createError = require("http-errors");
const helmet = require("helmet");
const passport = require("passport");
const path = require("path");
const rateLimit = require("express-rate-limit");

const applyCors = require("./middlewares/corsHandler");
const { errorResponse } = require("./controllers/responseController");
const bannerRouter = require("./routers/bannerRouter");

// Initialize Express app
const app = express();

// ✅ Apply middlewares
applyCors(app);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(passport.initialize());

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP
  message: "Too many requests. Please try again later.",
});
app.use(limiter);

// ✅ Routes
app.use("/api/banners", bannerRouter);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Server & Sequelize working fine!");
});

// ✅ 404 handler
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status || 500,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
