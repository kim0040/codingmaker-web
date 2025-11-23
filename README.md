# 🎓 코딩메이커 아카데미 통합 관리 시스템

> **광양 코딩메이커학원**의 학생, 강사, 학부모를 위한 올인원 웹 플랫폼

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-Private-red)

---

## 📋 프로젝트 소개
- 임베디드/코딩, 웹툰/창작, 자격증 반으로 구성된 **코딩메이커 아카데미** 학습·소통 허브
- 학생/학부모/관리자 티어에 따라 맞춤형 대시보드와 LMS, 커뮤니티, 키오스크를 제공
- 프론트엔드는 완성된 상태이며, API 연동 및 실시간 기능을 위한 백엔드 연결을 기다리고 있습니다.

### 🎯 주요 기능
- 🔐 티어별 권한 시스템 (Tier 1~5)
- 📚 LMS 강의실 (Monaco Editor 통합)
- ✅ 터치 최적화 키오스크 출석 체크
- 👨‍👩‍👧 학부모 대시보드 (실시간 자녀 정보 확인)
- 💬 커뮤니티 & 프로젝트 협업 공간
- 📊 관리자용 데이터 분석 대시보드
- 🎨 시스템 테마 연동(라이트/다크)

---

## 🛠️ 기술 스택
| 영역 | 사용 기술 |
| --- | --- |
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, tailwind-merge, tailwindcss-animate |
| Theme | next-themes |
| Editor | @monaco-editor/react |
| Icons | Material Symbols Outlined, Lucide React |
| Realtime (예정) | Socket.io 클라이언트 |
| Auth/보안 (예정) | JWT, AES-256, Prisma(MySQL/SQLite) |

---

## 📂 주요 폴더 구조
```
codingmaker-web/
├── src/
│   ├── app/                 # Next.js 페이지 (App Router)
│   ├── components/          # UI 및 레이아웃 컴포넌트
│   ├── contexts/            # AuthContext 등 전역 상태
│   ├── data/                # Mock 데이터
│   ├── hooks/               # 커스텀 훅
│   └── lib/                 # API/소켓 등 유틸
├── public/                  # 정적 자산
├── docs/                    # 가이드, 리포트, 레퍼런스 문서
└── package.json
```
자세한 문서 인덱스: [docs/README.md](./docs/README.md)

---

## 🧭 개발 환경 & 실행 가이드
### 필수 요구사항
- Node.js 18+ (LTS 권장), npm 9+ 또는 10+
- Git, 브라우저(Chrome/Edge 최신)

### OS별 Node.js 설치
- **macOS**: `brew install nvm` → `nvm install --lts` → `nvm use --lts`
- **Ubuntu**: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash` → `nvm install --lts`
- **Windows**: [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) 설치 후 PowerShell에서 `nvm install lts`, `nvm use lts`

### 빠른 시작 (공통)
```bash
git clone <repository-url>
cd codingmaker-web
npm install
npm run dev
```
- 개발 서버: http://localhost:3000
- 환경 변수: [docs/guides/ENV_SETUP.md](./docs/guides/ENV_SETUP.md) 참고 (API URL, 암호화 키 등)

### 주요 스크립트
- `npm run dev` : 개발 서버 실행
- `npm run lint` : ESLint 검사
- `npm run build` : 프로덕션 빌드
- `npm run start` : 빌드 결과 실행

### 테스트 & 품질 점검
- 수동 동작 확인: 주요 페이지 라우팅, 테마 전환, 반응형, 키오스크 입력, 사이드바/버튼 인터랙션
- 정적 분석: `npm run lint`
- 통합/최종 테스트 절차는 [docs/guides/INTEGRATION_TEST_GUIDE.md](./docs/guides/INTEGRATION_TEST_GUIDE.md), [docs/guides/FINAL_TEST_GUIDE.md](./docs/guides/FINAL_TEST_GUIDE.md) 참고

---

## 🚀 빌드 & 배포
### Vercel (권장)
```bash
npm install -g vercel
vercel deploy --prod
```
- Vercel에서 환경 변수(NEXT_PUBLIC_API_URL 등) 설정 후 배포

### 커스텀 서버 배포 (Ubuntu 예시)
```bash
npm install
npm run build
npm install -g pm2
pm2 start "npm run start" --name codingmaker-web
pm2 save && pm2 startup
```
- 방화벽(ufw)에서 3000 포트 허용 또는 Nginx 리버스 프록시 설정

### Windows 서버 배포
```powershell
npm install
npm run build
npm run start # 혹은 nssm/pm2-windows-service 등으로 서비스 등록
```

배포 전 체크리스트는 [docs/guides/DEPLOYMENT_CHECKLIST.md](./docs/guides/DEPLOYMENT_CHECKLIST.md)를, 보안/권한 검증은 [docs/archive/SECURITY_CHECKLIST.md](./docs/archive/SECURITY_CHECKLIST.md)와 [docs/reports/TIER_AND_ACADEMY_VERIFICATION.md](./docs/reports/TIER_AND_ACADEMY_VERIFICATION.md)를 참조하세요.

---

## 📄 문서 모음
- 최신 문서 인덱스: [docs/README.md](./docs/README.md)
- 환경 설정/배포/테스트 가이드: [docs/guides](./docs/guides)
- 완료/검증 리포트: [docs/reports](./docs/reports)
- 요구사항·도메인 자료: [docs/reference](./docs/reference)
- 이전 설계안 및 기록: [docs/archive](./docs/archive/README.md)

---

## 📞 문의
백엔드 통합 및 배포 관련 문의는 [docs/guides/ENV_SETUP.md](./docs/guides/ENV_SETUP.md)와 [docs/guides/DEPLOYMENT_CHECKLIST.md](./docs/guides/DEPLOYMENT_CHECKLIST.md)의 설정 값을 기준으로 진행해주세요.
