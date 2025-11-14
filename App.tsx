import React, { memo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View } from 'react-native';

import { store, persistor } from './src/store';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoadingSpinner from './src/components/LoadingSpinner';
import { usePolling } from './src/hooks/usePolling';
import { testNetworkConnection } from './src/utils/networkTest';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import PostTaskScreen from './src/screens/PostTaskScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MyTasksScreen from './src/screens/MyTasksScreen';
import AdminScreen from './src/screens/AdminScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import SupportScreen from './src/screens/SupportScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = memo(() => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
});

const tabScreenOptions = {
  tabBarActiveTintColor: '#ff6b35',
  tabBarInactiveTintColor: '#666',
  headerStyle: {
    backgroundColor: '#ff6b35',
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const MainTabs = memo(() => {
  return <MainTabNavigator />;
});

const stackScreenOptions = {
  headerStyle: {
    backgroundColor: '#ff6b35',
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const MainStack = memo(() => {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PostTask" 
        component={PostTaskScreen} 
        options={{ title: 'Post Task' }}
      />
      <Stack.Screen 
        name="TaskDetails" 
        component={TaskDetailsScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
});

function AppNavigator() {
  const { user, loading } = useAuth();
  
  // Test network connection on startup
  React.useEffect(() => {
    testNetworkConnection();
  }, []);
  
  // Initialize polling for real-time updates
  usePolling(30000); // Poll every 30 seconds

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
            <ActivityIndicator size="large" color="#ff6b35" />
          </View>
        } 
        persistor={persistor}
      >
        <AuthProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
