# 🚀 백엔드 개발자 인수인계 가이드

## 📋 프로젝트 개요

**프로젝트명**: 코딩메이커 아카데미 통합 관리 시스템  
**프론트엔드 완성도**: 100% (UI/UX 완성, 백엔드 연결 대기)  
**기술 스택**: Next.js 14+, TypeScript, Tailwind CSS v4, Prisma (백엔드)  
**최종 업데이트**: 2024-11-20

### 🆕 최신 추가 기능
- ✅ 커뮤니티 게시판 (디씨인사이드 스타일)
- ✅ 1:1 채팅 및 그룹 채팅 (카카오톡/슬랙 스타일)
- ✅ 유저 프로필 팝업 (친구 추가, 1:1 메시지, 신고)
- ✅ 모바일 키보드 최적화

---

## ⚠️ 중요: 보안 강화 체크리스트

### 🔐 1. 암호화 (AES-256) - 최우선 구현 필수

#### 반드시 암호화해야 하는 데이터
```typescript
// 양방향 암호화 (AES-256 + Random IV)
- 사용자 실명 (name)
- 전화번호 (phone)
- 주소 (address)
- 상담 기록 (consultationNotes)
- 1:1 채팅 내용 (chatMessages)

// 단방향 해시 (bcrypt/Argon2)
- 비밀번호 (password)
```

#### 구현 예시 (백엔드)
```typescript
// /src/lib/crypto.ts (백엔드)
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.CIPHER_KEY!, 'hex'); // 32 bytes

// ⚠️ 중요: 매번 새로운 Random IV 생성
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16); // Random IV
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // IV와 암호문을 함께 저장 (형식: iv:ciphertext)
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
  const [ivHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

**❗ 주의사항**:
- ❌ **절대 고정 IV 사용 금지** (레인보우 테이블 공격 취약)
- ✅ **매번 새로운 Random IV 생성 필수**
- ✅ IV는 DB에 암호문과 함께 저장 (`iv:ciphertext` 형식)
- ✅ `.env`의 `CIPHER_KEY`는 절대 Git에 커밋하지 말 것

---

### 🔐 2. 환경변수 보안

#### 필수 환경변수 (`.env` 파일)
```bash
# 데이터베이스
DATABASE_URL="mysql://user:password@localhost:3306/codingmaker"
DATABASE_PROVIDER="mysql" # 개발: sqlite, 프로덕션: mysql

# 암호화 키 (32 bytes hex)
CIPHER_KEY="your-32-byte-hex-key-here" # openssl rand -hex 32

# JWT 시크릿
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# Socket.io
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

**❗ 보안 주의**:
- ✅ `.env` 파일을 `.gitignore`에 추가 (이미 추가됨)
- ✅ `.env.example` 파일에는 실제 값 넣지 말 것
- ✅ 프로덕션 환경변수는 호스팅 플랫폼에서 별도 설정

---

### 🔐 3. API 보안

#### JWT 토큰 검증 미들웨어 (필수)
```typescript
// /src/middleware/auth.ts (백엔드)
import jwt from 'jsonwebtoken';

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // { id, tier, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

#### 권한 체크 미들웨어
```typescript
// Tier 기반 권한 체크
export function requireTier(allowedTiers: number[]) {
  return (req, res, next) => {
    if (!allowedTiers.includes(req.user.tier)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// 사용 예시
app.get('/api/admin/stats', authMiddleware, requireTier([1, 2]), getAdminStats);
```

---

### 🔐 4. SQL Injection 방어

✅ **Prisma ORM 사용 시 자동 방어됨**
```typescript
// ✅ 안전 (Prisma가 자동으로 파라미터화)
const user = await prisma.user.findUnique({
  where: { username: req.body.username }
});

// ❌ 위험 (절대 사용 금지)
const user = await prisma.$queryRaw`SELECT * FROM User WHERE username = ${req.body.username}`;
```

---

### 🔐 5. XSS 방어

#### 게시판 콘텐츠 처리
```typescript
// ❌ 위험: 사용자 입력을 그대로 HTML로 렌더링
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ 안전: DOMPurify 사용
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(userContent);
<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

**설치 필요**:
```bash
npm install isomorphic-dompurify
```

---

### 🔐 6. Rate Limiting (도배 방지)

```typescript
// npm install express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100개 요청
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
});

app.use('/api/', limiter);

// 로그인 엔드포인트는 더 엄격하게
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 15분에 5번만
});

app.post('/api/auth/login', loginLimiter, loginHandler);
```

---

## 📡 API 연결 가이드

### 1. 프론트엔드 API 클라이언트 사용법

#### 이미 구현된 API 클라이언트 (`/src/lib/api.ts`)
```typescript
import { api, endpoints } from '@/lib/api';

// GET 요청
const academyInfo = await api.get(endpoints.academy.info, token);

// POST 요청
const response = await api.post(endpoints.auth.login, {
  username: 'user',
  password: 'pass'
});

// PUT 요청
await api.put(endpoints.academy.update, formData, token);
```

### 2. 백엔드 API 엔드포인트 구현

#### 예시: 출석 체크 API
```typescript
// /api/attendance/checkin (백엔드)
app.post('/api/attendance/checkin', authMiddleware, async (req, res) => {
  const { tag } = req.body; // 예: "1234"
  
  try {
    // 1. 태그로 사용자 찾기
    const user = await prisma.user.findFirst({
      where: { tag }
    });
    
    if (!user) {
      return res.status(404).json({ error: '등록되지 않은 태그입니다.' });
    }
    
    // 2. 출석 기록 생성
    const attendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        status: 'ATTENDED',
        date: new Date()
      }
    });
    
    // 3. 학부모에게 실시간 알림 (Socket.io)
    if (user.parentId) {
      io.to(`parent-${user.parentId}`).emit('attendance:checked', {
        studentName: decrypt(user.name), // ⚠️ 복호화 후 전송
        time: new Date().toLocaleTimeString('ko-KR')
      });
    }
    
    // 4. 응답
    res.json({
      success: true,
      studentName: decrypt(user.name), // ⚠️ 복호화 후 전송
      time: attendance.date
    });
    
  } catch (error) {
    console.error('Attendance check error:', error);
    res.status(500).json({ error: '출석 처리 중 오류가 발생했습니다.' });
  }
});
```

**⚠️ 중요**:
- 프론트엔드로 보낼 때 암호화된 데이터는 **백엔드에서 복호화** 후 전송
- 프론트엔드는 암호화/복호화 하지 않음 (보안 키 노출 위험)

---

### 3. 프론트엔드 연결 예시

#### 키오스크 출석 체크 (`/src/app/kiosk/page.tsx`)
```typescript
// 현재 코드 (37번 줄)
const handleSubmit = () => {
  if (!value) return;
  // TODO: 백엔드 연결
};

// 수정 후
const handleSubmit = async () => {
  if (!value) return;
  
  try {
    const response = await api.post(endpoints.attendance.checkin, { 
      tag: value 
    });
    
    // 성공 모달 표시
    setShowSuccess(true);
    
    // 음성 안내 (선택)
    const utterance = new SpeechSynthesisUtterance(
      `${response.studentName}님 출석 완료!`
    );
    speechSynthesis.speak(utterance);
    
    // 3초 후 초기화
    setTimeout(() => {
      setValue('');
      setShowSuccess(false);
    }, 3000);
    
  } catch (error) {
    alert(error.message || '출석 처리 중 오류가 발생했습니다.');
  }
};
```

---

## 🗄️ Prisma 스키마 (데이터베이스)

### User 모델 예시
```prisma
model User {
  id            String    @id @default(uuid())
  username      String    @unique
  password      String    // bcrypt hash
  
  // ⚠️ 암호화된 필드 (AES-256, iv:ciphertext 형식)
  name          String    // 예: "a1b2c3d4:encrypted..."
  phone         String?
  address       String?
  
  tag           String    @unique // 출석 태그
  tier          Int       // 1~5
  role          String    // ADMIN, TEACHER, STUDENT, PARENT
  parentId      String?   // 학부모-자녀 연결
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  attendance    Attendance[]
  posts         Post[]
  comments      Comment[]
  messages      Message[]
  chatRooms     ChatRoom[] @relation("ChatRoomMembers")
  sentFriendRequests     Friendship[] @relation("SentFriendRequests")
  receivedFriendRequests Friendship[] @relation("ReceivedFriendRequests")
  
  @@index([tag])
  @@index([tier])
}

model Attendance {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  date      DateTime @default(now())
  status    String   // ATTENDED, LATE, ABSENT
  
  @@index([userId, date])
}

model Post {
  id          String    @id @default(uuid())
  title       String
  content     String    @db.Text
  category    String?   // "질문", "공유", "프로젝트", "자유"
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  views       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  comments    Comment[]
  likes       PostLike[]
  
  @@index([authorId])
  @@index([category])
  @@index([createdAt])
}

model Comment {
  id          String    @id @default(uuid())
  content     String    @db.Text
  postId      String
  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  likes       CommentLike[]
  
  @@index([postId])
  @@index([authorId])
}

model PostLike {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  createdAt DateTime @default(now())
  
  @@unique([postId, userId])
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

model ChatRoom {
  id          String    @id @default(uuid())
  type        String    // "dm" | "group"
  name        String?   // 그룹 채팅방 이름
  members     User[]    @relation("ChatRoomMembers")
  messages    Message[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([type])
}

model Message {
  id          String    @id @default(uuid())
  content     String    @db.Text
  roomId      String
  room        ChatRoom  @relation(fields: [roomId], references: [id], onDelete: Cascade)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  isEncrypted Boolean   @default(false) // 1:1 채팅인 경우 true
  createdAt   DateTime  @default(now())
  
  @@index([roomId])
  @@index([authorId])
  @@index([createdAt])
}

model Friendship {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation("SentFriendRequests", fields: [userId], references: [id])
  friendId    String
  friend      User      @relation("ReceivedFriendRequests", fields: [friendId], references: [id])
  status      String    // "PENDING", "ACCEPTED", "REJECTED", "BLOCKED"
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@unique([userId, friendId])
  @@index([userId])
  @@index([friendId])
  @@index([status])
}

model AcademyInfo {
  key         String   @id // "INFO_PHONE", "INFO_ADDRESS"
  value       String   // "061-745-3355"
  updatedAt   DateTime @updatedAt
}
```

---

## 🔌 Socket.io 실시간 통신

### 백엔드 설정
```typescript
// /src/server.ts
import { Server } from 'socket.io';

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    credentials: true
  }
});

// 인증된 사용자만 연결 허용
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // JWT 검증...
  next();
});

io.on('connection', (socket) => {
  const userId = socket.user.id;
  
  // 학부모는 자녀 알림 채널에 구독
  if (socket.user.role === 'PARENT') {
    socket.join(`parent-${userId}`);
  }
  
  // 출석 알림 전송 (위 예시 참고)
  socket.on('disconnect', () => {
    console.log('User disconnected:', userId);
  });
});
```

### 프론트엔드 연결 (선택)
```typescript
// /src/lib/socket.ts
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  auth: {
    token: localStorage.getItem('auth_token')
  }
});

socket.on('attendance:checked', (data) => {
  // 알림 표시
  alert(`${data.studentName}님이 ${data.time}에 출석했습니다.`);
});

export default socket;
```

---

## 📋 백엔드 구현 체크리스트

### Phase 1: 기본 설정
- [ ] Prisma 스키마 정의
- [ ] 암호화 유틸리티 구현 (`/src/lib/crypto.ts`)
- [ ] 환경변수 설정 (`.env`)
- [ ] JWT 미들웨어 구현

### Phase 2: 인증 API
- [ ] POST `/api/auth/login` - 로그인
- [ ] POST `/api/auth/register` - 회원가입
- [ ] GET `/api/auth/me` - 현재 사용자 정보
- [ ] POST `/api/auth/logout` - 로그아웃

### Phase 3: 출석 시스템
- [ ] POST `/api/attendance/checkin` - 출석 체크
- [ ] GET `/api/attendance/user/:userId` - 사용자별 출석 내역
- [ ] Socket.io 실시간 알림

### Phase 4: 데이터 API
- [ ] GET `/api/academy/info` - 학원 정보
- [ ] PUT `/api/academy/info` - 학원 정보 수정 (Tier 1만)
- [ ] GET `/api/courses` - 커리큘럼 목록
- [ ] POST `/api/courses` - 커리큘럼 생성 (Tier 1, 2)

### Phase 5: 커뮤니티 & 소셜
- [ ] GET `/api/community/posts` - 게시글 목록 (페이지네이션)
- [ ] GET `/api/community/posts/:id` - 게시글 상세
- [ ] POST `/api/community/posts` - 게시글 작성
- [ ] PUT `/api/community/posts/:id/like` - 게시글 추천
- [ ] POST `/api/community/posts/:id/comments` - 댓글 작성
- [ ] PUT `/api/community/comments/:id/like` - 댓글 추천
- [ ] POST `/api/community/posts/:id/report` - 게시글 신고
- [ ] XSS 방어 (DOMPurify)

### Phase 6: 채팅 시스템
- [ ] GET `/api/chat/rooms` - 채팅방 목록
- [ ] POST `/api/chat/rooms` - 새 채팅방 생성
- [ ] GET `/api/chat/rooms/:id/messages` - 메시지 내역
- [ ] POST `/api/chat/rooms/:id/messages` - 메시지 전송
- [ ] Socket.io 실시간 메시지
- [ ] 1:1 채팅 암호화 (AES-256)
- [ ] 그룹 채팅 권한 관리

### Phase 7: 친구 & 유저 프로필
- [ ] GET `/api/users/:id/profile` - 유저 프로필 조회
- [ ] POST `/api/friends/request` - 친구 요청
- [ ] PUT `/api/friends/:id/accept` - 친구 수락
- [ ] DELETE `/api/friends/:id` - 친구 삭제
- [ ] GET `/api/friends` - 친구 목록
- [ ] POST `/api/users/:id/report` - 유저 신고

---

## 🆕 커뮤니티 API 상세 가이드

### 게시글 목록 API
```typescript
// GET /api/community/posts?page=1&category=all&sort=latest
app.get('/api/community/posts', authMiddleware, async (req, res) => {
  const { page = 1, category, sort = 'latest' } = req.query;
  const limit = 10;
  const skip = (Number(page) - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      where: {
        category: category !== 'all' ? category : undefined,
      },
      include: {
        author: {
          select: { id: true, name: true } // name은 복호화 필요
        },
        _count: {
          select: { comments: true, likes: true }
        }
      },
      orderBy: sort === 'latest' ? { createdAt: 'desc' } : { likes: { _count: 'desc' } },
      skip,
      take: limit,
    });

    // 작성자 이름 복호화
    const decryptedPosts = posts.map(post => ({
      ...post,
      author: {
        ...post.author,
        name: decrypt(post.author.name)
      }
    }));

    res.json({
      posts: decryptedPosts,
      totalPages: Math.ceil(await prisma.post.count() / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글을 불러올 수 없습니다.' });
  }
});
```

### 게시글 상세 + 댓글 API
```typescript
// GET /api/community/posts/:id
app.get('/api/community/posts/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // 조회수 증가
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, role: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { likes: true }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }

    // 작성자 및 댓글 작성자 이름 복호화
    const decryptedPost = {
      ...post,
      author: {
        ...post.author,
        name: decrypt(post.author.name)
      },
      comments: post.comments.map(comment => ({
        ...comment,
        author: {
          ...comment.author,
          name: decrypt(comment.author.name)
        }
      }))
    };

    res.json(decryptedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '게시글을 불러올 수 없습니다.' });
  }
});
```

### 댓글 작성 API
```typescript
// POST /api/community/posts/:id/comments
app.post('/api/community/posts/:id/comments', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    // XSS 방어: DOMPurify (서버 사이드)
    const sanitizedContent = DOMPurify.sanitize(content);

    const comment = await prisma.comment.create({
      data: {
        content: sanitizedContent,
        postId: id,
        authorId: userId
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    });

    const decryptedComment = {
      ...comment,
      author: {
        ...comment.author,
        name: decrypt(comment.author.name)
      }
    };

    res.json(decryptedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '댓글 작성에 실패했습니다.' });
  }
});
```

---

## 💬 채팅 API 상세 가이드

### 채팅방 생성 API
```typescript
// POST /api/chat/rooms
app.post('/api/chat/rooms', authMiddleware, async (req, res) => {
  const { type, name, memberIds } = req.body; // type: 'dm' | 'group'
  const userId = req.user.id;

  try {
    const room = await prisma.chatRoom.create({
      data: {
        type,
        name,
        members: {
          connect: [{ id: userId }, ...memberIds.map(id => ({ id }))]
        }
      },
      include: {
        members: {
          select: { id: true, name: true }
        }
      }
    });

    // Socket.io로 멤버들에게 알림
    memberIds.forEach(memberId => {
      io.to(`user-${memberId}`).emit('chat:room-created', room);
    });

    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '채팅방 생성에 실패했습니다.' });
  }
});
```

### 메시지 전송 API (Socket.io)
```typescript
// Socket.io 이벤트
io.on('connection', (socket) => {
  const userId = socket.user.id;
  
  // 사용자를 개인 룸에 추가
  socket.join(`user-${userId}`);

  // 메시지 전송
  socket.on('chat:send-message', async (data) => {
    const { roomId, content } = data;

    try {
      // 1:1 채팅인 경우 암호화
      const isEncrypted = await checkIfDMRoom(roomId);
      const finalContent = isEncrypted ? encrypt(content) : content;

      const message = await prisma.message.create({
        data: {
          content: finalContent,
          roomId,
          authorId: userId,
          isEncrypted
        },
        include: {
          author: {
            select: { id: true, name: true }
          }
        }
      });

      // 채팅방 멤버들에게 전송
      const room = await prisma.chatRoom.findUnique({
        where: { id: roomId },
        include: { members: true }
      });

      const decryptedMessage = {
        ...message,
        content: isEncrypted ? decrypt(message.content) : message.content,
        author: {
          ...message.author,
          name: decrypt(message.author.name)
        }
      };

      room.members.forEach(member => {
        io.to(`user-${member.id}`).emit('chat:new-message', decryptedMessage);
      });

    } catch (error) {
      console.error(error);
      socket.emit('chat:error', { message: '메시지 전송에 실패했습니다.' });
    }
  });
});
```

---

## 👥 친구 시스템 API 가이드

### 친구 요청 API
```typescript
// POST /api/friends/request
app.post('/api/friends/request', authMiddleware, async (req, res) => {
  const { targetUserId } = req.body;
  const userId = req.user.id;

  try {
    // 이미 친구인지 확인
    const existingFriend = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId: targetUserId },
          { userId: targetUserId, friendId: userId }
        ]
      }
    });

    if (existingFriend) {
      return res.status(400).json({ error: '이미 친구이거나 요청이 진행 중입니다.' });
    }

    const friendRequest = await prisma.friendship.create({
      data: {
        userId,
        friendId: targetUserId,
        status: 'PENDING'
      }
    });

    // Socket.io로 상대방에게 알림
    io.to(`user-${targetUserId}`).emit('friend:request-received', {
      from: {
        id: userId,
        name: decrypt(req.user.name)
      }
    });

    res.json({ message: '친구 요청을 보냈습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '친구 요청에 실패했습니다.' });
  }
});
```

### 유저 프로필 조회 API
```typescript
// GET /api/users/:id/profile
app.get('/api/users/:id/profile', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            enrolledClasses: true,
            completedProjects: true,
            posts: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 친구 상태 확인
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: req.user.id, friendId: id },
          { userId: id, friendId: req.user.id }
        ]
      }
    });

    res.json({
      ...user,
      name: decrypt(user.name),
      friendStatus: friendship?.status || 'NONE',
      stats: {
        classes: user._count.enrolledClasses,
        projects: user._count.completedProjects,
        posts: user._count.posts
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '프로필을 불러올 수 없습니다.' });
  }
});
```

---

## ⚠️ 반드시 지켜야 할 보안 원칙

1. **암호화된 데이터는 백엔드에서만 복호화**
   - 프론트엔드로 보낼 때 복호화 후 전송
   - 프론트엔드는 암호화 키를 절대 모름

2. **JWT 토큰은 HttpOnly 쿠키에 저장 권장**
   - localStorage보다 안전 (XSS 공격 방어)

3. **모든 API 엔드포인트에 권한 체크**
   - 프론트엔드 권한 체크는 UX용
   - 백엔드가 최종 검증

4. **에러 메시지에 민감정보 노출 금지**
   ```typescript
   // ❌ 위험
   res.status(500).json({ error: error.message });
   
   // ✅ 안전
   res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
   console.error(error); // 서버 로그에만 기록
   ```

5. **CORS 설정**
   ```typescript
   app.use(cors({
     origin: process.env.NEXT_PUBLIC_APP_URL,
     credentials: true
   }));
   ```

---

## 📞 프론트엔드 연결 포인트

### 🆕 커뮤니티 연결 포인트

#### 게시글 목록 (`/src/app/community/page.tsx`)
- **Line 125**: 게시글 클릭 → `window.location.href = \`/community/${post.id}\``
- **API 연결 필요**: `/api/community/posts` GET
- **변경 방법**: `communityPosts` Mock 데이터를 API 호출로 교체

#### 게시글 상세 (`/src/app/community/[id]/page.tsx`)
- **Line 60**: `handleSubmitComment` - 댓글 작성
- **Line 131-137**: 추천 버튼 클릭
- **Line 104, 201**: 유저 이름 클릭 → 프로필 팝업
- **API 연결 필요**: 
  - `/api/community/posts/:id` GET (게시글 + 댓글)
  - `/api/community/posts/:id/comments` POST (댓글 작성)
  - `/api/community/posts/:id/like` PUT (추천)

### 💬 채팅 연결 포인트

#### 채팅 메인 (`/src/app/chat/page.tsx`)
- **Line 39**: `handleSendMessage` - 메시지 전송
- **Line 167-172**: 유저 아바타 클릭 → 프로필 팝업
- **API 연결 필요**:
  - `/api/chat/rooms` GET (채팅방 목록)
  - `/api/chat/rooms/:id/messages` GET (메시지 내역)
  - Socket.io: `chat:send-message` 이벤트

### 👥 유저 프로필 연결 포인트

#### 프로필 팝업 (`/src/components/UserProfilePopup.tsx`)
- **Line 53-56**: 친구 추가/삭제 버튼
- **Line 60-65**: 1:1 메시지 버튼
- **Line 68-71**: 신고하기 버튼
- **API 연결 필요**:
  - `/api/users/:id/profile` GET
  - `/api/friends/request` POST
  - `/api/friends/:id` DELETE

---

## 📋 프론트엔드 → 백엔드 데이터 매핑

### 게시글 데이터
```typescript
// 프론트엔드 (Mock)
const mockPost = {
  id: 101,
  title: "파이썬 프로젝트 팀원 구합니다!",
  author: "김민지",
  date: "2024-11-19",
  views: 256,
  likes: 32,
  content: "..."
};

// 백엔드 응답 (Expected)
{
  id: "uuid",
  title: "파이썬 프로젝트 팀원 구합니다!",
  author: {
    id: "uuid",
    name: "김민지", // ⚠️ 복호화 후
    role: "STUDENT"
  },
  createdAt: "2024-11-19T10:00:00Z",
  views: 256,
  _count: {
    likes: 32,
    comments: 7
  },
  content: "..."
}
```

### 채팅 메시지 데이터
```typescript
// 프론트엔드 (Mock)
const mockMessage = {
  id: 1,
  author: "박해커",
  content: "과제 확인했습니다",
  time: "14:20",
  isMine: false,
  avatar: "👨‍🏫"
};

// 백엔드 응답 (Expected)
{
  id: "uuid",
  author: {
    id: "uuid",
    name: "박해커" // ⚠️ 복호화 후
  },
  content: "과제 확인했습니다", // ⚠️ 1:1이면 복호화 후
  createdAt: "2024-11-19T14:20:00Z",
  isEncrypted: true
}
```

---

## 🎯 백엔드 우선순위 재정리

### Phase 1-2: 기본 (1-2주)
- [x] 암호화 시스템
- [x] JWT 인증
- [x] 출석 체크 API

### Phase 3-4: 핵심 (2-3주)
- [ ] 커뮤니티 게시판 API (게시글, 댓글, 추천)
- [ ] 채팅 시스템 API (채팅방, 메시지)
- [ ] Socket.io 실시간 통신

### Phase 5: 소셜 (3-4주)
- [ ] 유저 프로필 API
- [ ] 친구 시스템 API

---

## 📞 문의사항

백엔드 연결 중 프론트엔드 수정이 필요하면:
1. `/src/lib/api.ts` - API 엔드포인트 경로 확인
2. 각 페이지의 `onClick` 핸들러 - API 호출 추가
3. `AuthContext.tsx` - Mock 데이터를 실제 데이터로 교체
4. `/src/components/UserProfilePopup.tsx` - 프로필 데이터 연결

**프론트엔드는 백엔드 연결 준비 완료 상태입니다!**

### 🆕 추가된 프론트엔드 파일
- `/src/components/UserProfilePopup.tsx` - 유저 프로필 팝업
- `/src/app/community/[id]/page.tsx` - 게시글 상세 (디씨 스타일)
- `/src/app/chat/page.tsx` - 채팅 페이지 (카톡/슬랙 스타일)
