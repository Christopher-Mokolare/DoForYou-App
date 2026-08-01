import { apiClient } from './apiClient';
import { ENDPOINTS } from '../config/api';
import { Task, CreateTaskData, ClaimTaskData, TaskFilter, PaginatedResponse } from '../types';

export const tasksAPI = {
  getAvailableTasks: async (
    page: number = 1, 
    pageSize: number = 10, 
    filters?: TaskFilter
  ): Promise<PaginatedResponse<Task>> => {
    const response = await apiClient.get(ENDPOINTS.TASKS.AVAILABLE);
    const tasks = Array.isArray(response.data) ? response.data : [];
    
    return {
      data: tasks.map((errand: any) => ({
        id: errand._id,
        title: errand.title,
        description: errand.description,
        category: errand.category,
        budget: errand.price,
        status: errand.status,
        createdAt: errand.createdAt,
        updatedAt: errand.updatedAt,
        posterName: errand.poster?.name || 'Unknown',
        posterRating: errand.poster?.rating || 0
      })),
      totalCount: tasks.length,
      page: 1,
      pageSize: tasks.length
    };
  },

  getUserTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get(ENDPOINTS.TASKS.MY_TASKS);
    const tasks = Array.isArray(response.data) ? response.data : [];
    
    return tasks.map((errand: any) => ({
      id: errand._id,
      title: errand.title,
      description: errand.description,
      category: errand.category,
      budget: errand.price,
      status: errand.status,
      createdAt: errand.createdAt,
      updatedAt: errand.updatedAt,
      posterName: errand.poster?.name || 'Unknown',
      posterRating: errand.poster?.rating || 0
    }));
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