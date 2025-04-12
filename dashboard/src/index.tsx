import './styles/globals.css';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import Dashboard from './components';
import React from 'react';
import { DoorayTasksResponse } from './types';

// 컴포넌트 직접 내보내기 (경로 참조 문제 해결)
export { Dashboard } from './components/Dashboard/index';
export { DashboardClient } from './components/Dashboard/DashboardClient';
export default Dashboard;

// 타입 내보내기
export type { DoorayTasksResponse, DoorayTask } from './types';
export type {
  STATUS_COLORS,
  STATUS_LABELS,
  MilestoneGroup,
  OverallStats,
} from './components/Dashboard/types';

export const renderServer = (tasksData: DoorayTasksResponse, title: string) => {
  const reactHtml = renderToString(
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {/* 외부 스타일시트 로드 */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div id="root">
          <Dashboard tasksData={tasksData} title={title} />
        </div>
      </body>
    </html>
  );
  // HTML에 CSS 링크와 Tailwind CDN 추가

  // 하이드레이션을 수행하는 스크립트
  const hydrationScript = `
    <script type="module">
      import { hydrateClient } from './index.js';
      window.__INITIAL_DATA__ = ${JSON.stringify({
        tasksData,
        title,
      })};
      hydrateClient();
    </script>
  `;

  return reactHtml.replace('</head>', `${hydrationScript}</head>`);
};

export const hydrateClient = () => {
  const rootElement = document.getElementById('root') || document.body;
  const initialData = (window as any).__INITIAL_DATA__;

  if (initialData) {
    hydrateRoot(
      rootElement,
      React.createElement(Dashboard, {
        tasksData: initialData.tasksData,
        title: initialData.title,
      })
    );
    console.log('Dashboard hydration completed');
  } else {
    console.error('Initial data not found for hydration');
  }
};
