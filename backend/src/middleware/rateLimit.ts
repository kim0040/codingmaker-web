import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100,
  message: {
    success: false,
    error: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // 개발 환경에서는 100회, 운영에서는 5회
  message: {
    success: false,
    error: "로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.",
    code: "LOGIN_RATE_LIMIT_EXCEEDED",
  },
  skipSuccessfulRequests: true, // 성공한 요청은 카운트하지 않음
});

export const attendanceLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: "출석 체크 요청이 너무 많습니다.",
    code: "ATTENDANCE_RATE_LIMIT_EXCEEDED",
  },
});
