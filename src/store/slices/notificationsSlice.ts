import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserNotification } from '../../types';
import { notificationsAPI } from '../../services/api';

interface NotificationsState { notifications: UserNotification[]; unreadCount: number; isLoading: boolean; }
const initialState: NotificationsState = { notifications: [], unreadCount: 0, isLoading: false };

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try { return await notificationsAPI.getAll(); }
  catch (error: any) { return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications'); }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<UserNotification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) { notification.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
    },
    markAllAsRead: (state) => { state.notifications.forEach(n => { n.isRead = true; }); state.unreadCount = 0; },
    clearNotifications: (state) => { state.notifications = []; state.unreadCount = 0; }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => { state.isLoading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, state => { state.isLoading = false; });
  }
});
export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
