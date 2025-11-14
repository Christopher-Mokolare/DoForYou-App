import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

import HomeScreen from '../screens/HomeScreen';
import MyTasksScreen from '../screens/MyTasksScreen';
import PostTaskScreen from '../screens/PostTaskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.isAdmin || false;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyTasks') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'PostTask') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff6b35',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Browse Tasks' }} />
      <Tab.Screen name="MyTasks" component={MyTasksScreen} options={{ title: 'My Tasks' }} />
      <Tab.Screen name="PostTask" component={PostTaskScreen} options={{ title: 'Post Task' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {isAdmin && (
        <Tab.Screen name="Admin" component={AdminScreen} />
      )}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;