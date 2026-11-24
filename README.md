# GRE Frontend

Next.js App Router 기반 프론트엔드 공통 개발 기반이다. 기본 페이지는 실행 확인용으로 유지한다.

## 실행 및 검증

설치 버전: Next.js 16.4.6, React/React DOM 19.3.0, Tailwind CSS 4.3.3, ESLint 9 계열. Node.js 20.9 이상과 npm을 사용한다. 현재 검증 환경은 Node.js 24이다. 의존성 버전은 lockfile을 기준으로 유지한다.

```bash
npm ci
npm run dev
```

개발 서버 기본 주소는 `http://localhost:3000`이다. 환경 변수가 필요하면 루트의 `.env.example`을 `.env.local`로 복사한다. 현재 기본 페이지에는 환경 변수가 필요 없다.

PowerShell에서 로컬 환경 파일을 처음 만들 때는 프론트엔드 디렉터리에서 실행한다.

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

```bash
npm run lint
npm run build
npm run start
```

`start`는 빌드 후 프로덕션 서버를 실행한다. 빌드와 ESLint는 별도 실행한다. 기존 `next/font/google`의 Geist 폰트는 빌드 시 다운로드에 네트워크 연결이 필요할 수 있다.

GitHub Actions의 `GRE Frontend CI`는 `dev`·`main` 대상 PR과 해당 브랜치 push에서 실행된다. 프론트엔드 저장소의 `.github/workflows/gre-frontend-ci.yml`이 Node.js 24로 `npm ci`, `npm run lint`, `npm run build`를 실행한다. 현재 CI에 필요한 API 주소나 GitHub Secret은 없다.

## 현재 구조

```text
app/
├── favicon.ico
├── globals.css
├── layout.js
└── page.js
lib/
└── api/
    ├── httpClient.js
    └── httpError.js
```

아래 경로는 첫 실제 구현이 필요할 때 생성한다. 빈 폴더 유지를 위한 파일은 만들지 않는다.

| 경로 | 책임 |
| --- | --- |
| `app/` | 라우팅, 메타데이터, 페이지 조립 및 레이아웃. 비즈니스 로직은 기능 모듈로 분리 |
| `components/ui/` | 도메인에 의존하지 않는 범용 UI |
| `components/layout/` | 공통 화면 배치 |
| `features/<feature>/` | 기능 전용 컴포넌트, Hook, API 및 로직. 필요한 하위 폴더만 생성 |
| `hooks/` | 기능에 종속되지 않는 공통 Custom Hook |
| `contexts/` | 실제 전역 공유 요구가 생겼을 때 Context 및 Provider |
| `providers/` | 필요한 레이아웃에서 사용하는 Client Provider 조합 |
| `lib/api/` | HTTP 전송 및 공통 HTTP 오류 타입 |
| `lib/utils/` | 범용 유틸리티 함수 |
| `constants/` | 여러 기능에서 공유하는 상수 |
| `styles/` | `app/globals.css` 외 필요한 공통 스타일 |
| `config/` | 공통 앱 설정. 서버 전용 설정은 클라이언트 모듈과 분리 |

## 아키텍처 원칙

- `app`은 기능 모듈과 공통 코드를 조립한다. 복잡한 상태 관리와 비즈니스 로직을 페이지에 작성하지 않는다.
- 기능 모듈은 공통 코드에 의존할 수 있지만 공통 코드는 `features`나 `app`에 의존하지 않는다. 다른 기능의 내부 파일을 직접 import하지 않는다.
- 실제 공유 책임만 공통으로 추출한다. 순환 참조와 무분별한 `index.js` 재내보내기를 피한다.
- Server Component가 기본이다. 이벤트, 상태 Hook, 브라우저 API가 필요한 작은 경계에만 `"use client"`를 선언한다. 루트 레이아웃 전체를 Client Component로 바꾸지 않는다.
- 클라이언트 모듈이 import하는 코드는 클라이언트 영역에 포함될 수 있다. 서버 전용 설정과 비밀 값이 있는 모듈을 import하지 않는다.
- Route Group은 실제 레이아웃 분리가 필요한 시점에 도입한다.
- 로컬 React Hooks부터 사용하고 필요하면 상태를 상위로 올린다. 실제 전역 공유 요구가 생기면 Context를 도입한다. 빈 Provider나 추가 상태 관리 라이브러리는 만들지 않는다.

## API 및 환경 설정

- `httpClient(input, options)`는 네이티브 `fetch`를 호출하고 성공한 `Response`를 반환한다. URL이나 환경 변수를 자동 결합하지 않는다.
- 비성공 HTTP 응답은 `HttpError`로 전달한다. `status`와 원본 `response`로 오류 본문을 확인할 수 있다. 네트워크 및 요청 취소 오류는 원본 그대로 전달한다.
- 향후 `features/<feature>/api/`의 API 모듈이 주소 구성, 요청 직렬화, 응답 해석을 담당한다. JSON, 빈 응답(204), 텍스트, 파일은 각 API 계약에 맞춰 해석한다.
- 화면 또는 기능 Hook은 사용자에게 표시할 오류와 재시도를 결정한다. 공통 클라이언트에서 알림이나 화면 이동을 실행하지 않는다.
- `headers`, `signal`, `cache`, Next.js의 `next` 등 fetch 옵션은 그대로 전달한다. 인증, 캐시 및 재시도 정책을 미리 강제하지 않는다.
- 실제 API 주소, 엔드포인트, 인증 인터셉터 및 비즈니스 API는 아직 없다. 공통 클라이언트는 현재 페이지에서 호출하지 않는다.
- 환경 파일은 프로젝트 루트에 둔다. `.env.local` 등은 Git에 커밋하지 않고 `.env.example`에 빈 설정 항목만 공유한다.
- `API_BASE_URL`은 서버 전용으로 사용할 예정이다. 브라우저 직접 통신이 필요할 때만 공개 주소인 `NEXT_PUBLIC_API_BASE_URL`을 사용한다. 두 값은 현재 코드에서 읽지 않는다.
- `NEXT_PUBLIC_*`는 빌드 시 브라우저 번들에 포함된다. 비밀 값을 넣지 않으며 값 변경 시 재빌드한다. 서버 전용 변수는 클라이언트 props나 응답으로 전달하지 않는다.
- 별도 Spring Boot 서버의 CORS 및 인증 정책은 실제 연동 단계에서 함께 결정한다.

## 코드 컨벤션 및 협업

- JavaScript만 사용한다. 컴포넌트는 `UserCard.js`처럼 PascalCase, Hook은 `useFilter.js`처럼 use 접두사와 camelCase, 일반 모듈은 `httpClient.js`처럼 camelCase를 사용한다.
- 폴더는 소문자 kebab-case, 상수 식별자는 `UPPER_SNAKE_CASE`를 사용한다. Next.js 예약 파일 `page.js`, `layout.js`, `route.js` 등은 프레임워크 규칙을 따른다.
- 컴포넌트는 단일 책임을 갖는다. 컴포넌트는 default export, 일반 함수·Hook·상수는 named export를 기본으로 한다. Next.js 예약 export는 유지한다.
- 동일 폴더 내부는 상대 경로, 다른 폴더는 `@/` alias로 명시적 파일을 import한다. `@/*`는 프로젝트 루트 기준 경로에 대응한다. import는 외부 패키지 → 내부 alias → 상대 경로 순서로 구분한다.
- 신규 및 변경 코드는 작은따옴표, 세미콜론, 후행 쉼표, 줄 너비 100을 기준으로 한다. 인코딩과 들여쓰기는 `.editorconfig`를 따른다. 현재 정적 검사는 Next.js Core Web Vitals ESLint 구성을 사용한다.
- 프론트 코드와 Git 협업 세부 규칙은 [GRE 코드 컨벤션 스킬](.agents/skills/gre-code-conventions/SKILL.md)을 따른다. Prettier와 Tailwind 클래스 자동 정렬은 팀 표준이며 현재 프로젝트에 도입 예정인 항목이다.
- Tailwind CSS 4의 `@import "tailwindcss"`와 기존 Turbopack 설정을 유지한다. v3용 설정이나 구체적인 디자인 토큰을 미리 만들지 않는다.
- 각 개발자는 담당 기능 경로에서 작업한다. 기능 내부에서만 쓰는 코드는 공통 폴더로 올리지 않는다. 루트 레이아웃, 전역 CSS, 공통 설정과 lockfile 변경은 필요한 범위로 제한하고 팀과 조율한다.
- 새 기능의 컴포넌트는 `features/<feature>/components/`, 전용 Hook은 `features/<feature>/hooks/`, API는 `features/<feature>/api/`에 두고 `app/<route>/page.js`에서 조립한다. 실제 여러 기능이 공유하는 코드만 공통 경로로 이동한다.
- 변경 후 `npm run lint`와 `npm run build`를 실행하고 변경 경로의 동작을 확인한다. 과도한 추상화, 미사용 컴포넌트, Mock Data, 더미 화면과 불필요한 패키지를 추가하지 않는다.
