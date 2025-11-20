import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    tier: number;
    role: string;
  };
}
