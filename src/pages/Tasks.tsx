import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Task } from '../types';
import { TaskActions } from '../components/TaskActions';
import { ErrorMessage } from '../components/ErrorMessage';
import { RichContent } from '../components/RichContent';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const tasksData = await apiService.getTasks();
      setTasks(tasksData);
      setError(null);
    } catch (error) {
      setError('Failed to fetch tasks');
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tasks</h1>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <RichContent html={task.description} className="text-gray-600" />
            <div className="mt-2 flex gap-2">
              <span className={`px-2 py-1 rounded text-sm ${
                task.priority === 'HIGH'
                  ? 'bg-red-100 text-red-800'
                  : task.priority === 'MEDIUM'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
              <span className={`px-2 py-1 rounded text-sm ${
                task.status === 'DONE'
                  ? 'bg-green-100 text-green-800'
                  : task.status === 'IN_PROGRESS'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {task.status}
              </span>
            </div>
            <TaskActions task={task} onStatusChange={fetchTasks} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
