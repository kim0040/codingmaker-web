# 백엔드 설계 계획서 (2/4) - 데이터베이스 스키마

> **코딩메이커 학원 통합 관리 시스템** 데이터베이스 설계  
> **작성일**: 2024-11-20  
> **ORM**: Prisma 5.x

---

## 📋 목차

1. [ERD 개요](#1-erd-개요)
2. [Prisma 스키마](#2-prisma-스키마)
3. [테이블 상세 설명](#3-테이블-상세-설명)
4. [인덱스 전략](#4-인덱스-전략)
5. [초기 데이터 (Seed)](#5-초기-데이터-seed)

---

## 1. ERD 개요

### 1.1. 주요 엔티티 관계

```
User (사용자)
  ├─ 1:N → Attendance (출석 기록)
  ├─ 1:N → Post (게시글)
  ├─ 1:N → Comment (댓글)
  ├─ 1:N → Message (채팅 메시지)
  ├─ M:N → ChatRoom (채팅방 멤버십)
  ├─ M:N → Course (수강 신청)
  ├─ 1:N → Friendship (친구 요청자)
  └─ 1:N → Friendship (친구 수신자)

Post (게시글)
  ├─ 1:N → Comment (댓글)
  └─ 1:N → PostLike (추천)

Comment (댓글)
  └─ 1:N → CommentLike (추천)

ChatRoom (채팅방)
  ├─ M:N → User (멤버)
  └─ 1:N → Message (메시지)

Course (커리큘럼)
  └─ M:N → User (수강생)

AcademyInfo (학원 정보)
  - Key-Value Store (독립 테이블)
```

---

## 2. Prisma 스키마

### 2.1. datasource & generator

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = env("DATABASE_PROVIDER")  // "sqlite" 또는 "mysql"
  url      = env("DATABASE_URL")
}
```

### 2.2. User 모델

```prisma
model User {
  id            String    @id @default(uuid())
  username      String    @unique
  password      String    // bcrypt hash (Salt 포함)
  
  // ⚠️ 암호화 필수 필드 (AES-256 + Random IV, 형식: "iv:ciphertext")
  name          String    // 실명 (암호화)
  phone         String?   // 전화번호 (암호화)
  address       String?   // 주소 (암호화)
  
  tag           String    @unique // 출석 태그 (#1234)
  tier          Int       // 1~5 (권한 레벨)
  role          String    // ADMIN, TEACHER, STUDENT, PARENT, GRADUATE
  
  // 학부모-자녀 연결
  parentId      String?   // 학부모인 경우 자녀의 userId
  parent        User?     @relation("ParentChild", fields: [parentId], references: [id])
  children      User[]    @relation("ParentChild")
  
  // 타임스탬프
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // 관계
  attendance    Attendance[]
  posts         Post[]
  comments      Comment[]
  messages      Message[]
  chatRooms     ChatRoom[] @relation("ChatRoomMembers")
  enrolledCourses UserCourse[]
  sentFriendRequests     Friendship[] @relation("SentFriendRequests")
  receivedFriendRequests Friendship[] @relation("ReceivedFriendRequests")
  
  @@index([tag])
  @@index([tier])
  @@index([role])
  @@index([parentId])
}
```

### 2.3. Attendance 모델 (출석)

```prisma
model Attendance {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  date      DateTime @default(now())
  status    String   // ATTENDED, LATE, ABSENT, EXCUSED
  note      String?  // 비고 (예: "조퇴")
  
  createdAt DateTime @default(now())
  
  @@index([userId, date])
  @@index([date])
}
```

### 2.4. Post 모델 (게시글)

```prisma
model Post {
  id          String    @id @default(uuid())
  title       String
  content     String    @db.Text  // HTML/Markdown
  category    String?   // "질문", "공유", "프로젝트", "자유"
  
  authorId    String
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  views       Int       @default(0)
  isPinned    Boolean   @default(false)  // 공지 고정
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  comments    Comment[]
  likes       PostLike[]
  
  @@index([authorId])
  @@index([category])
  @@index([createdAt])
  @@index([isPinned])
}
```

### 2.5. Comment 모델 (댓글)

```prisma
model Comment {
  id          String    @id @default(uuid())
  content     String    @db.Text
  
  postId      String
  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  authorId    String
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  likes       CommentLike[]
  
  @@index([postId])
  @@index([authorId])
  @@index([createdAt])
}
```

### 2.6. PostLike & CommentLike (추천)

```prisma
model PostLike {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  createdAt DateTime @default(now())
  
  @@unique([postId, userId])  // 중복 추천 방지
  @@index([postId])
}

model CommentLike {
  id        String   @id @default(uuid())
  commentId String
  comment   Comment  @relation(fields: [commentId], references: [id], onDelete: Cascade)
  userId    String
  createdAt DateTime @default(now())
  
  @@unique([commentId, userId])
  @@index([commentId])
}
```

### 2.7. ChatRoom 모델 (채팅방)

```prisma
model ChatRoom {
  id          String    @id @default(uuid())
  type        String    // "dm" (1:1) | "group" (그룹)
  name        String?   // 그룹 채팅방 이름 (DM은 null)
  
  members     User[]    @relation("ChatRoomMembers")
  messages    Message[]
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([type])
}
```

### 2.8. Message 모델 (채팅 메시지)

```prisma
model Message {
  id          String    @id @default(uuid())
  content     String    @db.Text  // ⚠️ 1:1 DM인 경우 암호화됨
  
  roomId      String
  room        ChatRoom  @relation(fields: [roomId], references: [id], onDelete: Cascade)
  
  authorId    String
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  isEncrypted Boolean   @default(false)  // 1:1 채팅인 경우 true
  isRead      Boolean   @default(false)  // 읽음 여부
  
  createdAt   DateTime  @default(now())
  
  @@index([roomId, createdAt])
  @@index([authorId])
}
```

### 2.9. Friendship 모델 (친구 관계)

```prisma
model Friendship {
  id          String    @id @default(uuid())
  
  userId      String
  user        User      @relation("SentFriendRequests", fields: [userId], references: [id], onDelete: Cascade)
  
  friendId    String
  friend      User      @relation("ReceivedFriendRequests", fields: [friendId], references: [id], onDelete: Cascade)
  
  status      String    // PENDING, ACCEPTED, REJECTED, BLOCKED
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@unique([userId, friendId])  // 중복 요청 방지
  @@index([userId])
  @@index([friendId])
  @@index([status])
}
```

### 2.10. Course 모델 (커리큘럼)

```prisma
model Course {
  id          String   @id @default(uuid())
  title       String   // "임베디드 전문가 과정"
  category    String   // CODING, MAKER, CERTIFICATION
  description String?  @db.Text
  instructor  String?  // 담당 강사명
  schedule    String?  // "월수금 14:00"
  
  isActive    Boolean  @default(true)  // 폐강 여부
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  enrolledUsers UserCourse[]
  
  @@index([category])
  @@index([isActive])
}

// 수강 신청 중간 테이블
model UserCourse {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  progress    Int      @default(0)  // 진도율 (0-100%)
  enrolledAt  DateTime @default(now())
  
  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
}
```

### 2.11. AcademyInfo 모델 (학원 정보)

```prisma
model AcademyInfo {
  key         String   @id  // "INFO_PHONE", "INFO_ADDRESS", "HERO_MESSAGE"
  value       String   @db.Text
  updatedAt   DateTime @updatedAt
}
```

---

## 3. 테이블 상세 설명

### 3.1. User 테이블

#### 주요 필드 설명

| 필드 | 타입 | 설명 | 암호화 |
|------|------|------|--------|
| `id` | UUID | 기본키 | - |
| `username` | String | 로그인 ID (유니크) | - |
| `password` | String | bcrypt 해시 | ✅ (단방향) |
| `name` | String | 실명 | ✅ (AES-256) |
| `phone` | String | 전화번호 | ✅ (AES-256) |
| `address` | String | 주소 | ✅ (AES-256) |
| `tag` | String | 출석 태그 (#1234) | - |
| `tier` | Int | 1~5 권한 레벨 | - |
| `role` | String | 역할 (ADMIN, TEACHER, STUDENT, PARENT, GRADUATE) | - |
| `parentId` | String | 학부모-자녀 연결 (자녀의 userId) | - |

#### Tier 시스템

| Tier | 역할 | 설명 |
|------|------|------|
| 1 | ADMIN | 최고 관리자 (원장) |
| 2 | TEACHER | 관리자 (강사) |
| 3-A | STUDENT | 정회원 (수강생) |
| 3-B | PARENT | 학부모 |
| 3-C | GRADUATE | 명예회원 (수료생) |
| 4 | - | 비정규회원 |
| 5 | - | 게스트 |

### 3.2. Attendance 테이블

#### Status 값

| Status | 의미 |
|--------|------|
| `ATTENDED` | 출석 |
| `LATE` | 지각 (15분 이상 지각) |
| `ABSENT` | 결석 |
| `EXCUSED` | 공결 (사유 있음) |

### 3.3. Post 테이블

#### Category 값

| Category | 설명 |
|----------|------|
| `질문` | 학습 질문 |
| `공유` | 유용한 정보 공유 |
| `프로젝트` | 팀원 모집, 프로젝트 공유 |
| `자유` | 자유 게시판 |
| `공지` | 관리자 공지 (isPinned=true) |

### 3.4. Message 테이블

#### 암호화 규칙

- `isEncrypted = true`: 1:1 DM (content는 암호화됨)
- `isEncrypted = false`: 그룹 채팅 (평문 저장)

### 3.5. Friendship 테이블

#### Status 값

| Status | 의미 |
|--------|------|
| `PENDING` | 친구 요청 대기 중 |
| `ACCEPTED` | 친구 수락됨 |
| `REJECTED` | 친구 거절됨 |
| `BLOCKED` | 차단됨 |

---

## 4. 인덱스 전략

### 4.1. 필수 인덱스

```prisma
// User
@@index([tag])           // 출석 체크 시 빠른 조회
@@index([tier])          // 권한별 필터링
@@index([role])          // 역할별 필터링
@@index([parentId])      // 학부모-자녀 관계

// Attendance
@@index([userId, date])  // 사용자별 출석 내역
@@index([date])          // 일별 출석 통계

// Post
@@index([authorId])      // 작성자별 게시글
@@index([category])      // 카테고리별 필터링
@@index([createdAt])     // 최신순 정렬
@@index([isPinned])      // 공지 우선 표시

// Comment
@@index([postId])        // 게시글별 댓글
@@index([authorId])      // 작성자별 댓글
@@index([createdAt])     // 시간순 정렬

// Message
@@index([roomId, createdAt])  // 채팅방별 메시지 (시간순)
@@index([authorId])           // 발신자별 메시지

// Friendship
@@index([userId])        // 사용자의 친구 요청
@@index([friendId])      // 받은 친구 요청
@@index([status])        // 상태별 필터링
```

### 4.2. 복합 인덱스 사유

- `[userId, date]`: 특정 사용자의 특정 날짜 출석 조회 최적화
- `[roomId, createdAt]`: 채팅방 메시지를 시간순으로 빠르게 로드
- `[postId, userId]`: 중복 추천 방지 + 빠른 조회

---

## 5. 초기 데이터 (Seed)

### 5.1. seed.ts 구현

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { encrypt } from '../src/services/crypto.service';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. 관리자 계정 생성
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: encrypt('관리자'),  // 암호화
      phone: encrypt('061-745-3355'),
      address: encrypt('전남 광양시 무등길 47'),
      tag: '0000',
      tier: 1,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.username);

  // 2. 학원 정보 초기화
  await prisma.academyInfo.upsert({
    where: { key: 'INFO_NAME' },
    update: {},
    create: { key: 'INFO_NAME', value: '코딩메이커학원' },
  });
  
  await prisma.academyInfo.upsert({
    where: { key: 'INFO_PHONE' },
    update: {},
    create: { key: 'INFO_PHONE', value: '061-745-3355' },
  });
  
  await prisma.academyInfo.upsert({
    where: { key: 'INFO_ADDRESS' },
    update: {},
    create: { key: 'INFO_ADDRESS', value: '전남 광양시 무등길 47 (중동 1549-9)' },
  });
  
  await prisma.academyInfo.upsert({
    where: { key: 'INFO_HOURS' },
    update: {},
    create: { key: 'INFO_HOURS', value: '평일 14:00~19:00, 토 14:00~17:00' },
  });
  
  console.log('✅ Academy info created');

  // 3. 기본 커리큘럼 생성
  await prisma.course.create({
    data: {
      title: '임베디드 전문가 과정',
      category: 'CODING',
      description: 'C언어, 회로이론, 임베디드 시스템 학습',
      instructor: '박해커',
      schedule: '월수금 14:00~16:00',
      isActive: true,
    },
  });

  await prisma.course.create({
    data: {
      title: '웹툰 창작 과정',
      category: 'MAKER',
      description: '웹툰 스토리텔링, 작화 기초',
      instructor: '김크리에이터',
      schedule: '화목 16:00~18:00',
      isActive: true,
    },
  });

  await prisma.course.create({
    data: {
      title: '컴퓨터활용능력 2급 실기',
      category: 'CERTIFICATION',
      description: '컴활 2급 자격증 대비반',
      instructor: '이선생',
      schedule: '토 14:00~17:00',
      isActive: true,
    },
  });

  console.log('✅ Courses created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 5.2. Seed 실행

```bash
# package.json에 스크립트 추가
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}

# 실행
npx prisma db seed
```

---

## 📊 예상 데이터 규모 (1년 기준)

| 테이블 | 예상 레코드 수 | 용량 예측 |
|--------|---------------|-----------|
| User | ~500명 | ~100KB |
| Attendance | ~50,000건 (200명 x 250일) | ~5MB |
| Post | ~2,000건 | ~20MB |
| Comment | ~10,000건 | ~10MB |
| Message | ~100,000건 | ~50MB |
| ChatRoom | ~500개 | ~50KB |
| Course | ~20개 | ~10KB |
| AcademyInfo | ~10개 | ~1KB |

**총 예상 용량**: ~100MB (1년)

---

## 🔄 마이그레이션 관리

### 초기 마이그레이션

```bash
# 스키마 작성 후 마이그레이션 생성
npx prisma migrate dev --name init

# 프로덕션 적용
npx prisma migrate deploy
```

### 스키마 변경 시

```bash
# 새로운 마이그레이션 생성
npx prisma migrate dev --name add_message_isread_field

# Prisma Client 재생성
npx prisma generate
```

---

## 📞 다음 단계

이 문서는 **2/4편 (데이터베이스 스키마)**입니다.

다음 문서를 읽어주세요:
- 📘 [3/4편 - API 명세](./BACKEND_DESIGN_PLAN_3_API.md)
- 📘 [4/4편 - 보안 구현](./BACKEND_DESIGN_PLAN_4_SECURITY.md)

---

**작성자**: AI Assistant (Cascade)  
**최종 수정**: 2024-11-20
