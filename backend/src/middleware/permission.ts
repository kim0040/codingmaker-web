import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/express.js";

export function requireTier(allowedTiers: number[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    if (!allowedTiers.includes(req.user.tier)) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
        details: {
          requiredTier: allowedTiers,
          currentTier: req.user.tier,
        },
      });
    }

    next();
  };
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "권한이 없습니다.",
        code: "PERMISSION_DENIED",
        details: {
          requiredRole: allowedRoles,
          currentRole: req.user.role,
        },
      });
    }

    next();
  };
}
