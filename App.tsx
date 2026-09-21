import React, { memo, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View } from 'react-native';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { crashReporting } from './src/services/crashReportingService';
import { pushNotificationService } from './src/services/pushNotificationService';
import { store, persistor } from './src/store';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoadingSpinner from './src/components/LoadingSpinner';
import { usePolling } from './src/hooks/usePolling';
import { testNetworkConnection } from './src/utils/networkTest';
import { testBackendConnection } from './src/utils/testConnection';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import PostTaskScreen from './src/screens/PostTaskScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import SupportScreen from './src/screens/SupportScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import TaskConfirmationScreen from './src/screens/TaskConfirmationScreen';
import TaskRatingScreen from './src/screens/TaskRatingScreen';
import TaskAppealScreen from './src/screens/TaskAppealScreen';
import BankDetailsScreen from './src/screens/BankDetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator();

const AuthStack = memo(() => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
  </Stack.Navigator>
));

const stackScreenOptions = {
  headerStyle: { backgroundColor: '#ff6b35' },
  headerTintColor: 'white',
  headerTitleStyle: { fontWeight: 'bold' as const },
};

const MainStack = memo(() => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="PostTask" component={PostTaskScreen} options={{ title: 'Post Task' }} />
    <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: false }} />
    <Stack.Screen name="TaskConfirmation" component={TaskConfirmationScreen} options={{ headerShown: false }} />
    <Stack.Screen name="TaskRating" component={TaskRatingScreen} options={{ headerShown: false }} />
    <Stack.Screen name="TaskAppeal" component={TaskAppealScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BankDetails" component={BankDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
));

function AppNavigator() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const testConnections = async () => {
      await testNetworkConnection();
      const backendTest = await testBackendConnection();
      if (backendTest.success) console.log('Backend connection successful:', backendTest.message);
      else console.warn('Backend connection failed:', backendTest.message);
    };
    testConnections();
  }, []);

  usePolling(30000);

  if (isLoading) return <LoadingSpinner />;
  return <NavigationContainer>{user ? <MainStack /> : <AuthStack />}</NavigationContainer>;
}

export default function App() {
  useEffect(() => {
    crashReporting.initialize();
    pushNotificationService.initialize();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}><ActivityIndicator size="large" color="#ff6b35" /></View>} persistor={persistor}>
          <AuthProvider>
            <StatusBar style="light" />
            <AppNavigator />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
