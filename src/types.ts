export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  clientId: string;
  client: {
    id: string;
    name: string;
  };
  timeEntries: TimeEntry[];
}

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: string;
  endTime: string;
  duration: number;
  description: string;
  task?: {
    id: string;
    title: string;
  };
}

export interface Config {
  host_url: string;
  token_api: string;
}
