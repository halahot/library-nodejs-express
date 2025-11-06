// Глобальный обработчик ошибок
export function errorHandler(err, req, res) {
  console.error("Server error:", err.stack);

  res.status(500).json({
    code: 500,
    message: "Internal server error",
    error: err.message,
  });
}
