function errorHandler(err, req, res, next) {
  // unauthorized error
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      message: "Unauthorized access!!",
      error: true,
      success: false,
    });
  }

  // validation error
  if (err.name === "ValidationError") {
    return res.status(401).json({
      message: err,
      error: true,
      success: false,
    });
  }

  // default error - internal server error
  return res.status(500).json({
    message: err,
    error: true,
    success: false,
  });
}

module.exports = errorHandler;
