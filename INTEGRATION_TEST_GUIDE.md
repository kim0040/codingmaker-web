# 🔗 프론트엔드-백엔드 통합 가이드

## ✅ 완료된 통합 작업

### 1. 백엔드 API (25개 엔드포인트)
- ✅ 인증 API (3개)
- ✅ 출석 API (2개)
- ✅ 학원 정보 API (2개)
- ✅ 커리큘럼 API (4개)
- ✅ 커뮤니티 API (5개)
- ✅ 친구 시스템 API (4개)
- ✅ 사용자 API (1개)
- ✅ 채팅 API (4개) **NEW**

### 2. Socket.io 실시간 통신
- ✅ Socket.io 서버 구현
- ✅ JWT 인증 미들웨어
- ✅ 채팅 메시지 실시간 전송
- ✅ 타이핑 표시
- ✅ 출석 알림

### 3. 프론트엔드 연동
- ✅ `.env.local` 환경 변수 설정
- ✅ `AuthContext` 실제 API 연동
- ✅ Socket.io 클라이언트 구현
- ✅ API 클라이언트 준비 완료

---

## 🧪 통합 테스트 시나리오

### 시나리오 1: 로그인 & 인증
```bash
# 1. 로그인
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}'

# 응답:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "username": "admin",
      "name": "관리자",
      "tier": 1,
      "role": "ADMIN"
    }
  }
}

# 2. 토큰으로 사용자 정보 조회
TOKEN="..."
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/auth/me
```

### 시나리오 2: 채팅방 생성 & 메시지
```bash
# 1. 채팅방 생성 (1:1 DM)
curl -X POST http://localhost:3001/api/chat/rooms \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"dm","memberIds":["user-id"]}'

# 2. 채팅방 목록 조회
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/chat/rooms

# 3. 메시지 전송
curl -X POST http://localhost:3001/api/chat/rooms/ROOM_ID/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"안녕하세요!"}'

# 4. 메시지 내역 조회
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/chat/rooms/ROOM_ID/messages?page=1&limit=50"
```

### 시나리오 3: 커뮤니티
```bash
# 1. 게시글 작성
curl -X POST http://localhost:3001/api/community/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"공지사항","content":"첫 게시글","category":"공지"}'

# 2. 게시글 목록 조회
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3001/api/community/posts?page=1&limit=10"

# 3. 게시글 추천
curl -X PUT http://localhost:3001/api/community/posts/POST_ID/like \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📱 프론트엔드 사용법

### 1. 환경 변수 확인
`.env.local` 파일이 생성되었는지 확인:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 2. 개발 서버 실행
```bash
# 백엔드 서버 (이미 실행 중)
cd backend
npm run dev

# 프론트엔드 서버
cd ..
npm run dev
```

### 3. 로그인 테스트
1. 브라우저에서 `http://localhost:3000/login` 접속
2. 계정 정보 입력:
   - 아이디: `admin`
   - 비밀번호: `admin1234`
3. 로그인 성공 시 자동으로 홈으로 리다이렉트

### 4. Socket.io 연결 확인
로그인 후 브라우저 콘솔에서 확인:
```javascript
// AuthContext에서 자동으로 Socket.io 연결
// 콘솔에 "✅ Socket.io connected" 표시되어야 함
```

---

## 🔧 주요 통합 코드

### AuthContext 사용 예시
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('admin', 'admin1234');
      // 로그인 성공
    } catch (error) {
      // 로그인 실패
    }
  };

  if (isLoading) return <div>로딩중...</div>;
  if (!user) return <div>로그인 필요</div>;

  return <div>환영합니다, {user.name}님!</div>;
}
```

### API 호출 예시
```tsx
import { api, endpoints } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

function CommunityPage() {
  const { token } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await api.get(
        `${endpoints.community.posts}?page=1&limit=10`,
        token || undefined
      );
      console.log(response);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  return <button onClick={fetchPosts}>게시글 불러오기</button>;
}
```

### Socket.io 사용 예시
```tsx
import { socketService } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

function ChatRoom({ roomId }: { roomId: string }) {
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    // Socket.io 연결
    socketService.connect(token);
    
    // 채팅방 참가
    socketService.joinRoom(roomId);

    // 새 메시지 수신
    socketService.onNewMessage((message) => {
      console.log('New message:', message);
    });

    return () => {
      socketService.leaveRoom(roomId);
    };
  }, [token, roomId]);

  const sendMessage = (content: string) => {
    socketService.sendMessage(roomId, content, Date.now().toString());
  };

  return <div>채팅방</div>;
}
```

---

## 🎯 다음 작업

### Phase 1: UI 연동
- [ ] 로그인 페이지 실제 API 연결 테스트
- [ ] 키오스크 출석 체크 연동
- [ ] 커뮤니티 게시판 연동
- [ ] 커리큘럼 목록 연동

### Phase 2: 실시간 기능
- [ ] 채팅 UI에 Socket.io 연결
- [ ] 출석 알림 실시간 표시
- [ ] 타이핑 표시 구현

### Phase 3: 추가 기능
- [ ] 프로필 이미지 업로드
- [ ] 파일 첨부 기능
- [ ] 데이터 분석 대시보드

---

## 📊 현재 완성도

| 구분 | 완성도 | 상태 |
|------|--------|------|
| **백엔드 API** | 100% | 25개 엔드포인트 완성 |
| **Socket.io** | 100% | 실시간 통신 완성 |
| **프론트엔드 UI** | 90% | UI 완성, 연동 대기 |
| **통합 연동** | 20% | AuthContext 연동 완료 |
| **테스트** | 30% | API 테스트 완료 |

**전체 프로젝트**: **약 75% 완료**

---

## 🚀 실행 가이드

### 서버 시작
```bash
# 터미널 1: 백엔드
cd backend
npm run dev

# 터미널 2: 프론트엔드
cd ..
npm run dev
```

### 접속 URL
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/healthz

### 기본 계정
- **아이디**: admin
- **비밀번호**: admin1234
- **태그**: 0000
- **권한**: Tier 1 (최고 관리자)

---

## 🔍 트러블슈팅

### CORS 오류
백엔드 `.env` 파일에서 FRONTEND_URL 확인:
```bash
FRONTEND_URL=http://localhost:3000
```

### Socket.io 연결 실패
1. 백엔드 서버가 실행 중인지 확인
2. 콘솔에서 연결 오류 확인
3. 토큰이 유효한지 확인

### API 401 오류
1. localStorage에 토큰이 저장되어 있는지 확인
2. 토큰이 만료되지 않았는지 확인
3. 로그아웃 후 다시 로그인

---

**통합 가이드 완료! 이제 프론트엔드에서 실제 API를 사용할 수 있습니다!** 🎉
