import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

const isKeychainAvailable = Platform.OS === 'ios' && Keychain && Keychain.getInternetCredentials;

export const storeTokens = async (token: string, refreshToken: string): Promise<void> => {
  try {
    if (isKeychainAvailable) {
      await Keychain.setInternetCredentials(TOKEN_KEY, 'token', token);
      await Keychain.setInternetCredentials(REFRESH_TOKEN_KEY, 'refreshToken', refreshToken);
    } else {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    if (isKeychainAvailable) {
      const credentials = await Keychain.getInternetCredentials(TOKEN_KEY);
      if (credentials) {
        return credentials.password;
      }
    }
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return await AsyncStorage.getItem(TOKEN_KEY);
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    if (isKeychainAvailable) {
      const credentials = await Keychain.getInternetCredentials(REFRESH_TOKEN_KEY);
      if (credentials) {
        return credentials.password;
      }
    }
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    if (isKeychainAvailable) {
      await Keychain.resetInternetCredentials(TOKEN_KEY);
      await Keychain.resetInternetCredentials(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error clearing tokens from Keychain:', error);
  }
  
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_DATA_KEY);
};

export const storeUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};