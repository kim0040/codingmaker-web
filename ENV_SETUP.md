# 환경변수 설정 가이드

백엔드 API 연결 시 `.env.local` 파일을 생성하고 아래 환경변수를 설정해주세요.

## 필수 환경변수

```bash
# API 서버 주소
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 암호화 키 (AES-256, 32 bytes)
# 백엔드와 동일한 키 사용 필요
CIPHER_KEY=your-32-character-secret-key-here

# Socket.io 서버 주소 (실시간 통신)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## 선택 환경변수

```bash
# 개발/프로덕션 구분
NODE_ENV=development

# 디버그 모드
NEXT_PUBLIC_DEBUG_MODE=false

# API 타임아웃 (ms)
NEXT_PUBLIC_API_TIMEOUT=30000
```

## 주의사항

- `CIPHER_KEY`는 백엔드와 반드시 동일해야 합니다.
- `NEXT_PUBLIC_` 접두사가 있는 변수만 클라이언트에서 접근 가능합니다.
- 프로덕션 배포 시 환경변수를 반드시 설정해주세요.
