import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginModel, RegisterModel, AuthResponse } from '../../types';
import { authAPI, userAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginModel, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      if (!response.success) return rejectWithValue(response.message || 'Login failed');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterModel, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      if (!response.success) return rejectWithValue(response.message || 'Registration failed');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userJson = await AsyncStorage.getItem('user_data');
      if (token && userJson) {
        return { token, user: JSON.parse(userJson) as User };
      }
      return null;
    } catch {
      return null;
    }
  }
);

export const refreshProfile = createAsyncThunk(
  'auth/refreshProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await userAPI.getProfile();
    } catch (error: any) {
      return rejectWithValue('Failed to refresh profile');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authAPI.logout();
  await AsyncStorage.removeItem('user_data');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => { state.error = null; },
    setUser: (state, action: PayloadAction<User>) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
        state.isAuthenticated = true;
        state.error = null;
        if (action.payload.token) AsyncStorage.setItem('auth_token', action.payload.token);
        if (action.payload.user) AsyncStorage.setItem('user_data', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user ?? null;
        state.token = action.payload.token ?? null;
        state.isAuthenticated = true;
        state.error = null;
        if (action.payload.token) AsyncStorage.setItem('auth_token', action.payload.token);
        if (action.payload.user) AsyncStorage.setItem('user_data', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(refreshProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        AsyncStorage.setItem('user_data', JSON.stringify(action.payload));
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
