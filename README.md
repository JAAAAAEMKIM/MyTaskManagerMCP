# 담당 업무 MCP

이 프로젝트는 Dooray의 담당 업무 현황을 파악하기 위한 Model Context Protocol(MCP) 서버입니다.

## 프로젝트 구조

이 프로젝트는 다음과 같은 구조로 구성되어 있습니다:

- `server/`: MCP 서버 코드
- `dashboard/`: 대시보드 프론트엔드 코드
- `dashboards/`: 생성된 대시보드 HTML 파일 저장 디렉토리

## 설치 및 실행

### 모든 패키지 설치

```bash
npm run install:all
```

### 개발 모드 실행

```bash
# 대시보드와 서버를 동시에 개발 모드로 실행
npm run dev

# 대시보드만 개발 모드로 실행
npm run dev:dashboard

# 서버만 개발 모드로 실행
npm run dev:server
```

### 빌드 및 실행

```bash
# 전체 프로젝트 빌드 (대시보드 & 서버)
npm run build

# 서버 실행
npm run start
```

## MCP 도구

이 서버는 다음 MCP 도구를 제공합니다:

- `get-my-tasks`: 모든 담당 업무 조회
- `get-working-tasks`: 진행 중인 담당 업무만 조회
- `get-backlog-tasks`: 대기 중인 담당 업무만 조회

## 개발 방법

### 대시보드 개발

대시보드는 React 컴포넌트로 구성되어 있으며, Vite를 사용하여 빌드됩니다.
대시보드 코드는 `dashboard/` 디렉토리에 있습니다.

```bash
cd dashboard
npm run dev # 개발 서버 실행
npm run build # 빌드
```

### 서버 개발

서버는 TypeScript로 작성되었으며, MCP SDK를 사용합니다.
서버 코드는 `server/` 디렉토리에 있습니다.

```bash
cd server
npm run dev # 개발 모드로 실행
npm run build # 빌드
npm run start # 빌드된 서버 실행
```

## 설정

`server/src/config/config.ts` 파일에서 다음 상수들을 수정하여 설정을 변경할 수 있습니다:

- `DOORAY_API_BASE`: Dooray API의 기본 URL
- `USER_ID`: 사용자 ID