import { z } from "zod";
import { fetchDoorayTasks } from "../api/dooray.js";
import { formatTasks } from "../utils/formatter.js";
import { McpToolResponse } from "../types/index.js";

/**
 * 모든 담당 업무 조회 핸들러
 */
export async function handleGetMyTasks({ page, size }: { page: number; size: number }): Promise<McpToolResponse> {
  try {
    console.error(`[DEBUG] get-my-tasks called with page=${page}, size=${size}`);
    const tasksData = await fetchDoorayTasks({
      page,
      size,
      workflowClasses: ["registered", "working", "backlog"]
    });
    
    const formattedResponse = formatTasks(tasksData);
    console.error(`[DEBUG] get-my-tasks response formatted successfully`);
    
    return {
      content: [
        {
          type: "text",
          text: formattedResponse,
        },
      ],
    };
  } catch (error: any) {
    console.error(`[ERROR] Error in get-my-tasks: ${error.message || error}`);
    return {
      content: [
        {
          type: "text",
          text: `담당 업무를 조회하는 중 오류가 발생했습니다: ${error.message || error}`,
        },
      ],
      isError: true
    };
  }
}

/**
 * 진행 중인 업무만 조회하는 핸들러
 */
export async function handleGetWorkingTasks({ page, size }: { page: number; size: number }): Promise<McpToolResponse> {
  try {
    console.error(`[DEBUG] get-working-tasks called with page=${page}, size=${size}`);
    const tasksData = await fetchDoorayTasks({
      page,
      size,
      workflowClasses: ["working"]
    });
    
    const formattedResponse = formatTasks(tasksData);
    console.error(`[DEBUG] get-working-tasks response formatted successfully`);
    
    return {
      content: [
        {
          type: "text",
          text: formattedResponse,
        },
      ],
    };
  } catch (error: any) {
    console.error(`[ERROR] Error in get-working-tasks: ${error.message || error}`);
    return {
      content: [
        {
          type: "text",
          text: `진행 중인 업무를 조회하는 중 오류가 발생했습니다: ${error.message || error}`,
        },
      ],
      isError: true
    };
  }
}

/**
 * 대기 중인 업무만 조회하는 핸들러
 */
export async function handleGetBacklogTasks({ page, size }: { page: number; size: number }): Promise<McpToolResponse> {
  try {
    console.error(`[DEBUG] get-backlog-tasks called with page=${page}, size=${size}`);
    const tasksData = await fetchDoorayTasks({
      page,
      size,
      workflowClasses: ["backlog"]
    });
    
    const formattedResponse = formatTasks(tasksData);
    console.error(`[DEBUG] get-backlog-tasks response formatted successfully`);
    
    return {
      content: [
        {
          type: "text",
          text: formattedResponse,
        },
      ],
    };
  } catch (error: any) {
    console.error(`[ERROR] Error in get-backlog-tasks: ${error.message || error}`);
    return {
      content: [
        {
          type: "text",
          text: `대기 중인 업무를 조회하는 중 오류가 발생했습니다: ${error.message || error}`,
        },
      ],
      isError: true
    };
  }
}

// Tool 스키마 정의
export const tasksToolSchema = {
  page: z.number().default(0).describe("조회할 페이지 번호 (기본값: 0)"),
  size: z.number().default(100).describe("한 페이지에 표시할 업무 수 (기본값: 100)"),
};