import React from 'react';
import { DoorayTasksResponse } from '../types/index.js';

interface DashboardProps {
  tasksData: DoorayTasksResponse;
  title: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasksData, title }) => {
  // 전체 업무 상태 계산
  const overallStats = tasksData.result.reduce(
    (acc, task) => {
      const status = task.workflowClass;
      if (status === 'backlog') acc.waiting++;
      else if (status === 'registered') acc.toDo++;
      else if (status === 'working') acc.inProgress++;
      else if (status === 'done') acc.done++;
      return acc;
    },
    { waiting: 0, toDo: 0, inProgress: 0, done: 0 }
  );

  // 마일스톤별 그룹화 (마일스톤이 없는 경우 "마일스톤 없음")
  const milestoneGroups = Object.values(
    tasksData.result.reduce((groups, task) => {
      const mId = task.milestoneId || 'none';
      if (!groups[mId]) {
        groups[mId] = {
          name:
            mId === 'none'
              ? '마일스톤 없음'
              : tasksData.references?.milestoneMap?.[mId]?.name ||
                '알 수 없는 마일스톤',
          tasks: [] as typeof tasksData.result,
        };
      }
      groups[mId].tasks.push(task);
      return groups;
    }, {} as { [key: string]: { name: string; tasks: typeof tasksData.result } })
  );

  // 단계별 정렬: "xxx-날짜" 형태라면 날짜를 추출하고, 실패 시 Infinity 처리하여 가장 마지막으로 정렬
  const sortedMilestoneGroups = milestoneGroups.slice().sort((a, b) => {
    const extractTimestamp = (name: string): number =>
      (name.match(/-(\d{4}[.-]\d{1,2}[.-]\d{1,2})$/) || [])[1]
        ? new Date(
            (
              (name.match(/-(\d{4}[.-]\d{1,2}[.-]\d{1,2})$/) || [])[1] || ''
            ).replace(/[.]/g, '-')
          ).getTime()
        : Infinity;
    return extractTimestamp(a.name) - extractTimestamp(b.name);
  });

  // 상태별 우선순위: 대기(backlog)=1, 진행 중(working)=2, 할 일(registered)=3, 종료(done)=4
  const statusPriority = {
    backlog: 1,
    working: 2,
    registered: 3,
    done: 4,
  };

  // 색상 매핑 스와치: 각각 대기, 진행중, 할일, 종료.
  const statusColor = {
    backlog: '#FF9800', // 대기: orange
    working: '#2196F3', // 진행 중: blue
    registered: '#4CAF50', // 할 일: green
    done: '#9E9E9E', // 종료: gray
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        {/* 고도화된 인라인 스타일 */}
        <style>{`
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #ece9e6, #ffffff);
            margin: 0;
            padding: 0;
          }
          .dashboard {
            width: 100%;
            margin: 0;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
            animation: fadeIn 1s ease-in-out;
          }
          h1 {
            background: #3f51b5;
            color: #fff;
            padding: 1.5rem;
            margin: 0;
            text-align: center;
            font-size: 2rem;
          }
          section {
            padding: 2rem;
            border-bottom: 1px solid #eee;
          }
          section:last-child {
            border-bottom: none;
          }
          .overview, .milestones {
            margin-bottom: 2rem;
          }
          h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #333;
            border-left: 5px solid #3f51b5;
            padding-left: 1rem;
          }
          a {
            color: #3f51b5;
            text-decoration: none;
            transition: color 0.3s;
          }
          a:hover {
            color: #5c6bc0;
            text-decoration: underline;
          }
          canvas {
            display: block;
            margin: 0 auto;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          /* 추가: 반응형 스타일 */
          @media (max-width: 768px) {
            .dashboard { margin: 1rem; }
            h1 { font-size: 1.5rem; }
            section { padding: 1rem; }
          }
          .card-container {
            flex: 0 0 auto;
          }
          .overview {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
          }
          #total-chart-container {
            flex: 0 0 auto;
          }
          /* 업데이트: milestone grid를 flex row로 변경하여 세로 영역 분배 및 Vertical Divider 추가 */
          .milestone-grid {
            display: flex;
            flex-direction: row;
            align-items: stretch;
            gap: 0; /* gap 대신 divider로 영역 분배 */
          }
          .milestone-card {
            flex: 1;
            padding: 1rem;
            background: none;
            border: none;
            box-shadow: none;
          }
          /* 마지막 카드가 아니면 오른쪽에 vertical divider 추가 */
          .milestone-card:not(:last-child) {
            border-right: 1px solid #eee;
            margin-right: 1rem;
            padding-right: 1rem;
          }
          /* 전체 milestone grid 내부 카드의 최소 너비 900px 적용 */
          .milestone-card {
            min-width: 900px;
          }
          .milestone-card.hidden {
            display: none;
          }
          .milestone-card .tasks-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .milestone-card .task-item {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            border-bottom: 1px solid #eee;
            transition: background 0.3s;
          }
          .milestone-card .task-item:hover {
            background: #f0f0f0;
          }
          .swatch {
            display: inline-block;
            width: 4px;
            height: 20px;
            flex:none;
            margin-right: 0.5rem;
          }
          .status-label {
            font-size: 0.85rem;
            font-weight: bold;
            margin-right: 0.5rem;
            text-transform: uppercase;
            color: #555;
          }
          .status-group {
            margin-bottom: 1rem;
          }
          .status-header {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
            font-weight: bold;
            color: #333;
          }
          .status-label-header {
            margin-left: 0.5rem;
          }
          /* 추가: 고정된 그래프 크기 설정 */
          canvas {
            width: 200px !important;
            height: 200px !important;
          }
          #total-chart {
            width: 300px !important;
            height: 300px !important;
          }
          .milestone-divider {
            border: none;
            border-top: 1px solid #eee;
            margin: 1rem 0;
          }
        `}</style>
      </head>
      <body>
        <div className="dashboard">
          <h1>{title}</h1>
          {/* 전체 현황 섹션 */}
          <section className="overview">
            <div className="card-container">
              <div className="card">
                <p>대기: {overallStats.waiting}</p>
                <p>할일: {overallStats.toDo}</p>
                <p>진행 중: {overallStats.inProgress}</p>
                <p>완료: {overallStats.done}</p>
                <p>전체: {tasksData.result.length}</p>
              </div>
            </div>
            <div id="total-chart-container">
              <canvas id="total-chart" width="300" height="300"></canvas>
            </div>
          </section>
          {/* 마일스톤별 업무 현황 섹션 */}
          <section className="milestones">
            <h2>마일스톤별 업무 현황</h2>
            <div className="milestone-grid">
              {sortedMilestoneGroups.map((group, idx) => (
                <React.Fragment key={idx}>
                  <div
                    className={`milestone-card ${
                      group.name === '마일스톤 없음' ? 'hidden' : ''
                    }`}
                  >
                    <h3>
                      {group.name} ({group.tasks.length})
                    </h3>
                    <div id={`chart-${idx}-container`}>
                      <canvas
                        id={`chart-${idx}`}
                        width="200"
                        height="200"
                      ></canvas>
                    </div>
                    <div className="tasks-list">
                      {(
                        ['backlog', 'registered', 'working', 'done'] as const
                      ).map((statusKey) => {
                        const statusLabels: Record<string, string> = {
                          backlog: '대기',
                          registered: '할 일',
                          working: '진행 중',
                          done: '종료',
                        };
                        const filteredTasks = group.tasks.filter(
                          (task) => task.workflowClass === statusKey
                        );
                        if (filteredTasks.length === 0) return null;
                        return (
                          <div key={statusKey} className="status-group">
                            <div className="status-header">
                              <span
                                className="swatch"
                                style={{
                                  backgroundColor:
                                    statusKey === 'backlog'
                                      ? '#FF9800'
                                      : statusKey === 'registered'
                                      ? '#4CAF50'
                                      : statusKey === 'working'
                                      ? '#2196F3'
                                      : statusKey === 'done'
                                      ? '#9E9E9E'
                                      : '#ccc',
                                }}
                              />
                              <span className="status-label-header">
                                {statusLabels[statusKey]}
                              </span>
                            </div>
                            {filteredTasks.map((task) => (
                              <div key={task.id} className="task-item">
                                <span
                                  className="swatch"
                                  style={{
                                    backgroundColor:
                                      statusKey === 'backlog'
                                        ? '#FF9800'
                                        : statusKey === 'registered'
                                        ? '#4CAF50'
                                        : statusKey === 'working'
                                        ? '#2196F3'
                                        : statusKey === 'done'
                                        ? '#9E9E9E'
                                        : '#ccc',
                                  }}
                                />
                                <a
                                  href={`https://nhnent.dooray.com/task/to/${task.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {task.subject}
                                </a>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {idx < sortedMilestoneGroups.length - 1 && (
                    <hr className="milestone-divider" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
          <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
          <script>{`
            window.onload = function() {
              // 전체 현황 차트 초기화
              const totalCanvas = document.getElementById('total-chart');
              if (totalCanvas) {
                const totalCtx = totalCanvas.getContext('2d');
                new Chart(totalCtx, {
                  type: 'doughnut',
                  data: {
                    labels: ['대기', '할일', '진행 중', '완료'],
                    datasets: [{
                      data: [${overallStats.waiting}, ${overallStats.toDo}, ${overallStats.inProgress}, ${overallStats.done}],
                      backgroundColor: ['#FF9800','#4CAF50','#2196F3','#9E9E9E']
                    }]
                  }
                });
              }
              
              // 마일스톤별 차트 초기화
              let idx = 0;
              while (true) {
                const canvas = document.getElementById('chart-' + idx);
                if (!canvas) break;
                const ctx = canvas.getContext('2d');
                const counts = sortedMilestoneGroups[idx].tasks.reduce(
                  (acc, task) => {
                    const status = task.workflowClass;
                    if (status === 'backlog') acc[0]++;
                    else if (status === 'registered') acc[1]++;
                    else if (status === 'working') acc[2]++;
                    else if (status === 'done') acc[3]++;
                    return acc;
                  },
                  [0, 0, 0, 0]
                );
                new Chart(ctx, {
                  type: 'pie',
                  data: {
                    labels: ['대기', '할일', '진행 중', '완료'],
                    datasets: [{
                      data: counts,
                      backgroundColor: ['#FF9800','#4CAF50','#2196F3','#9E9E9E']
                    }]
                  }
                });
                idx++;
              }
            };
          `}</script>
        </div>
      </body>
    </html>
  );
};
