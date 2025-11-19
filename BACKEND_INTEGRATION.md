# 백엔드 통합 가이드

## 📋 현재 상태

프론트엔드는 **백엔드 연결 준비가 완료된 상태**입니다. 실제 API가 구현되면 아래 파일들을 수정하여 연결하세요.

## 🔧 백엔드 연결 체크리스트

### 1. API 클라이언트 설정
파일: `/src/lib/api.ts`

- [x] API 엔드포인트 정의 완료
- [x] Error handling 구현
- [ ] 실제 API URL 환경변수로 설정 (`.env.local`)

### 2. 권한 시스템
파일: `/src/contexts/AuthContext.tsx`

- [x] Tier 1-5 권한 체계 구현
- [x] Mock 로그인 구현
- [ ] 실제 JWT 토큰 인증으로 교체
- [ ] 토큰 갱신 (Refresh Token) 로직 추가

### 3. 동적 데이터 로드
파일: `/src/hooks/useAcademyInfo.ts`

- [x] Hook 구조 구현
- [ ] API 호출 주석 해제 (현재 36-37번 줄)
- [ ] 에러 처리 개선

### 4. 페이지별 API 연결

#### 출석 시스템 (`/kiosk`)
- 파일: `/src/app/kiosk/page.tsx`
- 수정 필요: `handleSubmit` 함수 (37번 줄)
```typescript
// 현재 (Mock)
if (value.startsWith("홍길동")) { ... }

// 변경 (API 연결)
const response = await api.post(endpoints.attendance.checkin, { tag: value });
```

#### 관리자 대시보드
- 파일: `/src/app/admin/page.tsx`
- 모든 데이터를 `src/data/admin.ts`에서 가져옴
- API 연결 후 `useState` + `useEffect`로 실시간 데이터 가져오기

#### CMS 페이지 (`/admin/cms`)
- 파일: `/src/app/admin/cms/page.tsx`
- Form submit 시 API 호출 추가
```typescript
const handleSave = async () => {
  await api.put(endpoints.academy.update, formData);
  alert('저장 완료!');
};
```

#### 데이터 분석 (`/admin/analytics`)
- 파일: `/src/app/admin/analytics/page.tsx`
- Recharts 설치 필요: `npm install recharts`
- API에서 통계 데이터 가져오기

## 🔒 암호화된 데이터 처리

### 백엔드 응답 예시
```json
{
  "id": "user-123",
  "username": "student1",
  "name": "김코딩", // ← 백엔드에서 복호화되어 전달됨
  "phone": "010-1234-5678", // ← 백엔드에서 복호화되어 전달됨
  "tier": 3
}
```

**중요:** 
- 프론트엔드에서는 암호화/복호화를 하지 않습니다.
- 백엔드 API에서 복호화된 데이터를 받습니다.
- 민감정보 표시 시 마스킹 처리만 수행합니다.

## 📡 실시간 통신 (Socket.io)

### 설치
```bash
npm install socket.io-client
```

### 구현 예시
파일: `/src/lib/socket.ts` (생성 필요)

```typescript
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

socket.on('attendance:checked', (data) => {
  // 출석 체크 시 실시간 알림
  console.log('출석:', data);
});

socket.on('announcement', (data) => {
  // 긴급 공지
  alert(data.message);
});

export default socket;
```

## 🔗 API 엔드포인트 매핑

| 기능 | 프론트엔드 | 백엔드 경로 | HTTP 메서드 |
|------|-----------|-----------|------------|
| 로그인 | AuthContext | `/api/auth/login` | POST |
| 출석 체크 | /kiosk | `/api/attendance/checkin` | POST |
| 학원 정보 | useAcademyInfo | `/api/academy/info` | GET |
| 커리큘럼 목록 | /lms | `/api/courses` | GET |
| 통계 데이터 | /admin/analytics | `/api/analytics/*` | GET |

## 📦 추가 설치 필요 패키지

```bash
# 데이터 분석 차트
npm install recharts

# 실시간 통신
npm install socket.io-client

# 데이터 fetching (선택)
npm install swr
# 또는
npm install @tanstack/react-query

# Form 관리 (선택)
npm install react-hook-form zod
```

## ⚡ 개발 프로세스

1. **.env.local 설정**
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

2. **백엔드 서버 실행**
   ```bash
   # 백엔드 디렉토리에서
   npm run dev
   ```

3. **프론트엔드 개발 서버 실행**
   ```bash
   # 프론트엔드 디렉토리에서
   npm run dev
   ```

4. **API 연결 테스트**
   - 브라우저 DevTools의 Network 탭에서 API 호출 확인
   - Console에서 에러 메시지 확인

## 🐛 트러블슈팅

### CORS 에러
백엔드에서 CORS 설정:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### 401 Unauthorized
- localStorage에 토큰이 저장되어 있는지 확인
- Authorization 헤더가 올바른지 확인

### 데이터 타입 불일치
- `/src/types/index.ts` 파일의 인터페이스와 백엔드 응답 비교
- 필요 시 타입 정의 수정

## 📝 다음 단계

1. [ ] Prisma 스키마 정의 (백엔드)
2. [ ] API 라우트 구현 (백엔드)
3. [ ] 프론트엔드 API 연결
4. [ ] 테스트 및 디버깅
5. [ ] 배포 준비
