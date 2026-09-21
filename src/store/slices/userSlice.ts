import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences } from '../../types';
import { userAPI } from '../../services/api';

interface UserState {
  profile: User | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  preferences: null,
  isLoading: false,
  error: null
};

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      await userAPI.updateProfile(userData);
      return await userAPI.getProfile();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);


export const fetchUserPreferences = createAsyncThunk(
  'user/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try { return await userAPI.getPreferences(); }
    catch (error: any) { return rejectWithValue(error.response?.data?.message || 'Failed to load preferences'); }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserPreferences>, { rejectWithValue }) => {
    try { await userAPI.updatePreferences(preferences); return await userAPI.getPreferences(); }
    catch (error: any) { return rejectWithValue(error.response?.data?.message || 'Failed to update preferences'); }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    setPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => { state.preferences = action.payload; })
      .addCase(updateUserPreferences.fulfilled, (state, action) => { state.preferences = action.payload; })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setProfile, setPreferences, clearError } = userSlice.actions;
export default userSlice.reducer;