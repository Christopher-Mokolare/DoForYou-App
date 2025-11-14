import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, Errand, CreateTaskData, TaskFilter, TaskStatus } from '../../types';
import { tasksAPI, errandAPI } from '../../services/api';

interface TasksState {
  availableTasks: Task[];
  userTasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilter;
  paymentBreakdown: {
    originalAmount: number;
    platformFee: number;
    runnerAmount: number;
  } | null;
}

const initialState: TasksState = {
  availableTasks: [],
  userTasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {},
  paymentBreakdown: null
};

export const fetchAvailableTasks = createAsyncThunk(
  'tasks/fetchAvailable',
  async (params: { page?: number; pageSize?: number } = {}, { rejectWithValue }) => {
    try {
      const tasks = await tasksAPI.getAvailableTasks(params.page, params.pageSize);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await tasksAPI.getMyTasks();
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: CreateTaskData, { rejectWithValue }) => {
    try {
      const task = await tasksAPI.createTask(taskData);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const claimTask = createAsyncThunk(
  'tasks/claim',
  async ({ taskId, helperName, helperContact }: { taskId: number; helperName: string; helperContact: string }, { rejectWithValue }) => {
    try {
      const task = await tasksAPI.claimTask(taskId, { helperName, helperContact });
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to claim task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ taskId, status }: { taskId: number; status: TaskStatus }, { rejectWithValue }) => {
    try {
      const task = await tasksAPI.updateTaskStatus(taskId, status);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status');
    }
  }
);

export const confirmTaskCompletion = createAsyncThunk(
  'tasks/confirmCompletion',
  async ({ taskId, confirmed }: { taskId: number; confirmed: boolean }, { rejectWithValue }) => {
    try {
      const task = await tasksAPI.confirmCompletion(taskId, confirmed);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to confirm task completion');
    }
  }
);

// Backward compatibility
export const acceptTask = claimTask;

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    updateTaskInList: (state, action: PayloadAction<Task>) => {
      const taskIndex = state.availableTasks.findIndex(t => t.id === action.payload.id);
      if (taskIndex !== -1) {
        state.availableTasks[taskIndex] = action.payload;
      }
    },
    calculatePaymentBreakdown: (state, action: PayloadAction<number>) => {
      const originalAmount = action.payload;
      const platformFee = originalAmount * 0.15;
      const runnerAmount = originalAmount * 0.85;
      state.paymentBreakdown = {
        originalAmount,
        platformFee,
        runnerAmount
      };
    },
    setFilters: (state, action: PayloadAction<TaskFilter>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableTasks = action.payload;
      })
      .addCase(fetchAvailableTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.userTasks = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.userTasks.push(action.payload);
      })
      .addCase(claimTask.fulfilled, (state, action) => {
        const taskIndex = state.availableTasks.findIndex(t => t.id === action.payload.id);
        if (taskIndex !== -1) {
          state.availableTasks[taskIndex] = action.payload;
        }
        state.userTasks.push(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const taskIndex = state.userTasks.findIndex(t => t.id === action.payload.id);
        if (taskIndex !== -1) {
          state.userTasks[taskIndex] = action.payload;
        }
      })
      .addCase(confirmTaskCompletion.fulfilled, (state, action) => {
        const taskIndex = state.userTasks.findIndex(t => t.id === action.payload.id);
        if (taskIndex !== -1) {
          state.userTasks[taskIndex] = action.payload;
        }
      });
  }
});

export const { setCurrentTask, setFilters, clearError, updateTaskInList, calculatePaymentBreakdown } = tasksSlice.actions;
export default tasksSlice.reducer;