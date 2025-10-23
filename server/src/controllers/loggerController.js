const logger = {
  log: (level, message, meta = "") => {
    const time = new Date().toISOString();
    console.log(`[${time}] [${level.toUpperCase()}]: ${message}`, meta);
  },
};

module.exports = logger;
