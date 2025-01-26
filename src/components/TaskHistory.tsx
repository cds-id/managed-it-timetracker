import { useState } from 'react';
import { Task } from '../types';

interface TaskHistoryProps {
  task: Task;
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        {isOpen ? 'Hide History' : 'Show History'}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
          {task.timeEntries.map((entry) => (
            <div key={entry.id} className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>{new Date(entry.startTime).toLocaleString()}</span>
                <span>{(entry.duration / 60).toFixed(2)} hours</span>
              </div>
              <p className="text-gray-500">{entry.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
