# 코딩메이커 학원 관리 시스템 - Backend

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가:
```bash
DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./prisma/dev.db"
CIPHER_KEY="your-64-char-hex-key"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
```

### 3. 데이터베이스 초기화
```bash
npm run prisma:migrate  # 마이그레이션 실행
npm run db:seed         # 초기 데이터 생성
```

### 4. 개발 서버 실행
```bash
npm run dev
```

서버는 `http://localhost:3001`에서 실행됩니다.

## 📁 프로젝트 구조

```
backend/
├── prisma/
│   ├── schema.prisma      # Prisma 스키마
│   ├── seed.ts            # 초기 데이터 생성 스크립트
│   └── migrations/        # DB 마이그레이션 파일
├── src/
│   ├── app.ts            # Express 앱 설정
│   ├── server.ts         # 서버 진입점
│   ├── config/
│   │   └── database.ts   # Prisma Client
│   ├── controllers/      # 요청 처리
│   ├── middleware/       # 인증, 권한, Rate limit 등
│   ├── routes/           # API 라우트
│   ├── services/         # 비즈니스 로직
│   ├── types/            # TypeScript 타입 정의
│   └── utils/            # 유틸리티 함수
├── .env                  # 환경 변수 (gitignore)
├── .env.example          # 환경 변수 예시
├── package.json
└── tsconfig.json
```

## 🔐 보안 기능

### AES-256 암호화 (Random IV)
- 사용자 실명, 전화번호, 주소
- 1:1 채팅 메시지
- 매 암호화마다 새로운 IV 생성

### JWT 인증
- 토큰 기반 인증
- 7일 만료 (설정 가능)
- Tier 기반 권한 시스템

### Rate Limiting
- 일반 API: 15분에 100회
- 로그인 API: 15분에 5회
- 출석 체크: 1분에 10회

## 📡 API 엔드포인트

### 인증 (`/api/auth`)
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `GET /api/auth/me` - 현재 사용자 정보

### 출석 (`/api/attendance`)
- `POST /api/attendance/checkin` - 출석 체크 (태그 사용)
- `GET /api/attendance/user/:userId` - 출석 내역 조회

### 학원 정보 (`/api/academy`)
- `GET /api/academy/info` - 학원 정보 조회 (공개)
- `PUT /api/academy/info` - 학원 정보 수정 (Tier 1만)

### 커리큘럼 (`/api/courses`)
- `GET /api/courses` - 커리큘럼 목록 조회
- `POST /api/courses` - 커리큘럼 생성 (Tier 1, 2)
- `PUT /api/courses/:id` - 커리큘럼 수정 (Tier 1, 2)
- `DELETE /api/courses/:id` - 커리큘럼 삭제 (Tier 1만)

### 커뮤니티 (`/api/community`)
- `GET /api/community/posts` - 게시글 목록 (페이지네이션)
- `GET /api/community/posts/:id` - 게시글 상세
- `POST /api/community/posts` - 게시글 작성 (Tier 3 이하)
- `PUT /api/community/posts/:id/like` - 게시글 추천/취소
- `POST /api/community/posts/:id/comments` - 댓글 작성

### 친구 시스템 (`/api/friends`)
- `POST /api/friends/request` - 친구 요청
- `PUT /api/friends/:friendshipId/accept` - 친구 요청 수락
- `GET /api/friends` - 친구 목록 조회
- `DELETE /api/friends/:friendshipId` - 친구 삭제

### 사용자 (`/api/users`)
- `GET /api/users/:userId/profile` - 사용자 프로필 조회

### 채팅 (`/api/chat`) **NEW**
- `GET /api/chat/rooms` - 채팅방 목록 조회
- `POST /api/chat/rooms` - 채팅방 생성 (1:1 DM, 그룹)
- `GET /api/chat/rooms/:roomId/messages` - 메시지 내역 조회
- `POST /api/chat/rooms/:roomId/messages` - 메시지 전송

### Health Check
- `GET /healthz` - 서버 상태 확인

**총 25개 API 엔드포인트 구현 완료**

## 🔌 Socket.io 실시간 기능

### 실시간 이벤트
- `chat:join-room` - 채팅방 참가
- `chat:leave-room` - 채팅방 나가기
- `chat:send-message` - 메시지 전송
- `chat:new-message` - 새 메시지 수신
- `chat:typing` - 타이핑 중 표시
- `chat:user-typing` - 타이핑 중 수신
- `attendance:notify` - 출석 알림 브로드캐스트
- `attendance:new-checkin` - 출석 알림 수신

## 🧪 테스트

### Health Check
```bash
curl http://localhost:3001/healthz
```

### 로그인
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}'
```

### 출석 체크
```bash
curl -X POST http://localhost:3001/api/attendance/checkin \
  -H "Content-Type: application/json" \
  -d '{"tag":"0000"}'
```

## 📦 스크립트

```bash
npm run dev              # 개발 서버 (tsx watch)
npm run build            # TypeScript 빌드
npm run start            # 프로덕션 서버
npm run lint             # TypeScript 타입 체크
npm run prisma:migrate   # DB 마이그레이션
npm run prisma:generate  # Prisma Client 생성
npm run db:seed          # 초기 데이터 생성
```

## 🗄️ 데이터베이스

### SQLite (개발)
- 파일: `prisma/dev.db`
- 빠른 로컬 개발에 적합

### MySQL (프로덕션)
`prisma/schema.prisma`에서 provider를 변경:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## 👤 기본 계정

Seed 실행 후 생성되는 기본 계정:

- **아이디**: `admin`
- **비밀번호**: `admin1234`
- **태그**: `0000`
- **권한**: Tier 1 (최고 관리자)

## 📖 추가 문서

- [BACKEND_DESIGN_PLAN_1_OVERVIEW.md](../BACKEND_DESIGN_PLAN_1_OVERVIEW.md) - 아키텍처 개요
- [BACKEND_DESIGN_PLAN_2_DATABASE.md](../BACKEND_DESIGN_PLAN_2_DATABASE.md) - DB 스키마
- [BACKEND_DESIGN_PLAN_3_API.md](../BACKEND_DESIGN_PLAN_3_API.md) - API 명세
- [BACKEND_DESIGN_PLAN_4_SECURITY.md](../BACKEND_DESIGN_PLAN_4_SECURITY.md) - 보안 구현

## 🔧 트러블슈팅

### Port 이미 사용 중
```bash
lsof -ti:3001 | xargs kill -9
```

### Prisma Client 오류
```bash
npm run prisma:generate
```

### 데이터베이스 초기화
```bash
rm prisma/dev.db
npm run prisma:migrate
npm run db:seed
```

## 📄 라이선스

Private - 코딩메이커학원 전용
