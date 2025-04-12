import React from 'react';
import {
  ProcessedDoorayTask,
  WorkflowClass,
  STATUS_COLORS,
} from '../Dashboard/types';
import { cn } from '../../utils/cn';

interface TaskItemProps {
  task: ProcessedDoorayTask;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const statusColor =
    STATUS_COLORS[task.workflowClass as WorkflowClass] || STATUS_COLORS.backlog;

  return (
    <div
      className="flex items-center p-3 bg-white rounded-md shadow-sm hover:bg-gray-50 hover:translate-x-1 transition-all duration-200"
      data-task-id={task.id}
      data-status={task.workflowClass}
    >
      <span
        className="inline-block w-3 h-3 rounded-full flex-none mr-3"
        style={{
          backgroundColor: statusColor,
        }}
      />
      <div className="flex flex-col flex-1">
        <a
          href={`https://nhnent.dooray.com/task/to/${task.id}`}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-gray-900 mb-1 hover:text-primary hover:underline"
        >
          {task.subject}
        </a>
        <div className="flex text-xs text-gray-500 gap-3">
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {new Date(task.updatedAt).toLocaleDateString()}
          </span>
          {task.priority && (
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
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
              <span
                className={cn(
                  task.priority === 'highest' && 'text-red-500',
                  task.priority === 'high' && 'text-orange-500',
                  task.priority === 'medium' && 'text-yellow-500',
                  task.priority === 'low' && 'text-green-500'
                )}
              >
                {task.priority}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
