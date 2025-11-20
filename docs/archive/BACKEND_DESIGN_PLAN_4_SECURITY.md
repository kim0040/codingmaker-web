# 백엔드 설계 계획서 (4/4) - 보안 구현

> **코딩메이커 학원 통합 관리 시스템** 보안 설계  
> **작성일**: 2024-11-20  
> **보안 원칙**: "DB 유출 시에도 개인정보 식별 불가능"

---

## 📋 목차

1. [보안 개요](#1-보안-개요)
2. [암호화 시스템](#2-암호화-시스템)
3. [인증 시스템](#3-인증-시스템)
4. [권한 시스템](#4-권한-시스템)
5. [공격 방어](#5-공격-방어)
6. [미들웨어 구현](#6-미들웨어-구현)
7. [보안 테스트](#7-보안-테스트)

---

## 1. 보안 개요

### 1.1. 보안 요구사항

#### 최우선 과제 (Critical)
- ✅ **데이터 암호화**: 실명, 전화번호, 주소, 상담 기록, 1:1 채팅
- ✅ **비밀번호 해시**: bcrypt/Argon2 (Salt 자동)
- ✅ **JWT 인증**: 토큰 기반 인증, 7일 만료
- ✅ **Random IV**: 매번 새로운 IV 생성 (고정 IV 금지)

#### 높은 우선순위 (High)
- ✅ **SQL Injection 방어**: Prisma ORM 사용
- ✅ **XSS 방어**: DOMPurify 적용
- ✅ **CSRF 방어**: JWT 토큰 (CSRF 토큰 불필요)
- ✅ **Rate Limiting**: 도배 방지

#### 중간 우선순위 (Medium)
- ✅ **CORS 설정**: 허용된 도메인만
- ✅ **에러 처리**: 민감 정보 노출 방지
- ✅ **HTTPS**: 프로덕션 필수
- ✅ **감사 로그**: 관리자 행동 기록

### 1.2. 보안 위협 모델

| 위협 | 대응 방안 |
|------|----------|
| **DB 유출** | AES-256 암호화 (Random IV) |
| **비밀번호 탈취** | bcrypt 해시 (Salt) |
| **세션 하이재킹** | JWT 토큰, HttpOnly Cookie |
| **SQL Injection** | Prisma ORM (파라미터화) |
| **XSS** | DOMPurify (HTML Sanitize) |
| **CSRF** | JWT 토큰 인증 |
| **무차별 대입** | Rate Limiting |
| **권한 우회** | Tier 기반 미들웨어 검증 |

---

## 2. 암호화 시스템

### 2.1. AES-256-CBC 암호화

#### 구현 파일: `/src/services/crypto.service.ts`

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.CIPHER_KEY!, 'hex'); // 32 bytes

/**
 * 데이터 암호화 (AES-256-CBC with Random IV)
 * @param text 평문
 * @returns "iv:ciphertext" 형식의 암호화된 문자열
 */
export function encrypt(text: string): string {
  if (!text) return text;
  
  // ⚠️ 중요: 매번 새로운 Random IV 생성
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // IV와 암호문을 함께 저장
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * 데이터 복호화
 * @param encryptedData "iv:ciphertext" 형식
 * @returns 복호화된 평문
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) {
    return encryptedData;
  }
  
  const [ivHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * 여러 필드 일괄 암호화
 */
export function encryptFields<T extends Record<string, any>>(
  data: T,
  fields: (keyof T)[]
): T {
  const result = { ...data };
  fields.forEach(field => {
    if (result[field]) {
      result[field] = encrypt(String(result[field]));
    }
  });
  return result;
}

/**
 * 여러 필드 일괄 복호화
 */
export function decryptFields<T extends Record<string, any>>(
  data: T,
  fields: (keyof T)[]
): T {
  const result = { ...data };
  fields.forEach(field => {
    if (result[field]) {
      result[field] = decrypt(String(result[field]));
    }
  });
  return result;
}
```

#### 사용 예시

```typescript
import { encrypt, decrypt, encryptFields } from '@/services/crypto.service';

// 1. 단일 필드 암호화
const encryptedName = encrypt('김코딩');
// → "a1b2c3d4e5f6...:encrypted_content"

// 2. DB 저장 시 자동 암호화
const user = await prisma.user.create({
  data: {
    username: 'student1',
    password: await bcrypt.hash('password123', 10),
    name: encrypt('김코딩'),
    phone: encrypt('010-1234-5678'),
    address: encrypt('광주시 북구'),
    tag: '1234',
    tier: 3,
    role: 'STUDENT',
  },
});

// 3. DB 조회 시 자동 복호화
const foundUser = await prisma.user.findUnique({
  where: { id: 'uuid' },
});

const decryptedUser = {
  ...foundUser,
  name: decrypt(foundUser.name),
  phone: decrypt(foundUser.phone),
  address: decrypt(foundUser.address),
};

// 4. 일괄 복호화
const decryptedUser = decryptFields(foundUser, ['name', 'phone', 'address']);
```

### 2.2. 암호화 키 관리

#### .env 파일

```bash
# 암호화 키 생성 (터미널)
openssl rand -hex 32

# .env 설정
CIPHER_KEY="your-32-byte-hex-key-here"
```

#### 보안 주의사항

- ❌ **절대 Git에 커밋하지 말 것** (.gitignore 확인)
- ❌ **코드에 하드코딩 금지**
- ✅ **프로덕션 환경변수는 호스팅 플랫폼에서 별도 설정**
- ✅ **키 변경 시 기존 데이터 재암호화 필요**

---

## 3. 인증 시스템

### 3.1. JWT 토큰 발급

#### 구현 파일: `/src/services/auth.service.ts`

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { decrypt } from './crypto.service';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 로그인
 */
export async function login(username: string, password: string) {
  // 1. 사용자 찾기
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  }

  // 2. 비밀번호 검증
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  }

  // 3. JWT 토큰 생성
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      tier: user.tier,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // 4. 민감 정보 복호화 후 반환
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      name: decrypt(user.name),
      tier: user.tier,
      role: user.role,
    },
  };
}

/**
 * 회원가입
 */
export async function register(data: {
  username: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  tag: string;
  role: string;
}) {
  // 1. 중복 검사
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { username: data.username },
        { tag: data.tag },
      ],
    },
  });

  if (existing) {
    throw new Error('이미 사용 중인 아이디 또는 태그입니다.');
  }

  // 2. 비밀번호 해시
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 3. 데이터 암호화 후 저장
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
      name: encrypt(data.name),
      phone: data.phone ? encrypt(data.phone) : null,
      address: data.address ? encrypt(data.address) : null,
      tag: data.tag,
      tier: 4, // 비정규회원으로 시작
      role: data.role,
    },
  });

  return {
    id: user.id,
    username: user.username,
    tier: user.tier,
  };
}
```

### 3.2. JWT 검증 미들웨어

#### 구현 파일: `/src/middleware/auth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    tier: number;
    role: string;
  };
}

/**
 * JWT 토큰 검증 미들웨어
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '인증 토큰이 필요합니다.',
      code: 'AUTH_TOKEN_REQUIRED',
    });
  }

  const token = authHeader.replace('Bearer ', '');

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
        error: '토큰이 만료되었습니다.',
        code: 'AUTH_TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      success: false,
      error: '유효하지 않은 토큰입니다.',
      code: 'AUTH_TOKEN_INVALID',
    });
  }
}
```

---

## 4. 권한 시스템

### 4.1. Tier 기반 권한 미들웨어

#### 구현 파일: `/src/middleware/permission.ts`

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Tier 기반 권한 체크
 */
export function requireTier(allowedTiers: number[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.',
        code: 'AUTH_REQUIRED',
      });
    }

    if (!allowedTiers.includes(req.user.tier)) {
      return res.status(403).json({
        success: false,
        error: '권한이 없습니다.',
        code: 'PERMISSION_DENIED',
        details: {
          requiredTier: allowedTiers,
          currentTier: req.user.tier,
        },
      });
    }

    next();
  };
}

/**
 * Role 기반 권한 체크
 */
export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.',
        code: 'AUTH_REQUIRED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: '권한이 없습니다.',
        code: 'PERMISSION_DENIED',
        details: {
          requiredRole: allowedRoles,
          currentRole: req.user.role,
        },
      });
    }

    next();
  };
}

/**
 * 본인 또는 관리자만 접근 가능
 */
export function requireOwnerOrAdmin(getUserIdFromReq: (req: AuthRequest) => string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.',
        code: 'AUTH_REQUIRED',
      });
    }

    const targetUserId = getUserIdFromReq(req);
    const isOwner = req.user.id === targetUserId;
    const isAdmin = req.user.tier <= 2;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: '권한이 없습니다.',
        code: 'PERMISSION_DENIED',
      });
    }

    next();
  };
}
```

### 4.2. 라우트에 권한 적용

```typescript
import express from 'express';
import { authMiddleware } from '@/middleware/auth';
import { requireTier, requireRole } from '@/middleware/permission';

const router = express.Router();

// 예시 1: Tier 1 (최고 관리자)만 접근
router.put(
  '/api/academy/info',
  authMiddleware,
  requireTier([1]),
  updateAcademyInfo
);

// 예시 2: Tier 1, 2 (관리자, 강사)만 접근
router.post(
  '/api/courses',
  authMiddleware,
  requireTier([1, 2]),
  createCourse
);

// 예시 3: STUDENT 역할만 접근
router.get(
  '/api/lms/classes',
  authMiddleware,
  requireRole(['STUDENT', 'ADMIN']),
  getMyClasses
);

// 예시 4: 본인 또는 관리자만 접근
router.get(
  '/api/attendance/user/:userId',
  authMiddleware,
  requireOwnerOrAdmin((req) => req.params.userId),
  getUserAttendance
);
```

---

## 5. 공격 방어

### 5.1. SQL Injection 방어

✅ **Prisma ORM 사용 시 자동 방어됨**

```typescript
// ✅ 안전 (Prisma가 자동으로 파라미터화)
const user = await prisma.user.findUnique({
  where: { username: req.body.username }
});

// ❌ 위험 (절대 사용 금지)
const user = await prisma.$queryRaw`
  SELECT * FROM User WHERE username = ${req.body.username}
`;
```

### 5.2. XSS 방어

#### 구현: DOMPurify 적용

```typescript
import DOMPurify from 'isomorphic-dompurify';

/**
 * 게시글 작성 시 HTML Sanitize
 */
export async function createPost(req: AuthRequest, res: Response) {
  const { title, content, category } = req.body;

  // ⚠️ 사용자 입력 HTML을 정제
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt'],
  });

  const post = await prisma.post.create({
    data: {
      title,
      content: sanitizedContent,
      category,
      authorId: req.user!.id,
    },
  });

  res.status(201).json({
    success: true,
    data: post,
  });
}
```

### 5.3. Rate Limiting

#### 구현 파일: `/src/middleware/rateLimit.ts`

```typescript
import rateLimit from 'express-rate-limit';

/**
 * 일반 API Rate Limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100개 요청
  message: {
    success: false,
    error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 로그인 API Rate Limiter (엄격)
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5회
  message: {
    success: false,
    error: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.',
    code: 'LOGIN_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * 출석 체크 Rate Limiter
 */
export const attendanceLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 10, // 1분에 10회
  message: {
    success: false,
    error: '출석 체크 요청이 너무 많습니다.',
    code: 'ATTENDANCE_RATE_LIMIT_EXCEEDED',
  },
});
```

#### 라우트 적용

```typescript
import { apiLimiter, loginLimiter, attendanceLimiter } from '@/middleware/rateLimit';

// 전체 API에 Rate Limit 적용
app.use('/api/', apiLimiter);

// 로그인 엔드포인트 (엄격)
app.post('/api/auth/login', loginLimiter, loginHandler);

// 출석 체크
app.post('/api/attendance/checkin', attendanceLimiter, checkinHandler);
```

### 5.4. CORS 설정

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 6. 미들웨어 구현

### 6.1. 에러 핸들러

#### 구현 파일: `/src/middleware/errorHandler.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  // ❌ 프로덕션에서는 스택 트레이스 노출 금지
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    error: '서버 오류가 발생했습니다.',
    code: 'SERVER_ERROR',
    ...(isDevelopment && { stack: err.stack }),
  });
}
```

### 6.2. 로거 미들웨어

```typescript
import { Request, Response, NextFunction } from 'express';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
}
```

---

## 7. 보안 테스트

### 7.1. 침투 테스트 시나리오

#### 1. SQL Injection 테스트

```bash
# 로그인 폼에 SQL 쿼리 삽입 시도
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin'\'' OR '\''1'\''='\''1", "password": "any"}'

# 예상 결과: 401 Unauthorized (Prisma가 자동 방어)
```

#### 2. XSS 테스트

```bash
# 게시글에 스크립트 삽입 시도
curl -X POST http://localhost:3001/api/community/posts \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "content": "<script>alert(\"XSS\")</script>"}'

# 예상 결과: DOMPurify가 <script> 태그 제거
```

#### 3. 무차별 대입 공격 테스트

```bash
# 로그인 10회 연속 시도
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "wrong"}';
done

# 예상 결과: 5회 이후 429 Too Many Requests
```

#### 4. 권한 우회 테스트

```bash
# Tier 3 사용자가 Tier 1 API 호출 시도
curl -X PUT http://localhost:3001/api/academy/info \
  -H "Authorization: Bearer <TIER3_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"phone": "000-0000-0000"}'

# 예상 결과: 403 Forbidden
```

### 7.2. 보안 체크리스트

#### 배포 전 필수 확인

- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] 프로덕션 환경변수 별도 설정
- [ ] HTTPS 인증서 설정
- [ ] CORS 올바르게 설정
- [ ] Rate Limiting 적용
- [ ] 에러 메시지에 민감 정보 없음
- [ ] 모든 API 엔드포인트 권한 체크
- [ ] 암호화된 필드 복호화 테스트
- [ ] JWT 토큰 만료 테스트
- [ ] Prisma 마이그레이션 프로덕션 적용

---

## 📞 마무리

이 문서는 **4/4편 (보안 구현)**입니다.

전체 문서 목록:
- 📘 [1/4편 - 개요 및 아키텍처](./BACKEND_DESIGN_PLAN_1_OVERVIEW.md)
- 📘 [2/4편 - 데이터베이스 스키마](./BACKEND_DESIGN_PLAN_2_DATABASE.md)
- 📘 [3/4편 - API 명세](./BACKEND_DESIGN_PLAN_3_API.md)
- 📘 **[4/4편 - 보안 구현](./BACKEND_DESIGN_PLAN_4_SECURITY.md)** ← 현재

---

## 🎯 개발 시작 가이드

### 1단계: 환경 설정
```bash
cd codingmaker-backend
npm install
cp .env.example .env
# .env 파일 수정 (CIPHER_KEY, JWT_SECRET 등)
```

### 2단계: 데이터베이스 설정
```bash
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio  # DB 확인
```

### 3단계: 서버 실행
```bash
npm run dev
```

### 4단계: 테스트
```bash
# Postman으로 로그인 API 테스트
POST http://localhost:3001/api/auth/login
{
  "username": "admin",
  "password": "admin1234"
}
```

---

**작성자**: AI Assistant (Cascade)  
**최종 수정**: 2024-11-20  

**🎉 백엔드 설계 계획서 작성 완료!**
