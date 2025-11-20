import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-me-super-secret";

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "인증 토큰이 필요합니다.",
      code: "AUTH_TOKEN_REQUIRED",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      tier: number;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: "토큰이 만료되었습니다.",
        code: "AUTH_TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      error: "유효하지 않은 토큰입니다.",
      code: "AUTH_TOKEN_INVALID",
    });
  }
}
