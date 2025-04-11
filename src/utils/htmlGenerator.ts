// Node.js 모듈 임포트 방식 수정
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { DoorayTasksResponse, DashboardOptions } from '../types/index.js';
import { Dashboard } from '../components/Dashboard.js';

const DEFAULT_DASHBOARD_DIR = path.join(process.cwd(), 'dashboards');

/**
 * 실제 데이터 값을 계산하는 헬퍼 함수
 */
function computeOverallStats(tasksData: DoorayTasksResponse) {
  const waiting = tasksData.result.filter(task => task.workflowClass === 'backlog').length;
  const toDo = tasksData.result.filter(task => task.workflowClass === 'registered').length;
  const inProgress = tasksData.result.filter(task => task.workflowClass === 'working').length;
  const done = tasksData.result.filter(task => task.workflowClass === 'done').length;
  return { waiting, toDo, inProgress, done };
}

/**
 * 마일스톤별 데이터 그룹화 및 상태별 통계 계산
 */
function computeMilestoneGroups(tasksData: DoorayTasksResponse) {
  // 그룹화: milestone이 없으면 'none' 키 사용
  const groups = tasksData.result.reduce((acc, task) => {
    const mId = task.milestoneId ? task.milestoneId : 'none';
    if (!acc[mId]) {
      acc[mId] = {
        // 마일스톤이 없는 경우 "마일스톤 없음"으로 표기
        name: mId === 'none'
          ? '마일스톤 없음'
          : tasksData.references?.milestoneMap?.[mId]?.name || '알 수 없는 마일스톤',
        tasks: [] as typeof tasksData.result,
      };
    }
    acc[mId].tasks.push(task);
    return acc;
  }, {} as { [key: string]: { name: string; tasks: typeof tasksData.result } });

  const groupsArray = Object.values(groups);
  // 실제 마일스톤이 있는 그룹과 "마일스톤 없음"을 분리
  const withMilestone = groupsArray.filter(group => group.name !== '마일스톤 없음').sort((a, b) => {
    // 이름 끝에 날짜가 있는 경우 추출하여 비교 (형식: xxx-YYYY-MM-DD 또는 xxx-YYYY.MM.DD)
    const extractTimestamp = (name: string): number => {
      const match = name.match(/-(\d{4}[.-]\d{1,2}[.-]\d{1,2})$/);
      return match ? new Date(match[1].replace(/[.]/g, '-')).getTime() : 0;
    };
    return extractTimestamp(a.name) - extractTimestamp(b.name);
  });
  const withoutMilestone = groupsArray.filter(group => group.name === '마일스톤 없음');
  return [...withMilestone, ...withoutMilestone];
}

/**
 * React 컴포넌트를 HTML 문자열로 렌더링한 후,
 * 스크립트는 별도로 붙여 최종 HTML 파일을 생성하는 함수
 */
export async function generateTasksDashboard(
  tasksData: DoorayTasksResponse,
  options: DashboardOptions = {}
): Promise<string> {
  const { title = '담당 업무 현황판', outputDir = DEFAULT_DASHBOARD_DIR } = options;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `dashboard-${timestamp}.html`;
  const filePath = path.join(outputDir, filename);

  // 컴포넌트 렌더링 (스크립트 제외)
  const element = React.createElement(Dashboard, { tasksData, title });
  const staticHtml = ReactDOMServer.renderToStaticMarkup(element);

  // 데이터 계산 - 전체 통계
  const overall = computeOverallStats(tasksData);
  // 마일스톤 그룹 계산
  const milestoneGroups = computeMilestoneGroups(tasksData);

  // 각 마일스톤 그룹의 상태 데이터 배열 생성
  const milestoneDataArray = milestoneGroups.map(group => {
    const waiting = group.tasks.filter(t => t.workflowClass === 'backlog').length;
    const toDo = group.tasks.filter(t => t.workflowClass === 'registered').length;
    const inProgress = group.tasks.filter(t => t.workflowClass === 'working').length;
    const done = group.tasks.filter(t => t.workflowClass === 'done').length;
    return [waiting, toDo, inProgress, done];
  });

  // 스크립트 문자열 - 데이터는 위에서 계산한 값을 사용
  const scriptString = `
<script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
<script>
window.onload = function() {
  // 전체 현황 차트
  const totalCanvas = document.getElementById('total-chart');
  if (totalCanvas) {
    const totalCtx = totalCanvas.getContext('2d');
    new Chart(totalCtx, {
      type: 'doughnut',
      data: {
        labels: ['대기', '할일', '진행 중', '완료'],
        datasets: [{
          data: [${overall.waiting}, ${overall.toDo}, ${overall.inProgress}, ${overall.done}],
          backgroundColor: ['#FF9800','#4CAF50','#2196F3','#9E9E9E']
        }]
      }
    });
  }
  
  // 마일스톤별 차트 초기화
  ${milestoneDataArray.map((data, idx) => `
    (function(){
      const canvas = document.getElementById('chart-${idx}');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['대기', '할일', '진행 중', '완료'],
          datasets: [{
            data: [${data.join(',')}],
            backgroundColor: ['#FF9800','#4CAF50','#2196F3','#9E9E9E']
          }]
        }
      });
    })();
  `).join('')}
};
</script>`;

  const completeHtml = `<!DOCTYPE html>${staticHtml}${scriptString}`;
  fs.writeFileSync(filePath, completeHtml, 'utf8');
  return filePath;
}
