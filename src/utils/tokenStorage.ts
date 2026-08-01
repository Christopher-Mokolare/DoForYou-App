import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const storeTokens = async (token: string, _refreshToken?: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = async (): Promise<string | null> => null;

export const clearTokens = async (): Promise<void> => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_DATA_KEY]);
};

export const storeUserData = async (userData: any): Promise<void> => {
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const getUserData = async (): Promise<any | null> => {
  const data = await AsyncStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
};
