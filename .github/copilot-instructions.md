<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# 담당 업무 MCP

이 프로젝트는 Dooray의 담당 업무 현황을 파악하기 위한 Model Context Protocol(MCP) 서버입니다.

## MCP 관련 정보

- MCP SDK 문서: https://github.com/modelcontextprotocol/create-python-server
- MCP 서버는 Dooray API를 사용하여 담당 업무 정보를 가져옵니다.
- 이 MCP 서버는 TypeScript로 구현되었으며, VSCode와 같은 MCP 호스트와 함께 사용할 수 있습니다.

## API 정보

Dooray 담당 업무 조회 API:
```
GET https://nhnent.dooray.com/wapi/task/v1/projects/*/tasks?size=100&page=0&order=-postUpdatedAt&toMemberIds=2914472305406725889&userWorkflowClass=registered&userWorkflowClass=working&userWorkflowClass=backlog
```

- size: 한 페이지에 표시할 업무 수 (기본값: 100)
- page: 페이지 번호 (0부터 시작)
- toMemberIds: 사용자 ID (2914472305406725889)
- userWorkflowClass: 업무 상태 (registered, working, backlog)