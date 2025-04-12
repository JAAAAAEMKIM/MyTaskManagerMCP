import { DoorayTask as OriginalDoorayTask } from "../../types";

// 안전하게 가공된 업무 타입
export interface ProcessedDoorayTask extends Omit<OriginalDoorayTask, 'users'> {
  assignee?: string;
}

export interface StatusColorMap {
  backlog: string;
  working: string;
  registered: string;
  done: string;
  [key: string]: string;
}

export interface StatusLabelMap {
  backlog: string;
  working: string;
  registered: string;
  done: string;
  [key: string]: string;
}

export interface MilestoneGroup {
  name: string;
  tasks: ProcessedDoorayTask[];
}

export interface OverallStats {
  waiting: number;
  toDo: number;
  inProgress: number;
  done: number;
}

// 클라이언트 측에서 사용될 데이터
export interface DashboardInitialData {
  title: string;
  overallStats: OverallStats;
  milestones: MilestoneGroup[];
  statusColors: StatusColorMap;
  statusLabels: StatusLabelMap;
}

// 색상 매핑 스와치: 각각 대기, 진행중, 할일, 종료.
export const STATUS_COLORS: StatusColorMap = {
  backlog: '#FF9800', // 대기: orange
  working: '#4CAF50', // 진행 중: blue
  registered: '#2196F3', // 할 일: green
  done: '#9E9E9E', // 종료: gray
};

// 상태 레이블 매핑
export const STATUS_LABELS: StatusLabelMap = {
  backlog: '대기',
  registered: '할 일',
  working: '진행 중',
  done: '종료',
};

// 워크플로우 클래스 타입
export type WorkflowClass = 'backlog' | 'registered' | 'working' | 'done';

// 워크플로우 클래스 목록 (정렬순서를 위해)
export const WORKFLOW_CLASSES: WorkflowClass[] = ['backlog', 'registered', 'working', 'done'];