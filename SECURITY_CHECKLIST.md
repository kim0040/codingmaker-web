# 🔐 보안 체크리스트 - 제출 전 필수 확인

## ✅ 프론트엔드 보안 검증 완료

### 1. 환경변수 보안
- [x] `.env` 파일이 `.gitignore`에 포함됨
- [x] `.env.example` 파일에 실제 값 없음
- [x] `NEXT_PUBLIC_*` 접두사로 클라이언트 노출 변수 구분
- [x] API 키, 시크릿 등 민감 정보 하드코딩 없음

### 2. 인증/권한 구조
- [x] AuthContext 구현 완료 (`/src/contexts/AuthContext.tsx`)
- [x] ProtectedRoute 컴포넌트 준비 (`/src/components/ProtectedRoute.tsx`)
- [x] Tier 기반 권한 체크 함수 (`hasPermission`, `isRole`)
- [x] 조건부 렌더링 헬퍼 (`ShowForTiers`, `ShowForRoles`)

### 3. XSS 방어 준비
- [x] 사용자 입력 데이터 직접 HTML 렌더링 없음
- [x] `dangerouslySetInnerHTML` 사용 없음 (백엔드에서 DOMPurify 처리 예정)
- [x] URL 파라미터 직접 사용 없음

### 4. CSRF 방어
- [x] 모든 form은 POST 메서드 사용
- [x] 백엔드 API는 JWT 토큰으로 인증 (CSRF 토큰 불필요)

### 5. 클라이언트 측 검증
- [x] 모든 입력 필드에 기본 검증 (타입, 길이)
- [x] 서버 측 검증이 최종 방어선임을 이해

---

## 🚨 백엔드 개발자가 반드시 구현해야 할 보안 요소

### 🔴 Critical (최우선)

#### 1. 암호화 (AES-256 + Random IV)
```typescript
❗ 필수 구현:
- 사용자 실명, 전화번호, 주소
- 상담 기록, 채팅 메시지
- ⚠️ 매번 새로운 Random IV 생성
- ⚠️ IV와 암호문을 함께 저장 (iv:ciphertext)
```

**고정 IV 사용 시 발생하는 보안 취약점**:
- 동일한 평문은 항상 동일한 암호문 생성
- 패턴 분석으로 원본 데이터 유추 가능
- 레인보우 테이블 공격에 취약

#### 2. 비밀번호 해시 (bcrypt/Argon2)
```typescript
✅ 올바른 방법:
const hash = await bcrypt.hash(password, 10);

❌ 절대 금지:
- MD5, SHA1 사용
- Salt 없이 해시
- 평문 저장
```

#### 3. JWT 토큰 관리
```typescript
✅ 필수:
- 토큰 만료 시간 설정 (7일 권장)
- Refresh Token 구현
- HttpOnly 쿠키 저장 (XSS 방어)

❌ 금지:
- localStorage에 민감정보 저장
- 토큰 무한 유효기간
```

---

### 🟡 High Priority (높은 우선순위)

#### 4. SQL Injection 방어
```typescript
✅ Prisma ORM 사용 (자동 방어)
❌ Raw Query 사용 금지
```

#### 5. Rate Limiting (도배 방지)
```typescript
필수 엔드포인트:
- /api/auth/login (15분에 5회)
- /api/auth/register (1시간에 3회)
- /api/attendance/checkin (1분에 10회)
```

#### 6. CORS 설정
```typescript
✅ 허용된 도메인만:
origin: process.env.NEXT_PUBLIC_APP_URL
credentials: true
```

---

### 🟢 Medium Priority (중간 우선순위)

#### 7. 에러 처리
```typescript
❌ 금지: 스택 트레이스 클라이언트 노출
✅ 필수: 일반 에러 메시지 + 서버 로그
```

#### 8. 파일 업로드 검증
```typescript
- 파일 타입 검증 (MIME type)
- 파일 크기 제한 (10MB)
- 악성 파일 스캔
- 파일명 sanitize
```

#### 9. API 타임아웃
```typescript
모든 API 요청: 30초 타임아웃
장시간 작업: 별도 처리 (큐 시스템)
```

---

## 🛡️ 보안 취약점 자가 진단

### 프론트엔드 체크

- [x] 민감 정보 console.log 없음
- [x] 개발용 코드 주석 처리 또는 제거
- [x] 하드코딩된 API 키 없음
- [x] 사용자 입력 직접 HTML 렌더링 없음
- [x] localStorage에 암호화되지 않은 민감정보 없음

### 백엔드 체크 (개발자 확인 필요)

- [ ] 모든 암호화 필드에 Random IV 사용
- [ ] 비밀번호 bcrypt/Argon2 해시
- [ ] JWT 토큰 검증 미들웨어
- [ ] 모든 API 엔드포인트 권한 체크
- [ ] Rate Limiting 적용
- [ ] CORS 적절히 설정
- [ ] SQL Injection 방어 (Prisma 사용)
- [ ] XSS 방어 (DOMPurify 사용)
- [ ] 에러 메시지 일반화
- [ ] HTTPS 사용 (프로덕션)

---

## 🚀 배포 전 최종 체크리스트

### 환경 설정
- [ ] `.env` 파일 Git에 커밋 안 됨 확인
- [ ] 프로덕션 환경변수 별도 설정
- [ ] HTTPS 인증서 설정
- [ ] 도메인 CORS 화이트리스트 등록

### 보안 강화
- [ ] Content Security Policy (CSP) 헤더 설정
- [ ] X-Frame-Options 헤더 (클릭재킹 방지)
- [ ] X-Content-Type-Options: nosniff
- [ ] Strict-Transport-Security (HSTS)

### 성능/모니터링
- [ ] 에러 로깅 시스템 (Sentry 등)
- [ ] API 응답 시간 모니터링
- [ ] 데이터베이스 백업 자동화
- [ ] 일일 보안 로그 검토

---

## 📋 침투 테스트 시나리오

### 테스트해야 할 공격 시나리오

1. **SQL Injection**
   - 로그인 폼에 `' OR '1'='1` 입력
   - 검색창에 SQL 쿼리 삽입

2. **XSS (Cross-Site Scripting)**
   - 게시판에 `<script>alert('XSS')</script>` 작성
   - 댓글에 `<img src=x onerror=alert('XSS')>` 삽입

3. **CSRF (Cross-Site Request Forgery)**
   - 다른 사이트에서 API 호출 시도

4. **무차별 대입 공격 (Brute Force)**
   - 로그인 100회 연속 시도
   - Rate Limiting 작동 확인

5. **권한 우회**
   - Tier 3 사용자가 Tier 1 API 호출 시도
   - JWT 토큰 조작 시도

6. **세션 하이재킹**
   - 다른 브라우저에서 토큰 재사용
   - 만료된 토큰 사용 시도

---

## ⚠️ 개발자 주의사항

### 절대 하지 말아야 할 것

1. ❌ 프로덕션 DB에 테스트 데이터 입력
2. ❌ console.log에 민감 정보 출력
3. ❌ 에러 메시지에 스택 트레이스 노출
4. ❌ 주석에 비밀번호, API 키 작성
5. ❌ 암호화 키를 Git에 커밋
6. ❌ 사용자 입력을 검증 없이 DB 저장
7. ❌ CORS를 `*` (모든 도메인)로 설정
8. ❌ JWT 토큰을 URL 파라미터로 전달

### 반드시 해야 할 것

1. ✅ 모든 사용자 입력 검증 (백엔드)
2. ✅ 민감 데이터 암호화 (Random IV)
3. ✅ 권한 체크 (모든 API)
4. ✅ 에러 로그 기록 (서버만)
5. ✅ 정기적인 보안 업데이트
6. ✅ 코드 리뷰 (보안 관점)
7. ✅ HTTPS 사용 (프로덕션)
8. ✅ 백업 자동화

---

## 📞 보안 이슈 발견 시

### 긴급 대응 절차
1. 즉시 해당 기능 비활성화
2. 로그 분석 (공격 범위 파악)
3. 취약점 패치
4. 영향받은 사용자 통보
5. 재발 방지 대책 수립

### 보안 업데이트 주기
- 의존성 패키지: 월 1회 업데이트
- 보안 패치: 즉시 적용
- 침투 테스트: 분기 1회

---

## 🎓 보안 학습 자료

### 권장 문서
- OWASP Top 10 (웹 보안 취약점)
- NIST 암호화 가이드라인
- JWT 모범 사례

### 체크 도구
- npm audit (의존성 취약점)
- ESLint security plugin
- SonarQube (코드 품질)

---

**🔐 보안은 한 번의 작업이 아닌 지속적인 프로세스입니다!**
