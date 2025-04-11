
import { generateTasksDashboard } from "../utils/htmlGenerator.js";
import { McpToolResponse } from "../types/index.js";
import { fetchAllDoorayTasks } from "../api/dooray.js";

/**
 * get-task-dashboard 핸들러
 * 1) Dooray API를 통해 업무 데이터를 받음.
 * 2) React를 통해 현황판 HTML 생성.
 * 3) 생성된 파일 경로를 반환.
 */
export async function handleGetTaskDashboard({ page, size }: { page: number; size: number }): Promise<McpToolResponse> {
  try {
    const tasksData = await fetchAllDoorayTasks({
      size,
      workflowClasses: ["registered", "working", "backlog"]
    });

    const filePath = await generateTasksDashboard(tasksData, { title: '담당 업무 현황판' });
    
    return {
      content: [
        {
          type: "text",
          text: `현황판이 생성되었습니다. 파일 경로: ${filePath}`
        }
      ]
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `현황판 생성 중 오류 발생: ${error.message || error.toString()}`
        }
      ],
      isError: true
    };
  }
}
