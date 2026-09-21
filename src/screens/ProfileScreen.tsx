import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout, logoutUser } from '../store/slices/authSlice';
import { AppDispatch } from '../store';
import { clearTokens } from '../utils/tokenStorage';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Force logout regardless of API response
            await clearTokens();
            dispatch(logout());
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      title: 'Bank Details',
      icon: 'card-outline',
      onPress: () => navigation.navigate('BankDetails'),
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Support'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.userName}>{user ? `${user.firstName} ${user.lastName}` : 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.completedTasks || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.rating?.toFixed(1) || '0.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user?.userType || 'User'}</Text>
            <Text style={styles.statLabel}>Role</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon as any} size={24} color="#666" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#ff4757" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ProfileScreen;