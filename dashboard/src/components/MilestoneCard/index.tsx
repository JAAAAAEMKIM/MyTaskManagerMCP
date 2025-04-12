import React, { useState } from 'react';
import {
  MilestoneGroup,
  WORKFLOW_CLASSES,
  WorkflowClass,
} from '../Dashboard/types';
import StatusGroup from '../StatusGroup/index';
import { cn } from '../../utils/cn';

interface MilestoneCardProps {
  group: MilestoneGroup;
  index: number;
  isNone?: boolean;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  group,
  index,
  isNone = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 마일스톤이 없는 경우에는 단순 카드로 표시
  if (isNone) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {WORKFLOW_CLASSES.map((statusKey) => {
            const filteredTasks = group.tasks.filter(
              (task) => task.workflowClass === statusKey
            );

            return (
              <StatusGroup
                key={statusKey}
                statusKey={statusKey}
                tasks={filteredTasks}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // 일반 마일스톤 카드
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 mb-6"
      data-milestone-id={index}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
          </svg>
          {group.name}
          <span className="inline-flex items-center justify-center px-2 py-1 ml-2 text-xs font-medium rounded-full bg-primary-50 text-primary">
            {group.tasks.length}개
          </span>
        </h3>
        <button
          className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? '확장' : '축소'}
        >
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </button>
      </div>

      <div
        className={cn(
          'transition-all duration-300 overflow-hidden',
          isCollapsed ? 'max-h-0' : 'max-h-[5000px]'
        )}
      >
        <div className="flex justify-center mb-6">
          <canvas
            id={`chart-${index}`}
            width={100}
            height={100}
            style={{ width: '200px', height: '200px' }}
          ></canvas>
          -
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {WORKFLOW_CLASSES.map((statusKey) => {
            const filteredTasks = group.tasks.filter(
              (task) => task.workflowClass === statusKey
            );

            return (
              <StatusGroup
                key={statusKey}
                statusKey={statusKey as WorkflowClass}
                tasks={filteredTasks}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
