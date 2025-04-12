import { useEffect, useRef } from 'react';
import { DashboardInitialData } from '../components/Dashboard/types';
import Chart from 'chart.js/auto'

/**
 * Chart.js 차트를 초기화하는 React Hook
 */
export function useCharts(data: DashboardInitialData) {
  const initialized = useRef(false);

  useEffect(() => {
    // 이미 초기화되었다면 중복 실행 방지
    if (initialized.current) return;
    initialized.current = true;

    // 전체 현황 차트
    const totalCanvas = document.getElementById('total-chart') as HTMLCanvasElement;
    if (totalCanvas) {
      const totalCtx = totalCanvas.getContext('2d');
      if (totalCtx) {
        new Chart(totalCtx, {
          type: 'doughnut',
          data: {
            labels: Object.values(data.statusLabels),
            datasets: [{
              data: [
                data.overallStats.waiting,
                data.overallStats.toDo,
                data.overallStats.inProgress,
                data.overallStats.done
              ],
              backgroundColor: Object.values(data.statusColors)
            }]
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    const label = context.label || '';
                    const value = context.raw as number;
                    const total = (context.chart.data.datasets[0].data as number[]).reduce((a, b) => (a as number) + (b as number), 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // 마일스톤별 차트
    data.milestones.forEach((milestone, idx) => {
      if (milestone.name === '마일스톤 없음') return;
      
      const canvas = document.getElementById(`chart-${idx}`) as HTMLCanvasElement;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const statusCounts = [0, 0, 0, 0]; // backlog, registered, working, done
      
      milestone.tasks.forEach(task => {
        if (task.workflowClass === 'backlog') statusCounts[0]++;
        else if (task.workflowClass === 'registered') statusCounts[1]++;
        else if (task.workflowClass === 'working') statusCounts[2]++;
        else if (task.workflowClass === 'done') statusCounts[3]++;
      });
      
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.values(data.statusLabels),
          datasets: [{
            data: statusCounts,
            backgroundColor: Object.values(data.statusColors)
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const label = context.label || '';
                  const value = context.raw as number;
                  const total = (context.chart.data.datasets[0].data as number[]).reduce((a, b) => (a as number) + (b as number), 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    });
  }, [data]);
}
