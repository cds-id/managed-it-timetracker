import { useState } from 'react';
import { Task } from '../types';
import { apiService } from '../services/api';
import { useConfigStore } from '../store/config';

interface TaskActionsProps {
  task: Task;
  onStatusChange: () => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({ task, onStatusChange }) => {
  const [isChanging, setIsChanging] = useState(false);
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const config = useConfigStore(state => state.config);

  const getAvailableStatuses = () => {
    switch (task.status) {
      case 'TODO':
        return ['IN_PROGRESS'];
      case 'IN_PROGRESS':
        return ['TODO', 'DONE'];
      case 'DONE':
        return ['IN_PROGRESS'];
      default:
        return [];
    }
  };

  const handleTransition = async (newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    try {
      setIsChanging(true);
      await apiService.transitionTask(task.id, newStatus, comment);
      onStatusChange();
      setComment('');
      setShowCommentInput(false);
    } catch (error) {
      console.error('Failed to transition task:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const renderHTML = (html: string) => {
    try {
      const withFixedImages = html.replace(/src="\/api\//g, `src="${config?.host_url}/api/`);
      return withFixedImages;
    } catch (error) {
      return html;
    }
  };

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        {getAvailableStatuses().map((status) => (
          <button
            key={status}
            onClick={() => setShowCommentInput(true)}
            disabled={isChanging}
            className={`px-3 py-1 text-sm rounded-md ${
              isChanging ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              status === 'IN_PROGRESS'
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                : status === 'DONE'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Move to {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {showCommentInput && (
        <div className="mt-2 space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={2}
          />
          <div dangerouslySetInnerHTML={{ __html: renderHTML(task.description) }} />
          <div className="flex gap-2">
            {getAvailableStatuses().map((status) => (
              <button
                key={status}
                onClick={() => handleTransition(status as Task['status'])}
                disabled={isChanging}
                className={`px-3 py-1 text-sm rounded-md ${
                  isChanging ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  status === 'IN_PROGRESS'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : status === 'DONE'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Confirm {status.replace('_', ' ')}
              </button>
            ))}
            <button
              onClick={() => setShowCommentInput(false)}
              className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
