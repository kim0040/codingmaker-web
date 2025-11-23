# 🚀 배포 체크리스트

## ✅ 개발 환경 준비

### 백엔드
- [x] Node.js 20+ 설치
- [x] npm 패키지 설치
- [x] 환경 변수 설정 (.env)
- [x] Prisma 마이그레이션
- [x] Seed 데이터 생성
- [x] 개발 서버 실행 확인

### 프론트엔드
- [x] Node.js 20+ 설치
- [x] npm 패키지 설치
- [x] 환경 변수 설정 (.env.local)
- [x] 개발 서버 실행 확인

---

## 🧪 테스트 완료

### API 테스트
- [x] 인증 API (로그인/회원가입/사용자 정보)
- [x] 출석 API (체크인/조회)
- [x] 학원 정보 API (조회/수정)
- [x] 커리큘럼 API (CRUD)
- [x] 커뮤니티 API (게시글/댓글/추천)
- [x] 친구 시스템 API (요청/수락/목록/삭제)
- [x] 사용자 API (프로필 조회)
- [x] 채팅 API (채팅방/메시지)

### Socket.io 테스트
- [x] 연결/인증
- [x] 채팅 메시지 전송
- [x] 타이핑 표시
- [x] 출석 알림

### 보안 테스트
- [x] AES-256 암호화 (Random IV)
- [x] JWT 인증/만료
- [x] Tier 권한 체크
- [x] Rate Limiting

---

## 📦 프로덕션 준비

### 환경 설정
- [ ] 프로덕션 DATABASE_URL 설정
- [ ] CIPHER_KEY 64자 hex 키 생성
- [ ] JWT_SECRET 강력한 비밀키 생성
- [ ] FRONTEND_URL 프로덕션 도메인 설정
- [ ] CORS 설정 확인

### 데이터베이스
- [ ] MySQL 서버 준비
- [ ] schema.prisma provider 변경 (mysql)
- [ ] 프로덕션 DB 마이그레이션
- [ ] Seed 데이터 생성
- [ ] 백업 전략 수립

### 빌드 & 배포
- [ ] 백엔드 빌드 테스트
- [ ] 프론트엔드 빌드 테스트
- [ ] 정적 파일 최적화
- [ ] 번들 크기 확인

### 보안
- [ ] HTTPS 인증서 설정
- [ ] 방화벽 설정
- [ ] Rate Limiting 프로덕션 값 조정
- [ ] 환경 변수 암호화 저장
- [ ] 로그 수집 설정

---

## 🌐 서버 배포

### 옵션 1: VPS (Recommended)
```bash
# 1. 서버 준비
ssh user@your-server

# 2. Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. PM2 설치
npm install -g pm2

# 4. 프로젝트 클론
git clone your-repo.git
cd your-repo

# 5. 백엔드 배포
cd backend
npm install
npm run build
pm2 start dist/server.js --name cmlms-backend

# 6. 프론트엔드 빌드
cd ..
npm install
npm run build
pm2 start npm --name cmlms-frontend -- start
```

### 옵션 2: Docker
```bash
# Dockerfile 작성 필요
docker-compose up -d
```

### 옵션 3: Vercel (프론트엔드) + Railway (백엔드)
```bash
# Vercel
vercel --prod

# Railway
railway up
```

---

## 📊 모니터링

### 로그 확인
```bash
# PM2 로그
pm2 logs

# 특정 앱 로그
pm2 logs cmlms-backend
```

### 성능 모니터링
- [ ] CPU/메모리 사용률
- [ ] API 응답 시간
- [ ] 데이터베이스 쿼리 성능
- [ ] Socket.io 연결 수

---

## 🔄 업데이트 프로세스

### 백엔드 업데이트
```bash
cd backend
git pull
npm install
npm run build
pm2 restart cmlms-backend
```

### 프론트엔드 업데이트
```bash
git pull
npm install
npm run build
pm2 restart cmlms-frontend
```

### 데이터베이스 마이그레이션
```bash
cd backend
npm run prisma:migrate
```

---

## 🆘 트러블슈팅

### 백엔드 서버 안됨
1. 포트 충돌 확인: `lsof -ti:3001`
2. 로그 확인: `pm2 logs cmlms-backend`
3. 환경 변수 확인: `.env` 파일 존재 여부

### 프론트엔드 빌드 실패
1. Node.js 버전 확인: `node -v`
2. 캐시 삭제: `rm -rf .next node_modules`
3. 재설치: `npm install`

### 데이터베이스 연결 실패
1. DATABASE_URL 확인
2. MySQL 서버 상태 확인
3. 방화벽 포트 개방 확인

---

## ✅ 최종 체크리스트

### 필수 확인 사항
- [ ] 모든 API 엔드포인트 정상 동작
- [ ] Socket.io 실시간 통신 정상
- [ ] 암호화/복호화 정상
- [ ] 권한 시스템 정상
- [ ] 프론트엔드 모든 페이지 로드
- [ ] 로그인/로그아웃 정상
- [ ] 모바일 반응형 확인

### 보안 확인
- [ ] HTTPS 적용
- [ ] JWT 비밀키 변경
- [ ] CIPHER_KEY 변경
- [ ] CORS 화이트리스트 설정
- [ ] Rate Limiting 동작 확인
- [ ] SQL Injection 방어 확인

### 문서화
- [ ] API 문서 최신화
- [ ] 관리자 매뉴얼 작성
- [ ] 사용자 가이드 작성
- [ ] 트러블슈팅 가이드 작성

---

## 🎉 배포 완료 후

1. **관리자 계정 변경**
   - 기본 admin 계정 비밀번호 변경
   - 운영자 계정 추가 생성

2. **데이터 백업 설정**
   - 자동 백업 스케줄 설정
   - 백업 복구 테스트

3. **모니터링 알림 설정**
   - 서버 다운 알림
   - 에러 로그 알림
   - 디스크 용량 알림

4. **사용자 교육**
   - 관리자 교육
   - 강사 교육
   - 학생/학부모 안내

---

**배포 준비 완료!** 🚀
