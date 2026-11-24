---
name: gre-code-conventions
description: Apply GRE conventions when implementing or reviewing frontend JavaScript, React state, API calls, Tailwind styles, formatting, or drafting GRE commits and pull requests.
---

# GRE 코드 컨벤션

변경 대상에 해당하는 규칙을 적용하고 기존 파일의 동작을 보존한다. 프로젝트 구조와 현재 실행 명령은 루트 README를 참고한다.

## React와 네이밍

- JS/JSX와 App Router를 사용한다. Next.js 예약 파일은 `page.js`, `layout.js` 등 소문자 이름을 유지한다. `app/`에서 화면을 조립하고 업무 코드는 `features/<feature>/`에 둔다.
- 영어 식별자를 사용한다. 컴포넌트·클래스·Context·Provider는 PascalCase, 변수·함수·일반 파일은 camelCase, 상수는 UPPER_SNAKE_CASE를 사용한다. Hook은 `use`, 이벤트 함수는 `handle`, 콜백 prop은 `on`, 불리언은 의미에 따라 `is`, `has`, `can`으로 시작한다. API 필드는 합의된 계약을 우선한다.
- Server Component를 기본으로 두고 상태·이벤트·브라우저 API가 필요한 경계에 `'use client'`를 선언한다. 전역 공유가 필요한 경우에만 `contexts/`와 `providers/`를 사용하고 가장 가까운 레이아웃에 Provider를 배치한다. 전용 Hook을 통해 Context에 접근한다.
- 상태는 가까운 범위에 둔다. 단순 상태는 useState, 관련 전환이 복잡할 때는 useReducer, 공유가 필요한 형제 상태는 공통 부모, 필터·페이지처럼 URL로 표현할 값은 경로·검색 파라미터를 사용한다. 파생 값은 렌더링 중 계산하고 객체·배열은 불변 갱신한다.
- Hook은 최상위에서 호출한다. Effect는 외부 시스템 동기화에 사용하고 사용자 행동은 이벤트 핸들러에서 처리한다. 반응형 의존성을 포함하고 타이머·구독·요청을 정리한다. 메모이제이션은 비용 또는 참조 안정성이 필요한 곳에 적용하며 ref는 렌더링에 영향을 주지 않는 값이나 DOM 참조에 사용한다.

## API와 스타일

- API 요청은 기능별 API 모듈에 모으고 공통 전송·오류 처리는 `lib/api/`에 둔다. 일반 REST 연동에는 문서가 지정한 Axios와 전용 Hook을 사용한다. 현재 초기 fetch 클라이언트에서 전환은 실제 API 연동 범위에서 진행한다. 이메일 초안 메시지 NDJSON 스트림은 fetch와 ReadableStream을 사용한다.
- 서버 응답을 기준으로 상태를 판단하고 변경 후 최신 데이터를 조회한다. HTTP 오류와 HTTP 200으로 반환된 Run 실패를 구분한다. Run은 대기·진행 중에 REST 폴링하고 종료·이탈 시 정리한다. Gmail 발송은 명시적 승인과 revision을 요구하며 응답이 불명확하면 상태를 조회한다. 발송·승인 등 부작용이 있는 요청은 자동 재시도하지 않는다.
- 오류를 공통 형식으로 정규화하고 화면에서 안전한 메시지와 필드 오류를 표시한다. revision 충돌은 최신 초안 재조회와 재승인, Gmail 연결 오류는 재연결 안내로 처리한다. 비밀값과 서버 내부 오류를 브라우저 저장소·화면·로그에 노출하지 않는다.
- Tailwind v4 유틸리티를 기본으로 사용한다. 공통 토큰은 확정된 Figma 값으로 `app/globals.css`의 `@theme`에 정의한다. 반복 UI는 `components/ui/`에 모으고 범위가 제한된 CSS는 유틸리티로 표현하기 어려울 때 사용한다.

## 포맷과 협업

- UTF-8, LF, 끝 줄바꿈, 공백 2칸을 적용한다. JS는 작은따옴표, 세미콜론, 가능한 위치의 후행 쉼표, 줄 너비 100을 기준으로 한다. 팀 표준 자동화는 Prettier와 Tailwind 클래스 정렬 플러그인이다. 구성된 경우 `npm run format:check`를 실행하고 프론트 코드 변경은 ESLint·빌드·관련 테스트로 확인한다. 결과는 실제 실행한 것만 기록한다.
- 기능 브랜치는 최신 `dev`에서 `feature/<kebab-case>`로 분기하고 PR을 `dev`로 보낸다. 통합 검사·검토 후 `dev`에서 `main`으로 PR을 보낸다. 보호 브랜치에 직접 커밋·푸시하지 않는다.
- 커밋은 논리적 변경 단위로 `type(scope): 작업 요약` 형식을 사용한다. 복잡한 변경은 본문에 목적·세부 변경·영향 범위를 기록한다. 포맷 전용 변경은 가능하면 `style`로 분리한다.
- PR 제목은 `[type] 작업 요약`으로 작성하고 본문에 목적·변경 사항·단위/통합 검사 결과·관련 Jira 이슈·추가 검토 사항을 담는다. 관련 담당자를 리뷰어로 지정하고, 기능 브랜치는 테스트·검토·병합이 끝난 뒤 정리한다.

[GRE 코드 컨벤션 원문](https://app.notion.com/p/41bf138a337181b9a1ccfeaf14c509c7)
