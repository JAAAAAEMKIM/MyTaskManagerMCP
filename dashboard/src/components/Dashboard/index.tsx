import React from 'react';
import { DoorayTasksResponse } from '../../types/index';
import { MilestoneGroup, OverallStats } from './types';
import { DashboardClient } from './DashboardClient';

interface DashboardProps {
  tasksData: DoorayTasksResponse;
  title: string;
}

/**
 * Dashboard 컴포넌트
 *
 * 담당 업무 현황을 시각적으로 표시하는 대시보드 컴포넌트입니다.
 * 마일스톤별 업무 현황, 전체 업무 현황 등을 차트와 목록으로 표시합니다.
 * 서버 측에서 렌더링된 후 클라이언트 측에서 Hydration됩니다.
 */
export const Dashboard: React.FC<DashboardProps> = ({ tasksData, title }) => {
  // 전체 업무 상태 계산
  const overallStats: OverallStats = tasksData.result.reduce(
    (acc, task) => {
      const status = task.workflowClass || '';
      if (status === 'backlog') acc.waiting++;
      else if (status === 'registered') acc.toDo++;
      else if (status === 'working') acc.inProgress++;
      else if (status === 'done') acc.done++;
      return acc;
    },
    { waiting: 0, toDo: 0, inProgress: 0, done: 0 }
  );

  // 마일스톤별 그룹화 (마일스톤이 없는 경우 "마일스톤 없음")
  const milestoneGroups: MilestoneGroup[] = Object.values(
    tasksData.result.reduce((groups, task) => {
      // null 체크와 타입 안전성 보장
      const mId = task.milestoneId || 'none';
      if (!groups[mId]) {
        // 마일스톤 맵에서 이름을 안전하게 추출
        let milestoneName = '알 수 없는 마일스톤';
        if (mId === 'none') {
          milestoneName = '마일스톤 없음';
        } else if (
          tasksData.references?.milestoneMap &&
          typeof tasksData.references.milestoneMap === 'object' &&
          tasksData.references.milestoneMap[mId] &&
          typeof tasksData.references.milestoneMap[mId].name === 'string'
        ) {
          milestoneName = tasksData.references.milestoneMap[mId].name;
        }

        groups[mId] = {
          name: milestoneName,
          tasks: [],
        };
      }

      // 과도한 데이터는 제거하면서 필요한 속성만 포함
      groups[mId].tasks.push({
        id: task.id,
        subject: typeof task.subject === 'string' ? task.subject : '제목 없음',
        workflowClass:
          typeof task.workflowClass === 'string' ? task.workflowClass : '',
        workflowId: task.workflowId || '',
        milestoneId: task.milestoneId || null,
        projectId: task.projectId || '',
        dueDate: task.dueDate || null,
        updatedAt: task.updatedAt || '',
        createdAt: task.createdAt || '',
        tagIdList: Array.isArray(task.tagIdList) ? task.tagIdList : [],
        // 복잡한 객체 구조는 문자열화하거나 필요한 부분만 추출
        assignee:
          task.users?.me?.member?.name ||
          task.users?.to?.[0]?.member?.name ||
          '',
        // 필요한 다른 속성들을 여기에 추가
      });

      return groups;
    }, {} as Record<string, MilestoneGroup>)
  );

  // 단계별 정렬: "xxx-날짜" 형태라면 날짜를 추출하고, 실패 시 Infinity 처리하여 가장 마지막으로 정렬
  const sortedMilestoneGroups = milestoneGroups.slice().sort((a, b) => {
    const extractTimestamp = (name: string): number => {
      try {
        const dateMatch = name.match(/-(\d{4}[.-]\d{1,2}[.-]\d{1,2})$/);
        if (dateMatch && dateMatch[1]) {
          return new Date(dateMatch[1].replace(/[.]/g, '-')).getTime();
        }
        return Infinity;
      } catch (e) {
        return Infinity;
      }
    };
    return extractTimestamp(a.name) - extractTimestamp(b.name);
  });

  // 초기 데이터 구성
  const initialData = {
    title,
    overallStats,
    milestones: sortedMilestoneGroups,
  };

  return <DashboardClient initialData={initialData} />;
};

export default Dashboard;
