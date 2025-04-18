# MyTaskManagerMCP

Claude에 연동하여 개인 업무 비서로 사용할 수 있는 MCP

## Vibe Coded 🤖

Copilot Agent Mode로 개발 (Claude 3.7 Sonnet)

## 기술 스택

- 서버: TypeScript, Model Context Protocol SDK
- 대시보드: React, TypeScript, Tailwind CSS, Vite
- 테스트: Jest


## 기능 개발 현황

- [x] 업무 조회 MCP 개발
- [ ] 메일 조회 MCP 개발
- [ ] 깃헙 MCP 연동
- [x] Claude와 연동
- [x] 대시보드 업무 현황판 개발
- [ ] 대시보드 깃헙 현황판 개발
- [ ] 대시보드 메일 현황판 개발
- [ ] 대시보드 html 즉시 실행
- [ ] 세션 ID 자동화


## 프로젝트 구조

- `server/`: MCP 서버 코드
- `dashboard/`: 대시보드 프론트엔드 코드
- `dashboards/`: 생성된 대시보드 HTML 파일 저장 디렉토리

## MCP 도구

이 서버는 다음 MCP 도구를 제공합니다:

- `get-my-tasks`: 모든 담당 업무 조회
- `get-working-tasks`: 진행 중인 담당 업무만 조회
- `get-backlog-tasks`: 대기 중인 담당 업무만 조회
- `get-task-dashboard`: 담당 업무 현황판 HTML 생성

## 설치 및 실행

### 모든 패키지 설치

```bash
pnpm install
```

### 개발 모드 실행

```bash
# 대시보드와 서버를 동시에 개발 모드로 실행
pnpm dev

# 대시보드만 개발 모드로 실행
pnpm dev:dashboard

# 서버만 개발 모드로 실행
pnpm dev:server
```

### 빌드 및 실행

```bash
# 전체 프로젝트 빌드 (대시보드 & 서버)
pnpm build

# 서버 실행
pnpm start
```

### MCP 서버 빠른 실행

```bash
./start-mcp-server.sh
```

## Claude 연동

클로드 > 설정 > 개발자 > 설정 편집

claude_desktop_config.json을 수정 및 재실행.

```json
{
  "mcpServers": {
    "dooray-tasks-mcp": {
      "type": "stdio",
      "command": "sh",
      "args": [
        "-c",
        "source ~/.nvm/nvm.sh && nvm use 22 && /Users/nhn/Projects/MyTaskManagerMCP/start-mcp-server.sh"
      ]
    }
  }
}
```