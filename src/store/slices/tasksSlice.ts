import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, CreateTaskData, ClaimTaskData, TaskFilter } from '../../types';
import { tasksAPI } from '../../services/api';

interface TasksState {
  availableTasks: Task[];
  myPostedTasks: Task[];
  myActiveTasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilter;
}

const initialState: TasksState = {
  availableTasks: [],
  myPostedTasks: [],
  myActiveTasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {},
};

export const fetchAvailableTasks = createAsyncThunk(
  'tasks/fetchAvailable',
  async (params: { page?: number; pageSize?: number; filters?: TaskFilter } = {}, { rejectWithValue }) => {
    try {
      return await tasksAPI.getAvailableTasks(params.page, params.pageSize, params.filters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchMyPostedTasks = createAsyncThunk(
  'tasks/fetchMyPosted',
  async (_, { rejectWithValue }) => {
    try {
      return await tasksAPI.getMyPostedTasks();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posted tasks');
    }
  }
);

export const fetchMyActiveTasks = createAsyncThunk(
  'tasks/fetchMyActive',
  async (_, { rejectWithValue }) => {
    try {
      return await tasksAPI.getMyActiveTasks();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (data: CreateTaskData, { rejectWithValue }) => {
    try {
      return await tasksAPI.createTask(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const claimTask = createAsyncThunk(
  'tasks/claim',
  async ({ taskId, helperName, helperContact }: { taskId: string; helperName: string; helperContact: string }, { rejectWithValue }) => {
    try {
      await tasksAPI.claimTask(taskId, { helperName, helperContact });
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to claim task');
    }
  }
);

export const completeTask = createAsyncThunk(
  'tasks/complete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await tasksAPI.completeTask(taskId);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete task');
    }
  }
);

export const confirmTask = createAsyncThunk(
  'tasks/confirm',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await tasksAPI.confirmTask(taskId);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to confirm task');
    }
  }
);

// Backward compat
export const fetchUserTasks = fetchMyPostedTasks;
export const acceptTask = claimTask;
export const updateTaskStatus = completeTask;
export const confirmTaskCompletion = confirmTask;

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    setFilters: (state, action: PayloadAction<TaskFilter>) => {
      state.filters = action.payload;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableTasks.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAvailableTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableTasks = action.payload;
      })
      .addCase(fetchAvailableTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyPostedTasks.fulfilled, (state, action) => {
        state.myPostedTasks = action.payload;
      })
      .addCase(fetchMyActiveTasks.fulfilled, (state, action) => {
        state.myActiveTasks = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        if (action.payload?.task) state.myPostedTasks.unshift(action.payload.task);
      });
  },
});

export const { setCurrentTask, setFilters, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
