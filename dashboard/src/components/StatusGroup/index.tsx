import React from 'react';
import {
  ProcessedDoorayTask,
  WorkflowClass,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../Dashboard/types';
import TaskItem from '../TaskItem/index';

interface StatusGroupProps {
  statusKey: WorkflowClass;
  tasks: ProcessedDoorayTask[];
}

export const StatusGroup: React.FC<StatusGroupProps> = ({
  statusKey,
  tasks,
}) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-6" data-status={statusKey}>
      <div className="flex items-center mb-3 font-bold text-gray-700 bg-gray-100 p-2 rounded-md">
        <span
          className="inline-block w-3 h-3 rounded-full mr-2"
          style={{
            backgroundColor: STATUS_COLORS[statusKey],
          }}
        />
        <span className="text-sm uppercase">
          {STATUS_LABELS[statusKey]} ({tasks.length})
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default StatusGroup;
