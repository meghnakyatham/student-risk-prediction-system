// logs/logger.js
const fs = require("fs");
const path = require("path");

module.exports = function logWorkflow(data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...data
  };

  const filePath = path.join(__dirname, "workflow.log");

  fs.appendFile(filePath, JSON.stringify(logEntry) + "\n", (err) => {
    if (err) console.error("Log write error:", err);
  });
};
