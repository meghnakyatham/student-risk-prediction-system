// middleware/logMiddleware.js
const logWorkflow = require("../logs/logger");

module.exports = function workflowLogger(req, res, next) {
  res.on("finish", () => {
    logWorkflow({
      status: res.statusCode,
      method: req.method,
      route: req.originalUrl,
      input_summary: req.body || {},
      user: req.user?._id || "anonymous",
      message: "Request processed",
    });
  });

  next();
};
