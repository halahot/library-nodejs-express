// Middleware 404 - вызывается, если ни один роут не подошёл
export function notFound(req, res, next) {
  res.status(404).json({
    code: 404,
    message: "Route not found",
  });
}
