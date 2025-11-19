# [통합 개발 명세서] 코딩메이커(Coding Maker) 학원 통합 관리 시스템

## 1. 프로젝트 개요 (Overview)

- **프로젝트명:** 코딩메이커 (Coding Maker) 학원 웹 플랫폼
    
- **운영 주체:** 코딩메이커학원 (전남 광양시 중동)
    
- **목적:** 임베디드/코딩, 웹툰/창작, 자격증 반으로 구성된 학원의 커리큘럼 관리 및 학생(중고등/성인), 학부모 소통을 위한 올인원 플랫폼 구축.
    
- **목표 수용 인원:** 일일 활성 사용자(DAU) 200명+ (소규모 클래스 집중 관리 최적화)
    
- **개발 스택:** Next.js (App Router), Prisma ORM, Tailwind CSS
    
- **문서 성격:** 본 문서는 외부 레퍼런스 없이도 개발이 가능하며, **'광양 코딩메이커학원'의 실제 운영 정보를 기반으로 구축**되어야 하는 완전한 명세서입니다.
    

## 2. 시스템 아키텍처 및 기술 스택 (Architecture)

### 2.1. 데이터베이스 전략 (Dual DB Strategy)

- **전략:** **개발/테스트 = SQLite** vs **운영(Production) = MySQL**
    
    - **개발 환경 (Local):** `SQLite` 사용. 빠른 프로토타이핑.
        
    - **운영 환경 (Prod):** `MySQL` (또는 MariaDB). 동시 접속 안정성 확보.
        
- **전환 방식:** 환경변수(`DATABASE_PROVIDER`)에 따라 Prisma 스키마 스위칭.
    
- **백업:** Daily Cron Backup 및 관리자 페이지 원클릭 롤백(Snapshot Restore).
    

### 2.2. 보안 및 암호화 전략 (Security Strategy) - 🚨 필수 요건

- **핵심 원칙:** "DB가 유출되어도 개인정보는 절대 식별 불가능해야 한다."
    
- **암호화 대상 (AES-256 양방향 암호화):**
    
    - **유저 실명 (Name)**
        
    - **전화번호 (Phone/Contact):** 학생 및 학부모 연락처
        
    - **주소 (Address):** 거주지 정보
        
    - **상담 기록:** 학생 특이사항 및 상담 내용
        
    - **채팅 내용:** 1:1 DM 및 그룹 채팅 본문
        
- **구현 방식 (Salt & Random IV 적용):**
    
    - **비밀번호:** `bcrypt` 또는 `Argon2` 사용 (자동 **Salt** 적용으로 레인보우 테이블 공격 방어).
        
    - **데이터(AES-256):**
        
        - **키(Key):** `.env`의 `CIPHER_KEY` (고정값, 32bytes) 사용.
            
        - **IV(Initial Vector):** 암호화 수행 시마다 **매번 새로운 Random IV(16bytes)** 생성 필수.
            
        - **저장 포맷:** DB에는 `iv:ciphertext` 형태로 결합하여 저장하거나 별도 필드로 관리하여, 복호화 시 해당 IV를 사용하도록 구현. (고정 IV 사용 금지)
            
    - `src/lib/crypto.ts` 유틸리티 필수 구현.
        

### 2.3. 잠재적 보안 위협 대응

1. **무한 루프/리소스 고갈:** API Timeout 설정, Rate Limiting(도배 방지) 적용.
    
2. **인젝션 공격:** Prisma ORM 사용으로 SQL Injection 방어, 게시판 XSS 방지(`DOMPurify`).
    
3. **권한 우회:** 미들웨어(`middleware.ts`)에서 토큰 기반의 엄격한 Role 체크.
    

### 2.4. 실시간 통신 (Socket)

- **기술:** Socket.io.
    
- **기능:** 실시간 채팅, 출석 알림(학부모 전송), 긴급 공지 팝업.
    

## 3. 사용자 권한 체계 (Tier System)

|   |   |   |
|---|---|---|
|**티어**|**역할명**|**권한 및 설명**|
|**Tier 1**|**최고 관리자 (원장)**|시스템 전체 제어, 출석 계정 생성, **학원 정보/커리큘럼 실시간 수정**, 관리자 임명.|
|**Tier 2**|**관리자 (강사)**|담당 클래스(임베디드/웹툰 등) 관리, 출석 수동 처리, 커리큘럼 해금.|
|**Tier 3-A**|**정회원 (수강생)**|게시판 이용, 수강 중인 강좌 자료 접근, 프로젝트 생성.|
|**Tier 3-B**|**학부모**|**자녀 정보 조회 전용.** (출석 여부, 진도율 확인).|
|**Tier 3-C**|**명예회원**|수료생/졸업생 커뮤니티 이용 (강좌 접근 불가).|
|**Tier 4**|**비정규회원**|가입 직후 상태. 제한적 읽기/쓰기.|
|**Tier 5**|**게스트**|로그인 전. 학원 소개, 커리큘럼 안내, 오시는 길 열람 가능.|

## 4. 핵심 기능 및 UI 상세 기획

### 4.1. 초기 접속 및 대시보드

- **공통:** 학원 로고(Coding Maker)와 브랜드 컬러(신뢰감을 주는 블루/화이트) 적용.
    
- **정보 위젯 (Dynamic Info):**
    
    - **학원 정보 카드:** 운영 시간, 연락처, 공지사항 등을 **DB에서 불러와 표시**. (관리자가 언제든 수정 가능)
        
    - **바로가기:** 공식 블로그(Naver), 인스타그램 링크 버튼.
        
- **개인화:** 학부모 로그인 시 "자녀가 현재 학원에 있습니다/하원했습니다" 상태가 최상단 노출.
    

### 4.2. 클래스 & 코드 뷰어 (LMS)

- **동적 커리큘럼 관리 (Dynamic Curriculum):**
    
    - 고정된 카테고리가 아닌, **관리자가 생성/수정/삭제 가능한 구조**로 변경.
        
    - **기본 구성(초기 세팅):**
        
        1. **코딩/임베디드:** C언어, 회로이론, 임베디드 시스템.
            
        2. **창작 메이커:** 웹툰, 3D 모델링, 스케치업.
            
        3. **자격증 특강:** 컴활 2급 실기.
            
    - **수정 기능:** 트렌드 변화에 따라 'AI 활용반', '유니티 게임반' 등을 관리자 페이지에서 즉시 추가 가능.
        
- **기능:**
    
    - **Time-Lock:** 주차별/회차별 커리큘럼 잠금 해제.
        
    - **Monaco Editor:** C언어/파이썬 소스코드 웹에서 바로 보기.
        

### 4.3. 프로젝트 관리 (Project Space)

- **목적:** 장기 과정(24개월 이상) 수강생들의 포트폴리오 관리.
    
- **기능:** Git 스타일의 진행 상황 공유, 팀원 모집, 작품 전시관(웹툰/3D 모델링 뷰어).
    

### 4.4. 출석 시스템 (Attendance Kiosk)

- **전용 페이지:** `/kiosk` (전체 화면).
    
- **입력 방식:** `이름#태그` (예: `홍길동#1234`).
    
- **로직:** 출석 체크 즉시 **"홍길동님 출석! (14:30)"** 음성 안내 및 학부모 계정으로 알림 전송.
    

### 4.5. 커뮤니티 & 채팅

- **1:1 문의:** 카카오톡 UI 스타일. 수강 문의 및 강사 질의응답.
    
    - _보안:_ 모든 대화 내용은 **AES-256 암호화**되어 저장됨.
        
- **게시판:** 수강 후기, 공지사항, 자료실.
    

## 5. 데이터베이스 스키마 설계 가이드 (Prisma Schema)

```
// 1. User Model
model User {
  id            String    @id @default(uuid())
  username      String    @unique
  password      String    // bcrypt hash (Salt included)
  
  // 암호화 필수 필드 (Encrypted Fields with Random IV)
  name          String    // AES-256 Encrypted (Format: iv:ciphertext)
  phone         String?   // AES-256 Encrypted
  address       String?   // AES-256 Encrypted
  
  tag           String    // 출석 태그 (#1234)
  tier          Int       // 1~5
  role          String    // ADMIN, TEACHER, STUDENT, PARENT
  parentId      String?   // 학부모-자녀 연결
  
  createdAt     DateTime  @default(now())
  attendance    Attendance[]
  posts         Post[]
  chatRooms     ChatRoomMember[]
  messages      Message[]
}

// 2. Attendance Model
model Attendance {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  date      DateTime @default(now())
  status    String   // ATTENDED, LATE, ABSENT
}

// 3. Course/Class Model (학원 커리큘럼 - Dynamic)
model Course {
  id          String   @id @default(uuid())
  title       String   // 예: "임베디드 전문가 과정" (수정 가능)
  category    String   // CODING, MAKER, CERTIFICATION (수정 가능)
  description String?  // 상세 설명 (HTML/Markdown)
  instructor  String?  // 담당 강사명
  schedule    String?  // "월수금 14:00"
  isActive    Boolean  @default(true) // 폐강 여부 관리
  createdAt   DateTime @default(now())
}

// 4. Academy Info (사이트 설정 - Dynamic Content)
model AcademyInfo {
  key         String   @id // e.g., "INFO_PHONE", "INFO_ADDRESS", "HERO_MESSAGE"
  value       String   // "061-745-3355", "전남 광양시..."
  updatedAt   DateTime @updatedAt
}
```

## 6. 사이트 관리 및 통계

### 6.1. 관리 기능

- **콘텐츠 관리 시스템 (CMS):** (⭐추가됨)
    
    - 최고 관리자(Tier 1) 전용 메뉴.
        
    - 학원 소개 문구, 연락처, 배너 이미지, Footer 정보 등을 Form 입력으로 수정하여 `AcademyInfo` 테이블에 반영.
        
- **대량 등록:** 엑셀 파일(CSV)로 학생 계정 일괄 생성 기능 구현.
    
- **감사 로그(Audit Log):** 관리자가 데이터를 수정/삭제할 경우 누가, 언제, 무엇을 했는지 별도 테이블에 기록.
    

### 6.2. 데이터 분석 (Visualization)

- **기술:** `Recharts` 라이브러리 사용.
    
- **시각화 대상:** 일별 출석률 추이(선 그래프), 클래스별 과제 제출율(막대 그래프), 시간대별 접속자 히트맵.
    

## 7. UI/UX 및 디자인 가이드 (템플릿 활용)

- **디자인 원칙:**
    
    - 제공된 **[PC/Mobile UI 템플릿]**을 최우선 적용.
        
    - **Color Palette:** 학원 로고와 어울리는 Tech Blue & Creative Orange 포인트 컬러 사용.
        
- **Footer 정보 반영 (Dynamic):**
    
    - 하드코딩하지 말고, **DB(`AcademyInfo`)에서 값을 불러와 렌더링**하도록 구현. (DB 연결 실패 시 기본 하드코딩 값 사용)
        

# [별첨] Gemini CLI 개발 지시서 (Development Prompt)

_이 섹션은 AI 개발 에이전트에게 이 프로젝트를 실제로 구현하도록 명령하기 위한 상세 지시서입니다._

```
# ROLE definition
당신은 보안 전문가이자 풀스택 웹 개발자입니다. 당신의 임무는 'Coding Maker Project Plan'에 따라 학원 관리 시스템을 구축하는 것입니다.
특히 **개인정보 보호(암호화)**, **실제 학원 정보 반영**, 그리고 **관리자의 수정 권한(CMS)** 구현이 핵심입니다.

# CRITICAL INSTRUCTIONS (Must Follow)

## 1. Security Implementation (보안/암호화 필수)
- **AES-256 Encryption with Random IV:** `src/lib/crypto.ts`를 구현하여 민감 정보(이름, 전화번호, 주소, 채팅)를 암호화하세요.
    - 중요: 암호화 시마다 `crypto.randomBytes(16)`으로 **새로운 IV**를 생성하고, DB에는 `iv:ciphertext` 포맷으로 저장하여 복호화 시 사용해야 합니다. (고정 IV 사용 금지)
- **Key Management:** 암호화 키는 `.env`에서 관리하세요.

## 2. Dynamic Content Management (CMS 구현)
- **AcademyInfo Model:** 학원 이름, 주소, 연락처, 운영시간 등은 하드코딩하지 말고 DB(`AcademyInfo` 테이블)에서 불러오세요.
- **Fallback Data:** 단, DB가 비어있을 경우를 대비해 `constants/academy.ts`에 '광양 코딩메이커학원'의 실제 정보를 상수로 정의하고 초기값(Seed)으로 사용하세요.
- **Admin Editor:** 최고 관리자(Tier 1)가 대시보드에서 이 정보들과 커리큘럼(Course)을 직접 수정할 수 있는 Form UI를 제공하세요.

## 3. UI & Layout (템플릿 기반)
- 제공된 UI 템플릿 코드를 모듈화하여 사용하세요.
- **PC:** 사이드바 네비게이션 / **Mobile:** 하단 탭바 구조.
- **Chat UI:** 카카오톡 스타일(말풍선, 시간 표시, 읽음 확인) 필수.

## 4. Database Setup
- **Dual DB:** 개발(`sqlite`) / 운영(`mysql`) 호환성을 준수하세요.
- **Initial Seed (`scripts/seed.ts`):**
    - 관리자 계정 생성.
    - `AcademyInfo` 테이블에 학원 실제 정보(연락처, 주소 등) Insert.
    - `Course` 테이블에 기본 3개 과정(코딩/메이커/특강) Insert.

## 5. Feature Logic
- **Kiosk Mode:** `/kiosk` 페이지는 UI 쉘 없이 전체 화면으로 구현.
- **Audit Log:** 데이터 변경 이력을 남기세요.

# OUTPUT GOAL
위 명세와 보안 수칙을 준수하여, 트렌드 변화에 유연하게 대처 가능한 안전한 Next.js 애플리케이션 코드를 작성하세요.
```