# GRE 프론트엔드 작업 지침

이 파일은 `gre-frontend/`에 적용한다. GRE는 해외 직구 환불을 돕는 AI 에이전트 서비스다. 프론트엔드는 Next.js App Router, React 19, JavaScript, Tailwind CSS 4, npm을 사용한다.

## 작업 시작

- `README.md`에서 실행 방법과 디렉터리 구조를 확인한다.
- 코드 작성·리뷰 또는 커밋·PR 초안 작성 전 [GRE 코드 컨벤션 스킬](.agents/skills/gre-code-conventions/SKILL.md)을 읽고 작업에 해당하는 규칙을 적용한다.
- Next.js API나 파일 규칙을 변경할 때는 설치 버전에 맞는 `node_modules/next/dist/docs/` 문서를 확인한다.

## 파일 배치와 구현

- `app/`은 라우팅과 페이지 조립을 담당한다. 기능 전용 UI, 상태, API는 `features/<feature>/`에 두고 공통 HTTP 처리는 `lib/api/`에 둔다.
- 여러 기능이 공유하는 코드만 공통 디렉터리에 둔다. 공통 코드가 기능 모듈을 참조하거나 순환 import가 생기지 않게 한다. 같은 폴더 안에서는 상대 경로를, 폴더 간에는 `@/`를 사용한다.
- Server Component를 기본으로 사용한다. 상태, 이벤트, 브라우저 API가 필요한 가장 작은 경계에만 `'use client'`를 선언한다.
- 컴포넌트 파일은 PascalCase, 일반 모듈은 camelCase, Hook은 `use` 접두사를 사용한다. `page.js`와 `layout.js` 등 Next.js 예약 이름을 따른다.
- 요청한 기능에 필요한 파일과 디렉터리만 추가한다. TypeScript 전환이나 의존성 변경은 작업 요구사항에 포함된 경우에 진행한다.

## 환경 변수

- 로컬 설정은 프론트엔드 루트의 `.env.local`에 둔다. 공유할 키와 용도는 값 없이 `.env.example`과 README에 적는다.
- `API_BASE_URL`은 Next.js 서버 전용이다. 브라우저에서 직접 요청할 때만 `NEXT_PUBLIC_API_BASE_URL`을 설정한다. `NEXT_PUBLIC_*` 값은 빌드 시 공개되므로 비밀 값을 넣지 않는다.
- 현재 실행과 CI 빌드는 API 환경 변수 없이 동작한다. 실제 연동으로 필수 값이 생기면 README와 CI 설정을 함께 검토한다.

## 검증

- 프론트엔드 코드를 변경하면 `npm run lint`와 `npm run build`를 실행한다. 관련 동작을 확인하고 실제로 수행한 검증과 남은 제약을 보고한다.
