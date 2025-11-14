import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAvailableTasks, fetchUserTasks } from '../store/slices/tasksSlice';

export const usePolling = (intervalMs: number = 30000) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const pollData = () => {
      dispatch(fetchAvailableTasks({}));
      dispatch(fetchUserTasks());
    };

    // Initial fetch
    pollData();

    // Set up polling
    intervalRef.current = setInterval(pollData, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, dispatch, intervalMs]);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startPolling = () => {
    if (!intervalRef.current && isAuthenticated) {
      intervalRef.current = setInterval(() => {
        dispatch(fetchAvailableTasks({}));
        dispatch(fetchUserTasks());
      }, intervalMs);
    }
  };

  return { stopPolling, startPolling };
};