import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { login, register, logout as logoutAction, initializeAuth } from '../store/slices/authSlice';
import { LoginModel, RegisterModel, User } from '../types';
import { storeTokens, clearTokens } from '../utils/tokenStorage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginModel) => Promise<void>;
  register: (userData: RegisterModel) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => { dispatch(initializeAuth()); }, [dispatch]);

  useEffect(() => {
    if (token) void storeTokens(token, '');
  }, [token]);

  const handleLogin = async (credentials: LoginModel) => {
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      const { token } = result.payload;
      if (token) await storeTokens(token, '');
    } else {
      throw new Error(result.payload as string);
    }
  };

  const handleRegister = async (userData: RegisterModel) => {
    const result = await dispatch(register(userData));
    if (!register.fulfilled.match(result)) throw new Error(result.payload as string);
  };

  const handleLogout = async () => {
    await clearTokens();
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, login: handleLogin, register: handleRegister, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
