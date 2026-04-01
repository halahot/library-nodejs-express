import { NextFunction, Request, Response } from "express";

const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    code: 404,
    message: "Route not found",
  });
};

export default notFound;
