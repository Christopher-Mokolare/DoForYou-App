import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUserTasks } from '../store/slices/tasksSlice';
import { errandAPI } from '../services/api';
import { Task } from '../types';

const MyTasksScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userTasks, isLoading } = useSelector((state: RootState) => state.tasks);
  const [filter, setFilter] = useState<'all' | 'posted' | 'completed'>('all');

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  useEffect(() => {
    console.log('MyTasksScreen: Total user tasks:', userTasks.length);
    console.log('MyTasksScreen: Current filter:', filter);
  }, [userTasks, filter]);

  const handleRefresh = () => {
    dispatch(fetchUserTasks());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return '#007bff';
      case 'claimed': return '#ffc107';
      case 'in_progress': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'confirmed': return '#6f42c1';
      case 'cancelled': return '#dc3545';
      case 'draft': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const filteredTasks = userTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'posted') return task.taskStatus === 'posted';
    if (filter === 'completed') return ['completed', 'confirmed', 'runner_paid'].includes(task.taskStatus);
    return true;
  });

  const handleConfirmCompletion = async (taskId: number) => {
    Alert.alert(
      'Confirm Task Completion',
      'Are you satisfied with the work? This will release payment to the runner.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay',
          onPress: async () => {
            try {
              await errandAPI.confirmErrand(taskId.toString());
              Alert.alert('Success', 'Task confirmed and payment released!');
              dispatch(fetchUserTasks());
            } catch (error) {
              Alert.alert('Error', 'Failed to confirm task completion');
            }
          }
        }
      ]
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetails', { task: item })}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.taskTitle || item.taskDescription}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.taskStatus) }]}>
          <Text style={styles.statusText}>{item.taskStatus}</Text>
        </View>
      </View>
      
      <Text style={styles.taskDescription} numberOfLines={2}>
        {item.taskDescription || item.notes || 'No additional notes'}
      </Text>
      
      <View style={styles.taskMeta}>
        <Text style={styles.taskArea}>📍 {item.area}</Text>
        <Text style={styles.taskDate}>📅 {new Date(item.dateNeeded).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.taskFooter}>
        <Text style={styles.taskPrice}>R{item.budget}</Text>
        {item.helperName && (
          <View style={styles.assigneeInfo}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.assigneeText}>{item.helperName}</Text>
          </View>
        )}
      </View>
      
      {item.taskStatus === 'completed' && (
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => handleConfirmCompletion(item.id)}
        >
          <Text style={styles.confirmButtonText}>Confirm & Release Payment</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'posted', 'completed'].map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.activeFilter
            ]}
            onPress={() => setFilter(filterType as any)}
          >
            <Text style={[
              styles.filterText,
              filter === filterType && styles.activeFilterText
            ]}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f8f9fa',
  },
  activeFilter: {
    backgroundColor: '#ff6b35',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  listContainer: {
    padding: 15,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  taskArea: {
    fontSize: 12,
    color: '#666',
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  assigneeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default MyTasksScreen;