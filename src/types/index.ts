// Dooray API 응답 타입
export interface DoorayTasksResponse {
  totalCount: number;
  result: DoorayTask[];
  references?: {
    milestoneMap?: Record<string, { name: string }>;
    workflowMap?: Record<string, { name: string }>;
    projectMap?: Record<string, { code: string }>;
    tagMap?: Record<string, { name: string }>;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface DoorayTask {
  id: string;
  subject: string;
  workflowClass?: string;
  workflowId?: string;
  milestoneId?: string;
  projectId?: string;
  dueDate?: string;
  tagIdList?: string[];
  [key: string]: any;
}

// API 호출 파라미터 타입
export interface TasksQueryParams {
  page: number;
  size: number;
  workflowClasses: string[];
}

// MCP 도구 응답 콘텐츠 타입 - MCP SDK 타입에 맞게 수정
export interface McpContentItem {
  type: "text";
  text: string;
  [key: string]: unknown;
}

// MCP 도구 응답 타입 - MCP SDK 타입에 맞게 수정
export interface McpToolResponse {
  content: McpContentItem[];
  _meta?: Record<string, unknown>;
  isError?: boolean;
  [key: string]: unknown;
}

// Dashboard 생성 관련 타입
export interface DashboardOptions {
  title?: string;
  outputDir?: string;
  openInBrowser?: boolean;
}

export interface TaskStatusCount {
  backlog: number;
  registered: number;
  working: number;
  done: number;
  total: number;
}

export interface MilestoneTasksData {
  milestoneName: string;
  milestoneId: string;
  tasks: DoorayTask[];
  statusCount: TaskStatusCount;
}

// JSON-RPC 메시지 타입
export interface JsonRpcMessage {
  method: string;
  params: any;
  id: string | number;
  jsonrpc: string;
}