import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(500).json({
    success: false,
    error: "서버 오류가 발생했습니다.",
    code: "SERVER_ERROR",
    ...(isDevelopment && { stack: err.stack }),
  });
}
