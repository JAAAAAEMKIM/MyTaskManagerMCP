# 담당 업무 MCP

이 프로젝트는 Dooray의 담당 업무 현황을 파악하기 위한 Model Context Protocol(MCP) 서버입니다.

## 기능

- 모든 담당 업무 조회
- 진행 중인 담당 업무만 조회
- 대기 중인 담당 업무만 조회

## 사용 방법

1. 프로젝트 빌드:
```bash
npm run build
```

2. 서버 실행:
```bash
npm start
```

## MCP 도구

이 서버는 다음 MCP 도구를 제공합니다:

- `get-my-tasks`: 모든 담당 업무 조회
- `get-working-tasks`: 진행 중인 담당 업무만 조회
- `get-backlog-tasks`: 대기 중인 담당 업무만 조회

## 설정

`src/index.ts` 파일에서 다음 상수들을 수정하여 설정을 변경할 수 있습니다:

- `DOORAY_API_BASE`: Dooray API의 기본 URL
- `USER_ID`: 사용자 ID