import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUserTasks } from '../store/slices/tasksSlice';
import { Errand } from '../types';

const MyTasksScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userTasks, isLoading } = useSelector((state: RootState) => state.tasks);
  const [filter, setFilter] = useState<'all' | 'posted' | 'accepted'>('all');

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

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
      default: return '#6c757d';
    }
  };

  const filteredTasks = userTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'posted') return task.status === 'posted';
    if (filter === 'accepted') return task.assignee;
    return true;
  });

  const renderTask = ({ item }: { item: Errand }) => (
    <TouchableOpacity 
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetails', { task: item })}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.taskDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.taskFooter}>
        <Text style={styles.taskPrice}>R{item.price}</Text>
        {item.assignee && (
          <View style={styles.assigneeInfo}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.assigneeText}>{item.assignee.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'posted', 'accepted'].map((filterType) => (
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
        keyExtractor={(item) => item._id}
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
});

export default MyTasksScreen;