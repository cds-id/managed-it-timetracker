import { fetch } from '@tauri-apps/plugin-http';
import { Config, Task, TimeEntry } from '../types';

export class APIService {
  private static instance: APIService;
  private config: Config | null = null;

  private constructor() {}

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  setConfig(config: Config | null): void {
    this.config = config;
  }

  private handleUnauthorized() {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  private async request<T>(method: 'get' | 'post', path: string, body?: any): Promise<T> {
    if (!this.config) {
      throw new Error('API not configured');
    }

    const url = `${this.config.host_url}${path}`;

    try {
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          'Authorization': `Bearer ${this.config.token_api}`,
          'Content-Type': 'application/json'
        },
        body: method === 'post' ? JSON.stringify(body || {}) : undefined,
      });

      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized - Please log in again');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        this.handleUnauthorized();
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  async validateConfig(config: Config): Promise<boolean> {
    try {
      const url = `${config.host_url}/api/v1/tasks`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.token_api}`
        },
      });

      if (response.status === 401) {
        return false;
      }

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getTasks(): Promise<Task[]> {
    const response = await this.request<{ tasks: Task[] }>('get', '/api/v1/tasks');
    return response.tasks;
  }

  async createTimeEntry(data: {
    taskId: string;
    startTime: string;
    endTime: string;
    description: string;
  }): Promise<TimeEntry> {
    return this.request<TimeEntry>('post', '/api/v1/time-entries', data);
  }

  async getTimeEntries(startDate: string, endDate: string): Promise<TimeEntry[]> {
    const response = await this.request<{ timeEntries: TimeEntry[] }>(
      'get',
      `/api/v1/time-entries?startDate=${startDate}T00:00:00Z&endDate=${endDate}T23:59:59Z`
    );
    return response.timeEntries;
  }

  async transitionTask(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE', comment?: string): Promise<Task> {
    return this.request<Task>('post', `/api/v1/tasks/${taskId}/transition`, {
      status,
      comment
    });
  }
  async fetchImage(path: string): Promise<Uint8Array> {
    if (!this.config) {
      throw new Error('API not configured');
    }

    const url = `${this.config.host_url}${path}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.token_api}`,
        }
      });

      // if (response.status === 401) {
      //   this.handleUnauthorized();
      //   throw new Error('Unauthorized - Please log in again');
      // }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error('Image fetch failed:', this.config.host_url, path);
      throw error;
    }
  }
}

export const apiService = APIService.getInstance();
