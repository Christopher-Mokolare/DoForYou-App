import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { adminAPI, AdminStats } from '../services/adminService';

interface AdminDashboardScreenProps {
  navigation: any;
}

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ navigation }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const MenuButton = ({ title, icon, onPress, color }: {
    title: string;
    icon: string;
    onPress: () => void;
    color: string;
  }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  if (!user?.isAdmin) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Ionicons name="shield-outline" size={64} color="#ccc" />
        <Text style={styles.unauthorizedTitle}>Access Denied</Text>
        <Text style={styles.unauthorizedMessage}>
          You don't have permission to access the admin dashboard
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#ff6b35', '#ff8c42', '#ffa726']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchStats} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back, Admin!</Text>
          <Text style={styles.welcomeSubtext}>Here's your system overview</Text>
        </View>

        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="people"
                color="#007bff"
              />
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon="list"
                color="#28a745"
              />
            </View>
            
            <View style={styles.statsRow}>
              <StatCard
                title="Active Tasks"
                value={stats.activeTasks}
                icon="time"
                color="#ffc107"
              />
              <StatCard
                title="Completed"
                value={stats.completedTasks}
                icon="checkmark-circle"
                color="#17a2b8"
              />
            </View>
            
            <View style={styles.statsRow}>
              <StatCard
                title="Total Revenue"
                value={`R${stats.totalRevenue.toLocaleString()}`}
                icon="card"
                color="#ff6b35"
              />
              <StatCard
                title="Pending Payments"
                value={stats.pendingPayments}
                icon="hourglass"
                color="#dc3545"
              />
            </View>
          </View>
        )}

        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>Management</Text>
          
          <MenuButton
            title="User Management"
            icon="people"
            color="#007bff"
            onPress={() => navigation.navigate('AdminUsers')}
          />
          
          <MenuButton
            title="Task Management"
            icon="list"
            color="#28a745"
            onPress={() => navigation.navigate('AdminTasks')}
          />
          
          <MenuButton
            title="Payment Management"
            icon="card"
            color="#ff6b35"
            onPress={() => navigation.navigate('AdminPayments')}
          />
          
          <MenuButton
            title="System Settings"
            icon="settings"
            color="#6c757d"
            onPress={() => navigation.navigate('AdminSettings')}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  menuSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#f5f5f5',
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  unauthorizedMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default AdminDashboardScreen;