import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

class BiometricService {
  async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    return LocalAuthentication.supportedAuthenticationTypesAsync();
  }

  async authenticate(reason = 'Authenticate to access your account'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  async storeCredentials(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value, {
        requireAuthentication: true,
        authenticationPrompt: 'Authenticate to save credentials',
      });
    } catch (error) {
      console.error('Error storing credentials:', error);
      throw error;
    }
  }

  async getCredentials(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key, {
        requireAuthentication: true,
        authenticationPrompt: 'Authenticate to access credentials',
      });
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  }

  async deleteCredentials(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error deleting credentials:', error);
    }
  }
}

export const biometricService = new BiometricService();
