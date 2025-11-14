import { apiClient } from './apiClient';
import { ENDPOINTS } from '../config/api';
import { Task, CreateTaskData, ClaimTaskData, TaskFilter, PaginatedResponse } from '../types';

export const tasksAPI = {
  getAvailableTasks: async (
    page: number = 1, 
    pageSize: number = 10, 
    filters?: TaskFilter
  ): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams({
      Page: page.toString(),
      PageSize: pageSize.toString()
    });

    if (filters) {
      if (filters.area) params.append('area', filters.area);
      if (filters.minBudget) params.append('minBudget', filters.minBudget.toString());
      if (filters.maxBudget) params.append('maxBudget', filters.maxBudget.toString());
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
    }

    const response = await apiClient.get(`${ENDPOINTS.TASKS.AVAILABLE}?${params}`);
    return {
      ...response.data,
      data: response.data.tasks || response.data.data
    };
  },

  getUserTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get(ENDPOINTS.TASKS.MY_TASKS);
    return response.data.tasks || response.data;
  },

  getTaskDetails: async (taskId: string): Promise<Task> => {
    const response = await apiClient.get(ENDPOINTS.TASKS.DETAILS(taskId));
    return response.data;
  },

  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    const response = await apiClient.post(ENDPOINTS.TASKS.CREATE, taskData);
    return response.data;
  },

  claimTask: async (taskId: string, claimData: ClaimTaskData): Promise<Task> => {
    const response = await apiClient.patch(ENDPOINTS.TASKS.CLAIM(taskId), claimData);
    return response.data;
  },

  updateTaskStatus: async (taskId: string, status: string): Promise<Task> => {
    const response = await apiClient.patch(ENDPOINTS.TASKS.UPDATE_STATUS(taskId), { status });
    return response.data;
  }
};