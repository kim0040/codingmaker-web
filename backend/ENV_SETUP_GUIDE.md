# 🔧 환경 변수 설정 가이드

## 개발 환경 (.env)

백엔드 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 설정하세요:

```bash
# Database Provider (sqlite 또는 mysql)
DATABASE_PROVIDER=sqlite

# Database URL
# SQLite (개발)
DATABASE_URL=file:./prisma/dev.db

# MySQL (운영) - 사용 시 아래 형식으로 변경
# DATABASE_URL=mysql://user:password@localhost:3306/codingmaker

# 암호화 키 (32-byte hex = 64 characters)
# 새로운 키 생성: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CIPHER_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# JWT 시크릿 키
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# JWT 만료 시간
JWT_EXPIRES_IN=7d

# 서버 포트
PORT=3001

# 프론트엔드 URL (CORS)
FRONTEND_URL=http://localhost:3000
```

---

## 운영 환경 (.env.production)

프로덕션 배포 시 사용할 환경 변수:

```bash
# Database Provider - MySQL 사용
DATABASE_PROVIDER=mysql

# Database URL - 실제 MySQL 서버 정보
DATABASE_URL=mysql://username:password@your-mysql-host:3306/codingmaker_db

# 암호화 키 - 반드시 새로 생성!
CIPHER_KEY=<새로운 64자리 hex 키>

# JWT 시크릿 키 - 반드시 새로 생성!
JWT_SECRET=<강력한 시크릿 키>

# JWT 만료 시간
JWT_EXPIRES_IN=7d

# 서버 포트
PORT=3001

# 프론트엔드 URL
FRONTEND_URL=https://your-domain.com
```

---

## MySQL 전환 가이드

### 1. MySQL 데이터베이스 생성

```sql
CREATE DATABASE codingmaker_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'codingmaker'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON codingmaker_db.* TO 'codingmaker'@'localhost';
FLUSH PRIVILEGES;
```

### 2. 환경 변수 변경

```bash
DATABASE_PROVIDER=mysql
DATABASE_URL=mysql://codingmaker:your_password@localhost:3306/codingmaker_db
```

### 3. Prisma 마이그레이션

```bash
# Prisma 클라이언트 재생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate deploy

# 또는 개발 환경
npx prisma migrate dev --name init

# Seed 데이터 삽입
npm run db:seed
```

### 4. MySQL 특화 최적화 (선택사항)

Prisma Schema에서 MySQL 전용 타입 사용:

```prisma
model Post {
  content String @db.Text  // 긴 텍스트용
}

model Message {
  content String @db.Text
}
```

---

## 보안 주의사항

### 암호화 키 생성

안전한 키 생성 방법:

```bash
# Node.js로 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 또는 OpenSSL
openssl rand -hex 32
```

### 환경 변수 파일 관리

- `.env` 파일은 **절대 Git에 커밋하지 마세요**
- `.gitignore`에 포함되어 있는지 확인
- 운영 서버에서는 환경 변수를 시스템 레벨로 관리

---

## 데이터베이스 타입별 차이점

| 기능 | SQLite | MySQL |
|------|--------|-------|
| 동시 접속 | 제한적 | 우수 |
| 성능 | 소규모 | 대규모 |
| 설정 | 간단 | 복잡 |
| 백업 | 파일 복사 | mysqldump |
| 용도 | 개발/테스트 | 운영 |

---

## 트러블슈팅

### Prisma 에러: Provider env() not supported

**문제**: `schema.prisma`에서 `provider = env("DATABASE_PROVIDER")` 사용 시 에러

**해결**:
1. Prisma 버전 확인 (5.0+ 필요)
2. `DATABASE_PROVIDER` 환경 변수 설정 확인
3. `.env` 파일 위치 확인

### MySQL 연결 실패

**문제**: `Error: Can't reach database server`

**해결**:
1. MySQL 서비스 실행 확인: `systemctl status mysql`
2. 방화벽 포트 개방: 3306
3. DATABASE_URL 형식 확인
4. 사용자 권한 확인

---

**작성일**: 2024-11-20  
**업데이트**: MySQL 전환 가이드 추가
