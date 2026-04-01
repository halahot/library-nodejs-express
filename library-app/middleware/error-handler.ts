import { NextFunction, Request, Response } from "express";

interface ErrorWithStack {
  message?: string;
  stack?: string;
}

const errorHandler = (
  err: ErrorWithStack,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Server error:", err.stack);

  res.status(500).json({
    code: 500,
    message: "Internal server error",
    error: err.message,
  });
};

export default errorHandler;
