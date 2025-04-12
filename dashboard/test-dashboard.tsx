/**
 * Dashboard 컴포넌트 테스트
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import Dashboard from './src/components/Dashboard/index';

// 간단한 목 데이터
const mockTasksData = {
  result: [
    {
      id: '1',
      subject: '테스트 업무 1',
      workflowClass: 'working',
      milestoneId: 'm1',
      projectId: 'p1',
    },
    {
      id: '2',
      subject: '테스트 업무 2',
      workflowClass: 'registered',
      milestoneId: 'm1',
      projectId: 'p1',
    },
    {
      id: '3',
      subject: '테스트 업무 3',
      workflowClass: 'backlog',
      milestoneId: null,
      projectId: 'p1',
    },
  ],
  totalCount: 3,
  references: {
    milestoneMap: {
      m1: {
        name: '테스트 마일스톤',
      },
    },
    projectMap: {
      p1: {
        code: 'test-project',
      },
    },
  },
};

// 대시보드 렌더링 테스트
try {
  console.log('Dashboard 렌더링 테스트 시작...');
  const html = renderToString(
    React.createElement(Dashboard, {
      tasksData: mockTasksData,
      title: '테스트 대시보드',
    })
  );
  console.log('Dashboard 렌더링 성공!');
  console.log('HTML 길이:', html.length);

  // 생성된 HTML의 일부 출력 (너무 길면 필요 없음)
  // console.log(html.substring(0, 500) + "...");
} catch (error) {
  console.error('Dashboard 렌더링 오류:', error);
}
