import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { JsonRpcMessage } from "./types/index.js";
import { 
  handleGetMyTasks, 
  handleGetWorkingTasks, 
  handleGetBacklogTasks,
  tasksToolSchema
} from "./handlers/taskHandlers.js";
import { handleGetTaskDashboard } from "./handlers/taskDashboardHandler.js";
import { MCP_CONFIG, API_CONFIG } from "./config/config.js";
import { fetchDoorayTasks } from "./api/dooray.js";

// MCP 서버 인스턴스 생성
const server = new McpServer({
  name: MCP_CONFIG.NAME,
  version: MCP_CONFIG.VERSION,
  capabilities: {
    resources: {},
    tools: {},
  },
});

// MCP 서버에 도구 등록
server.tool(
  "get-my-tasks",
  "Dooray의 모든 담당 업무 목록을 조회합니다",
  tasksToolSchema,
  handleGetMyTasks
);

server.tool(
  "get-working-tasks",
  "Dooray에서 현재 진행 중인 담당 업무만 조회합니다",
  tasksToolSchema,
  handleGetWorkingTasks
);

server.tool(
  "get-backlog-tasks",
  "Dooray에서 대기 중인 담당 업무만 조회합니다",
  tasksToolSchema,
  handleGetBacklogTasks
);

// 새 도구 등록: get-task-dashboard
server.tool(
  "get-task-dashboard",
  "Dooray의 담당 업무 현황판을 HTML로 생성합니다",
  tasksToolSchema,  // page, size 파라미터 사용
  handleGetTaskDashboard
);

server.prompt('ping', '서버 상태를 확인합니다.', () => ({messages: [{content: {type: 'text', text: 'pong'}, role: 'user'}], }))

// 서버 실행 함수
async function main() {
  try {
    console.error("[INFO] Starting Dooray Tasks MCP 서버...");
    
    // 서버 연결
    const transport = new StdioServerTransport();
    
    // 커스텀 메시지 핸들러
    const origOnMessage = transport.onmessage;
    transport.onmessage = (message) => {
      try {
        console.error(`[DEBUG] Received message: ${JSON.stringify(message)}`);
        
        // jsonrpc 메시지인지 확인하고 method 속성이 있는지 확인
        if (typeof message === 'object' && message !== null && 
            'method' in message && 'id' in message && 'jsonrpc' in message) {
          const jsonRpcMessage = message as JsonRpcMessage;
          
          // prompts/list 또는 resources/list 메서드 처리
          if (jsonRpcMessage.method === 'prompts/list') {
            console.error(`[DEBUG] Handling prompts/list request`);
            // 응답 직접 전송
            transport.send({
              jsonrpc: "2.0",
              id: jsonRpcMessage.id,
              result: { prompts: [] }
            });
            return; // 기본 처리 중단
          } 
          else if (jsonRpcMessage.method === 'resources/list') {
            console.error(`[DEBUG] Handling resources/list request`);
            // 응답 직접 전송
            transport.send({
              jsonrpc: "2.0",
              id: jsonRpcMessage.id,
              result: { resources: [] }
            });
            return; // 기본 처리 중단
          }
        }
      } catch (e) {
        console.error(`[ERROR] Error processing message: ${e}`);
      }
      
      // 다른 메시지는 기본 핸들러에게 전달
      if (origOnMessage) {
        origOnMessage(message);
      }
    };
    
    // MCP 서버 연결
    await server.connect(transport);
    
    console.error("[INFO] Dooray Tasks MCP 서버가 실행 중입니다");
    console.error("[INFO] 서버 구성:");
    console.error(`[INFO] - 서버 이름: ${MCP_CONFIG.NAME}`);
    console.error(`[INFO] - API Base: ${API_CONFIG.BASE_URL}`);
    console.error(`[INFO] - User ID: ${API_CONFIG.USER_ID}`);
    console.error("[INFO] 서버가 준비되었습니다. 도구 호출을 기다리는 중...");
    
    // 초기 API 테스트는 서버 초기화와 분리
    setTimeout(async () => {
      try {
        console.error("[INFO] 초기 API 연결을 테스트합니다...");
        const testData = await fetchDoorayTasks({
          page: 0,
          size: 1,
          workflowClasses: ["working"]
        });
        console.error(`[INFO] API 연결 테스트 성공: ${testData.totalCount}개의 업무 확인됨`);
      } catch (err) {
        console.error(`[WARN] 초기 API 연결 테스트 실패: ${err}`);
      }
    }, 1000);
  } catch (error: any) {
    console.error(`[FATAL] 서버 시작 중 오류 발생: ${error.message || error}`);
    throw error;
  }
}

// 메인 함수 실행
main().catch((error) => {
  console.error(`[FATAL] Fatal error in main(): ${error.message || error}`);
  // 프로세스를 종료하지 않고 계속 실행
});