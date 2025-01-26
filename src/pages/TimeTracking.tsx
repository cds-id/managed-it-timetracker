import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Task } from '../types';

const TimeTracking = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await apiService.getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    let interval: number;
    if (isTracking && startTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking, startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTracking = () => {
    if (!selectedTask) return;
    setIsTracking(true);
    setStartTime(new Date());
    setElapsedTime(0);
  };

  const handleStopTracking = async () => {
    if (!selectedTask || !startTime) return;

    try {
      await apiService.createTimeEntry({
        taskId: selectedTask.id,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        description,
      });

      setIsTracking(false);
      setStartTime(null);
      setDescription('');
      setSelectedTask(null);
      setElapsedTime(0);
    } catch (error) {
      console.error('Failed to save time entry:', error);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Time Tracking</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Task</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedTask?.id || ''}
              onChange={(e) => setSelectedTask(tasks.find(t => t.id === e.target.value) || null)}
              disabled={isTracking}
            >
              <option value="">Select a task...</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isTracking}
            />
          </div>

          <div className="text-center">
            <div className="text-4xl font-mono mb-4">{formatTime(elapsedTime)}</div>
            {!isTracking ? (
              <button
                onClick={handleStartTracking}
                disabled={!selectedTask}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                Start Tracking
              </button>
            ) : (
              <button
                onClick={handleStopTracking}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Stop Tracking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
