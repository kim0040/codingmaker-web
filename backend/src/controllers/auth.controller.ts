import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { AuthRequest } from "../types/express.js";

export async function loginHandler(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "아이디와 비밀번호를 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    const result = await authService.login(username, password);

    res.json({
      success: true,
      data: result,
      message: "로그인 성공",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : "로그인 실패",
      code: "AUTH_INVALID_CREDENTIALS",
    });
  }
}

export async function registerHandler(req: Request, res: Response) {
  try {
    const { username, password, name, phone, address, tag, role } = req.body;

    if (!username || !password || !name || !tag || !role) {
      return res.status(400).json({
        success: false,
        error: "필수 항목을 모두 입력해주세요.",
        code: "VALIDATION_ERROR",
      });
    }

    const result = await authService.register({
      username,
      password,
      name,
      phone,
      address,
      tag,
      role,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: "회원가입 완료",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "회원가입 실패",
      code: "REGISTRATION_FAILED",
    });
  }
}

export async function getMeHandler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "인증이 필요합니다.",
        code: "AUTH_REQUIRED",
      });
    }

    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "사용자 정보를 불러올 수 없습니다.",
      code: "SERVER_ERROR",
    });
  }
}
