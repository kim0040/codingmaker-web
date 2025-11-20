# 백엔드 설계 계획서 (1/4) - 개요 및 아키텍처

> **코딩메이커 학원 통합 관리 시스템** 백엔드 설계 문서  
> **작성일**: 2024-11-20  
> **버전**: 1.0

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [시스템 아키텍처](#2-시스템-아키텍처)
3. [기술 스택](#3-기술-스택)
4. [개발 환경 설정](#4-개발-환경-설정)
5. [프로젝트 구조](#5-프로젝트-구조)
6. [개발 우선순위](#6-개발-우선순위)

---

## 1. 프로젝트 개요

### 1.1. 프로젝트 정보

- **프로젝트명**: 코딩메이커 아카데미 통합 관리 시스템 (Coding Maker LMS)
- **운영 주체**: 코딩메이커학원 (전남 광양시 중동)
- **목표**: 임베디드/코딩, 웹툰/창작, 자격증 반 운영을 위한 올인원 플랫폼
- **예상 사용자**: DAU 200명+ (학생, 강사, 학부모)
- **프론트엔드 상태**: 100% 완성 (Next.js 14, TypeScript, Tailwind CSS)
- **백엔드 목표**: RESTful API + Socket.io 실시간 통신

### 1.2. 핵심 기능 요구사항

#### 필수 기능 (Phase 1-2)
- ✅ **인증/권한 시스템**: JWT 기반, Tier 1-5 권한 체계
- ✅ **출석 관리**: 키오스크 태그 입력, 학부모 실시간 알림
- ✅ **학원 정보 관리**: CMS 기능 (동적 콘텐츠 수정)
- ✅ **데이터 암호화**: AES-256 (Random IV), bcrypt 비밀번호 해시

#### 핵심 기능 (Phase 3-4)
- ✅ **커뮤니티 게시판**: 디씨인사이드 스타일, 댓글/추천 시스템
- ✅ **채팅 시스템**: 1:1 DM (암호화), 그룹 채팅
- ✅ **LMS 강의실**: 커리큘럼 관리, 진도율 추적
- ✅ **친구 시스템**: 친구 요청/수락/삭제, 유저 프로필

#### 추가 기능 (Phase 5)
- ✅ **프로젝트 관리**: 팀 프로젝트, 포트폴리오 전시
- ✅ **데이터 분석**: 출석률, 진도율 시각화 (관리자 전용)
- ✅ **알림 시스템**: Socket.io 실시간 푸시 알림

### 1.3. 비기능 요구사항

#### 보안
- **최우선 과제**: DB 유출 시에도 개인정보 식별 불가능해야 함
- **암호화 대상**: 실명, 전화번호, 주소, 상담 기록, 1:1 채팅
- **인증**: JWT 토큰 (7일 만료), Refresh Token
- **권한**: Tier 기반 접근 제어, 모든 API 엔드포인트 검증

#### 성능
- **API 응답 시간**: 평균 200ms 이하
- **동시 접속**: 200명 동시 처리 가능
- **파일 업로드**: 최대 10MB
- **데이터베이스**: 인덱스 최적화, 페이지네이션

#### 확장성
- **커리큘럼**: 관리자가 자유롭게 추가/수정 가능 (하드코딩 금지)
- **학원 정보**: DB 기반 동적 관리 (CMS)
- **모듈화**: 기능별 독립적 개발 가능

---

## 2. 시스템 아키텍처

### 2.1. 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    프론트엔드 (Next.js)                    │
│  - 사용자 인터페이스 (UI/UX)                               │
│  - 클라이언트 사이드 로직                                   │
│  - Socket.io Client (실시간 통신)                          │
└────────────────┬───────────────────────────────┬─────────┘
                 │ HTTPS (REST API)              │ WebSocket
                 │                               │
┌────────────────▼───────────────────────────────▼─────────┐
│                    백엔드 서버 (Node.js)                   │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           Express.js / Fastify (선택)                │ │
│  │  - REST API Routes                                  │ │
│  │  - JWT Authentication Middleware                    │ │
│  │  - Rate Limiting                                    │ │
│  │  - CORS Policy                                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           Socket.io Server (실시간)                  │ │
│  │  - 출석 알림 (학부모)                                │ │
│  │  - 채팅 메시지                                       │ │
│  │  - 긴급 공지                                         │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           비즈니스 로직 (Services)                    │ │
│  │  - AuthService, AttendanceService                   │ │
│  │  - CommunityService, ChatService                    │ │
│  │  - CryptoService (암호화/복호화)                     │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           Prisma ORM (데이터 접근)                    │ │
│  │  - 쿼리 자동 생성                                    │ │
│  │  - SQL Injection 방어                               │ │
│  │  - Migration 관리                                   │ │
│  └─────────────────────────────────────────────────────┘ │
└────────────────┬──────────────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────────────┐
│                    데이터베이스                             │
│  - 개발: SQLite (빠른 프로토타이핑)                        │
│  - 운영: MySQL / MariaDB (안정성)                         │
│                                                           │
│  [User] [Attendance] [Post] [Comment] [ChatRoom]         │
│  [Message] [Course] [AcademyInfo] [Friendship]           │
└───────────────────────────────────────────────────────────┘
```

### 2.2. 데이터 흐름

#### 일반적인 API 요청 흐름
```
Client Request
    ↓
CORS Middleware (도메인 검증)
    ↓
Rate Limiting (도배 방지)
    ↓
JWT Verification (토큰 검증)
    ↓
Permission Check (Tier 권한 체크)
    ↓
Business Logic (서비스 레이어)
    ↓
Prisma ORM (데이터 접근)
    ↓
Database (MySQL/SQLite)
    ↓
Response (데이터 반환)
```

#### 암호화된 데이터 처리 흐름
```
[데이터 저장 시]
Plain Text → encrypt(Random IV) → DB 저장 (iv:ciphertext)

[데이터 조회 시]
DB 조회 → decrypt(IV 사용) → Plain Text → Client 전송
```

### 2.3. 듀얼 DB 전략

| 환경 | DB | 이유 |
|------|-----|------|
| **개발** | SQLite | - 빠른 설치/설정<br>- 로컬 파일 기반<br>- 프로토타이핑 최적화 |
| **운영** | MySQL | - 동시 접속 처리<br>- 데이터 무결성<br>- 백업/복구 용이 |

**전환 방법**: 환경변수 `DATABASE_PROVIDER`에 따라 Prisma 스키마 자동 전환

---

## 3. 기술 스택

### 3.1. 백엔드 코어

| 항목 | 기술 | 버전 | 이유 |
|------|------|------|------|
| **런타임** | Node.js | 18+ LTS | 안정성, 생태계 |
| **프레임워크** | Express.js | 4.x | 간단, 유연, 미들웨어 풍부 |
| **언어** | TypeScript | 5.x | 타입 안전성 |
| **ORM** | Prisma | 5.x | 타입 안전, 마이그레이션 |
| **데이터베이스** | MySQL / SQLite | 8.x / 3.x | 듀얼 DB 전략 |

### 3.2. 보안

| 항목 | 기술 | 용도 |
|------|------|------|
| **암호화** | crypto (Node.js) | AES-256-CBC, Random IV |
| **해시** | bcrypt | 비밀번호 해시 (Salt 자동) |
| **인증** | jsonwebtoken | JWT 토큰 생성/검증 |
| **도배 방지** | express-rate-limit | API Rate Limiting |
| **XSS 방어** | isomorphic-dompurify | HTML Sanitize |

### 3.3. 실시간 통신

| 항목 | 기술 | 용도 |
|------|------|------|
| **WebSocket** | Socket.io | 실시간 채팅, 알림 |
| **인증** | socket.io-jwt | Socket 연결 시 JWT 검증 |

### 3.4. 개발 도구

| 항목 | 기술 | 용도 |
|------|------|------|
| **린터** | ESLint | 코드 품질 |
| **포매터** | Prettier | 코드 스타일 |
| **테스트** | Jest | 유닛 테스트 |
| **API 문서** | Swagger | API 명세 자동 생성 |

---

## 4. 개발 환경 설정

### 4.1. 필수 소프트웨어

```bash
# Node.js 18+ LTS
node --version  # v18.x.x 이상

# npm 또는 yarn
npm --version   # 9.x.x 이상

# MySQL (운영 환경)
mysql --version # 8.x.x 이상

# Git
git --version
```

### 4.2. 프로젝트 초기화

```bash
# 백엔드 디렉토리 생성
mkdir codingmaker-backend
cd codingmaker-backend

# package.json 초기화
npm init -y

# TypeScript 설정
npm install -D typescript @types/node ts-node nodemon
npx tsc --init

# 필수 패키지 설치
npm install express prisma @prisma/client
npm install jsonwebtoken bcrypt socket.io
npm install dotenv cors express-rate-limit

# 개발 의존성
npm install -D @types/express @types/jsonwebtoken @types/bcrypt
npm install -D @types/cors eslint prettier
```

### 4.3. 환경변수 (.env)

```bash
# 데이터베이스
DATABASE_URL="file:./dev.db"  # 개발: SQLite
# DATABASE_URL="mysql://user:password@localhost:3306/codingmaker"  # 운영: MySQL
DATABASE_PROVIDER="sqlite"  # 또는 "mysql"

# 암호화 키 (32 bytes hex)
CIPHER_KEY="your-32-byte-hex-key-here"  # openssl rand -hex 32

# JWT
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# 서버
PORT=3001
NODE_ENV="development"

# 프론트엔드
FRONTEND_URL="http://localhost:3000"

# Socket.io (선택)
SOCKET_PORT=3002
```

### 4.4. Prisma 초기화

```bash
# Prisma 초기화
npx prisma init

# 스키마 작성 후 마이그레이션
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate

# Prisma Studio (DB GUI)
npx prisma studio
```

---

## 5. 프로젝트 구조

```
codingmaker-backend/
├── src/
│   ├── server.ts              # 서버 진입점
│   ├── app.ts                 # Express 앱 설정
│   │
│   ├── config/                # 설정 파일
│   │   ├── database.ts        # Prisma 설정
│   │   └── socket.ts          # Socket.io 설정
│   │
│   ├── middleware/            # 미들웨어
│   │   ├── auth.ts            # JWT 검증
│   │   ├── permission.ts      # Tier 권한 체크
│   │   ├── rateLimit.ts       # Rate Limiting
│   │   └── errorHandler.ts   # 에러 핸들러
│   │
│   ├── routes/                # API 라우트
│   │   ├── auth.routes.ts     # /api/auth
│   │   ├── attendance.routes.ts  # /api/attendance
│   │   ├── academy.routes.ts  # /api/academy
│   │   ├── community.routes.ts  # /api/community
│   │   ├── chat.routes.ts     # /api/chat
│   │   ├── friends.routes.ts  # /api/friends
│   │   └── users.routes.ts    # /api/users
│   │
│   ├── services/              # 비즈니스 로직
│   │   ├── auth.service.ts
│   │   ├── attendance.service.ts
│   │   ├── crypto.service.ts  # 암호화/복호화
│   │   ├── community.service.ts
│   │   ├── chat.service.ts
│   │   └── notification.service.ts
│   │
│   ├── controllers/           # 컨트롤러
│   │   ├── auth.controller.ts
│   │   ├── attendance.controller.ts
│   │   ├── community.controller.ts
│   │   └── chat.controller.ts
│   │
│   ├── types/                 # TypeScript 타입
│   │   ├── express.d.ts       # Express 확장
│   │   └── index.ts           # 공통 타입
│   │
│   ├── utils/                 # 유틸리티
│   │   ├── logger.ts          # 로그 기록
│   │   └── validator.ts       # 입력 검증
│   │
│   └── socket/                # Socket.io 핸들러
│       ├── index.ts
│       ├── attendance.handler.ts
│       └── chat.handler.ts
│
├── prisma/
│   ├── schema.prisma          # Prisma 스키마
│   ├── migrations/            # 마이그레이션 히스토리
│   └── seed.ts                # 초기 데이터
│
├── tests/                     # 테스트
│   ├── unit/
│   └── integration/
│
├── .env                       # 환경변수 (Git 제외)
├── .env.example               # 환경변수 예시
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 6. 개발 우선순위

### Phase 1: 기본 인프라 (1주차)
**목표**: 프로젝트 셋업 + 인증 시스템

- [ ] 프로젝트 초기화 (Express, TypeScript, Prisma)
- [ ] 데이터베이스 스키마 정의 (User, AcademyInfo)
- [ ] 암호화 유틸리티 구현 (`crypto.service.ts`)
- [ ] JWT 인증 미들웨어 (`auth.ts`, `permission.ts`)
- [ ] 로그인/회원가입 API (`/api/auth`)

**검증**:
- ✅ Postman으로 로그인 테스트
- ✅ JWT 토큰 발급/검증 확인
- ✅ 암호화된 데이터 DB 저장 확인

---

### Phase 2: 출석 시스템 (1주차)
**목표**: 키오스크 출석 체크 + 학부모 알림

- [ ] Attendance 모델 추가
- [ ] 출석 체크 API (`POST /api/attendance/checkin`)
- [ ] 출석 내역 조회 API (`GET /api/attendance/user/:userId`)
- [ ] Socket.io 서버 설정
- [ ] 학부모 실시간 알림 (Socket 이벤트)

**검증**:
- ✅ 키오스크 페이지에서 태그 입력 시 출석 기록
- ✅ 학부모 계정으로 실시간 알림 수신

---

### Phase 3: 커뮤니티 게시판 (2주차)
**목표**: 게시글/댓글/추천 시스템

- [ ] Post, Comment, Like 모델 추가
- [ ] 게시글 CRUD API
- [ ] 댓글 CRUD API
- [ ] 추천/비추천 API
- [ ] 페이지네이션 구현
- [ ] XSS 방어 (DOMPurify)

**검증**:
- ✅ 게시글 작성/수정/삭제
- ✅ 댓글 추가/추천
- ✅ 페이지네이션 동작

---

### Phase 4: 채팅 시스템 (2주차)
**목표**: 1:1 DM + 그룹 채팅

- [ ] ChatRoom, Message 모델 추가
- [ ] 채팅방 생성 API
- [ ] 메시지 전송 (Socket.io)
- [ ] 1:1 채팅 암호화 (AES-256)
- [ ] 채팅 내역 조회 API

**검증**:
- ✅ 1:1 메시지 암호화 저장
- ✅ 실시간 메시지 전송
- ✅ 그룹 채팅 멀티캐스트

---

### Phase 5: 친구 시스템 (3주차)
**목표**: 친구 요청/수락/삭제

- [ ] Friendship 모델 추가
- [ ] 친구 요청 API
- [ ] 친구 수락/거절 API
- [ ] 친구 목록 조회 API
- [ ] 유저 프로필 조회 API

**검증**:
- ✅ 친구 추가 플로우 테스트
- ✅ 유저 프로필 팝업 데이터 연동

---

### Phase 6: LMS & 추가 기능 (4주차)
**목표**: 커리큘럼 관리, CMS

- [ ] Course 모델 + 동적 커리큘럼
- [ ] CMS API (학원 정보 수정)
- [ ] 데이터 분석 API (관리자 통계)
- [ ] 프로젝트 관리 (선택)

**검증**:
- ✅ 관리자 페이지에서 커리큘럼 수정
- ✅ 학원 정보 실시간 반영

---

## 📞 다음 단계

이 문서는 **1/4편 (개요 및 아키텍처)**입니다.

다음 문서를 읽어주세요:
- 📘 [2/4편 - 데이터베이스 스키마](./BACKEND_DESIGN_PLAN_2_DATABASE.md)
- 📘 [3/4편 - API 명세](./BACKEND_DESIGN_PLAN_3_API.md)
- 📘 [4/4편 - 보안 구현](./BACKEND_DESIGN_PLAN_4_SECURITY.md)

---

**작성자**: AI Assistant (Cascade)  
**최종 수정**: 2024-11-20
