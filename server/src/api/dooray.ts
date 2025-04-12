import axios from "axios";
import { API_CONFIG } from "../config/config.js";
import { TasksQueryParams, DoorayTasksResponse } from "../types/index.js";

// API 요청을 위한 Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'MCP-Server/1.0'
  },
  // Node.js 환경에서 쿠키 사용을 위한 설정
  withCredentials: true,
  timeout: 10000
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    // 매 요청마다 쿠키 헤더 설정
    if (API_CONFIG.COOKIES) {
      config.headers['Cookie'] = API_CONFIG.COOKIES;
      console.error(`[DEBUG] Cookie header added: ${API_CONFIG.COOKIES.substring(0, 15)}...`);
    } else {
      console.error(`[WARN] No cookies available for authentication`);
    }
    return config;
  },
  (error) => {
    console.error(`[ERROR] Request interceptor error: ${error}`);
    return Promise.reject(error);
  }
);

/**
 * Dooray 업무 목록을 조회하는 함수
 */
export async function fetchDoorayTasks({ page = 0, size = 100, workflowClasses }: { page?: number; size?: number; workflowClasses: string[] }): Promise<DoorayTasksResponse> {
  // 워크플로우 클래스 쿼리 파라미터 구성
  const workflowParams = workflowClasses
    .map(cls => `userWorkflowClass=${cls}`)
    .join('&');
    
  const url = `/projects/*/tasks?size=${size}&page=${page}&order=-postUpdatedAt&toMemberIds=${API_CONFIG.USER_ID}&${workflowParams}`;
  
  try {
    console.error(`[DEBUG] Requesting Dooray API: ${url}`);
    console.error(`[DEBUG] Full API URL: ${API_CONFIG.BASE_URL}${url}`);
    
    // API 요청 전 쿠키 사용 여부 로깅
    console.error(`[DEBUG] Using cookies: ${!!API_CONFIG.COOKIES}`);
    
    const response = await axiosInstance.get(url);
    console.error(`[DEBUG] API response status: ${response.status}`);
    
    // 응답 데이터의 일부만 로깅 (데이터 크기가 클 수 있음)
    if (response.data?.result?.length) {
      console.error(`[DEBUG] API response: Found ${response.data.result.length} tasks`);
    } else {
      console.error(`[DEBUG] API response data structure: ${Object.keys(response.data).join(', ')}`);
    }
    
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(`[ERROR] Dooray API error: ${error.message}`);
      console.error(`[ERROR] Status: ${error.response?.status}`);
      
      // 오류 응답 데이터도 전체 로깅
      if (error.response?.data) {
        console.error(`[ERROR] Complete error response: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        console.error(`[ERROR] No response data available`);
      }
      
      // 상세 에러 정보 기록
      if (error.response) {
        console.error(`[ERROR] Response headers: ${JSON.stringify(error.response.headers)}`);
        console.error(`[ERROR] Request URL: ${error.config?.url}`);
      }
    } else {
      console.error(`[ERROR] Unexpected error: ${error}`);
    }
    
    // 임시 더미 데이터 반환 (API 오류 시 서버 종료 방지)
    return {
      totalCount: 0,
      result: []
    };
  }
}

// 새 함수: totalCount에 따라 모든 페이지를 Promise.all로 동시에 호출
export async function fetchAllDoorayTasks({ size = 100, workflowClasses }: { size?: number; workflowClasses: string[] }): Promise<DoorayTasksResponse> {
  const initialData = await fetchDoorayTasks({
    page: 0,
    size,
    workflowClasses,
  });
  const totalCount = initialData.totalCount;
  const tasks = [...initialData.result];
  const totalPages = Math.ceil(totalCount / size);

  if (totalPages > 1) {
    const promises = [];
    for (let page = 1; page < totalPages; page++) {
      promises.push(fetchDoorayTasks({ page, size, workflowClasses }));
    }
    const pagesData = await Promise.all(promises);
    pagesData.forEach((pageData) => {
      tasks.push(...pageData.result);
    });
  }

  return { ...initialData, result: tasks };
}

