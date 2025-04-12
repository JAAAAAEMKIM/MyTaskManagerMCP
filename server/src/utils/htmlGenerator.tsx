// Node.js 모듈 임포트
import * as fs from 'fs';
import * as path from 'path';
import { DoorayTasksResponse, DashboardOptions } from '../types/index.js';

// 대시보드 패키지에서 컴포넌트 임포트
import { renderServer } from '@dooray/task-dashboard';

const DEFAULT_DASHBOARD_DIR = path.join(process.cwd(), 'dashboards');

/**
 * Task 데이터를 안전하게 처리하는 함수
 * 객체 타입의 자식 요소로 인한 React 오류를 방지합니다
 */
function sanitizeTaskData(taskData: DoorayTasksResponse): DoorayTasksResponse {
  // 원본 데이터의 깊은 복사본 생성
  const safeData = JSON.parse(JSON.stringify(taskData)) as DoorayTasksResponse;

  // 각 태스크의 users 객체를 안전하게 처리
  safeData.result.forEach((task) => {
    // 각 사용자 객체에서 이름만 추출하여 문자열로 표현
    if (task.users) {
      // 담당자 이름 추출
      if (task.users.me?.member?.name) {
        task.assignee = task.users.me.member.name;
      } else if (task.users.to?.length && task.users.to[0]?.member?.name) {
        task.assignee = task.users.to[0].member.name;
      }
    }
  });

  return safeData;
}

/**
 * 대시보드 HTML을 생성하는 함수
 * React 서버 사이드 렌더링을 사용하여 대시보드 HTML 페이지를 생성합니다
 */
export async function generateTasksDashboard(
  tasksData: DoorayTasksResponse,
  options: DashboardOptions = {}
): Promise<string> {
  const { title = '담당 업무 현황판', outputDir = DEFAULT_DASHBOARD_DIR } =
    options;

  // 출력 디렉토리가 없으면 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 파일명 생성 (고정 이름으로 index.html이 필요한 경우 여기서 변경할 수 있음)
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = options.fixedFilename || `dashboard-${timestamp}.html`;
  const filePath = path.join(outputDir, filename);

  try {
    // 데이터를 안전하게 처리
    const safeTasksData = sanitizeTaskData(tasksData);
    const html = renderServer(safeTasksData, title);

    // 결과 파일 저장
    fs.writeFileSync(filePath, html, 'utf8');

    // index.html 파일이 필요하면 복사
    if (options.createIndexFile) {
      const indexPath = path.join(outputDir, 'index.html');
      fs.copyFileSync(filePath, indexPath);
      console.log(`대시보드를 index.html로 복사했습니다: ${indexPath}`);
    }

    return filePath;
  } catch (error) {
    throw error;
  }
}
