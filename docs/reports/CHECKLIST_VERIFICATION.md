# 코딩메이커 학원 통합 시스템 - 요구사항 검증 메모

본 문서는 제공된 최종 구현 검증 체크리스트를 코드 레벨로 대조한 결과입니다. (2025-11-24)

## 1. 관리자(Admin) 핵심 기능 및 CMS
- **강좌 생성/저장:** 관리자 화면과 API 모두 `title/category/description/instructor/schedule`만 처리하며 수강료, 총 수업 시간, 썸네일 필드는 없음. 저장도 `Course` 테이블에 위 필드만 기록함.【F:src/app/admin/classes/page.tsx†L23-L151】【F:backend/prisma/schema.prisma†L173-L186】
- **커리큘럼 구조/정렬:** Prisma 스키마에 Section/Lesson/Drip 관련 모델이나 unlockDay 필드가 없어 트리 구조·순서 변경·드립 콘텐츠 기능이 부재함.【F:backend/prisma/schema.prisma†L173-L186】
- **학원 정보 CMS:** `/api/academy`에서 key-value 업데이트를 upsert로 저장하고, 프런트는 런타임 API 호출로 주소/전화/배너 등을 불러오므로 서버 재시작 없이 반영된다. 실시간 푸시는 없음.【F:backend/src/controllers/academy.controller.ts†L5-L62】【F:src/app/location/page.tsx†L3-L105】
- **사용자 일괄 등록(엑셀):** 사용자 라우트는 CRUD만 제공하며 엑셀 업로드 엔드포인트나 파서가 존재하지 않아 미구현 상태.【F:backend/src/app.ts†L42-L51】【F:backend/src/routes/user.routes.ts†L8-L19】
- **비밀번호 해싱/개인정보 암호화:** 회원 등록 시 bcrypt 해시와 AES-256-CBC 암호화를 모두 적용한다.【F:backend/src/services/auth.service.ts†L71-L90】【F:backend/src/services/crypto.service.ts†L3-L50】

## 2. 학생/학부모 기능
- **프로젝트/포트폴리오 업로드 & 강사 피드백:** 백엔드 라우트 목록과 학생 대시보드 모두 과제/파일 업로드나 피드백 흐름이 없어 체크리스트 기능이 제공되지 않는다.【F:backend/src/app.ts†L42-L51】【F:src/app/student/page.tsx†L15-L106】
- **실시간 채팅:** Socket.io와 메시지 저장 API는 존재하고, DM일 때만 콘텐츠가 암호화되어 저장된다. 그룹 채팅은 평문 저장이라 “DB에서 내용 식별 불가” 요구와 부분 불일치.【F:backend/src/controllers/chat.controller.ts†L342-L401】

## 3. 스마트 출석(키오스크)
- **태그 입력/상태 토글:** 같은 날 첫 태그는 등원(PRESENT), 두 번째는 하원으로 토글하는 로직만 존재한다.【F:backend/src/controllers/attendance.controller.ts†L6-L88】
- **Debounce 및 학부모 실시간 알림:** 키오스크 입력에 대한 디바운스나 출석 시 자동 Socket.io 알림 발송이 구현돼 있지 않다(수동 `attendance:notify` 이벤트만 존재).【F:src/app/kiosk/page.tsx†L7-L115】【F:backend/src/socket/index.ts†L10-L70】

## 4. 시스템 아키텍처 및 보안
- **커스텀 단일 포트 서버:** Next.js는 기본 `next dev/start` 스크립트를 사용하고, 실시간/REST는 별도 Express 서버(기본 3001포트)로 구동되어 단일 포트 통합 요건을 충족하지 않는다.【F:package.json†L5-L23】【F:backend/src/server.ts†L1-L29】
- **이중 DB 구성:** Prisma datasource가 고정 `sqlite`이며 MySQL 전환용 스크립트/환경 분기 로직이 없다.【F:backend/prisma/schema.prisma†L1-L8】
- **개인정보 암호화:** AES-256-CBC(랜덤 IV)로 필드를 암호화/복호화하는 유틸이 존재해 PII 보호 요구사항은 충족한다.【F:backend/src/services/crypto.service.ts†L3-L50】

## 5. 배포/안정성
- **프로덕션 빌드 & HTTPS/WSS 검증:** 코드상 빌드 스크립트는 존재하지만 배포 환경(SSL/WSS) 및 `npm run build && npm start` 실행 결과는 레포 내에서 확인할 수 없다. 검증 필요.

### 요약
- 기본 CMS/출석/채팅/암호화 토대는 구현되어 있으나, 체크리스트의 세부 기능(커리큘럼 트리·드립콘텐츠·파일 업로드·학부모 실시간 알림·단일포트 서버·이중 DB·메시지 전면 암호화 등)이 다수 미구현 상태입니다.
