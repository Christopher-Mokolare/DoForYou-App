import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAvailableTasks, claimTask, setCurrentTask } from '../store/slices/tasksSlice';
import { Task, TaskFilter, Priority } from '../types';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { availableTasks, isLoading, filters } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<TaskFilter>({});

  useEffect(() => {
    dispatch(fetchAvailableTasks({}));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAvailableTasks({}));
  };

  const handleTaskPress = (task: Task) => {
    dispatch(setCurrentTask(task));
    navigation.navigate('TaskDetails', { task });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return '#007bff';
      case 'claimed': return '#ffc107';
      case 'in_progress': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'urgent': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return 'flash';
      case 'low': return 'time';
      default: return 'list';
    }
  };

  const filteredTasks = availableTasks.filter(task => {
    if (searchTerm && !task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !task.area.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (localFilters.minBudget && task.budget < localFilters.minBudget) return false;
    if (localFilters.maxBudget && task.budget > localFilters.maxBudget) return false;
    if (localFilters.priority && task.priority !== localFilters.priority) return false;
    if (localFilters.area && !task.area.toLowerCase().includes(localFilters.area.toLowerCase())) return false;
    return task.taskStatus === 'posted';
  });

  const handleClaimTask = async (task: Task) => {
    if (task.createdByUserId === user?.id) {
      Alert.alert('Error', 'You cannot claim your own task');
      return;
    }

    if (!user?.canAcceptTasks) {
      Alert.alert('Error', 'You need to enable task runner mode in settings');
      return;
    }

    Alert.alert(
      'Claim Task',
      `Do you want to claim this task?\n\nYou will receive: R${(task.budget * 0.85).toFixed(2)}\nPlatform fee: R${(task.budget * 0.15).toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim Task',
          onPress: async () => {
            try {
              await dispatch(claimTask({
                taskId: task.id,
                helperName: user.name,
                helperContact: user.contact
              })).unwrap();
              Alert.alert('Success', 'Task claimed successfully!');
            } catch (error: any) {
              Alert.alert('Error', error || 'Failed to claim task');
            }
          }
        }
      ]
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskCard} onPress={() => handleTaskPress(item)}>
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleRow}>
          <Ionicons 
            name={getPriorityIcon(item.priority)} 
            size={16} 
            color={getStatusColor(item.priority)} 
            style={styles.priorityIcon}
          />
          <Text style={styles.taskTitle} numberOfLines={1}>{item.taskDescription}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.taskPrice}>R{item.budget}</Text>
          <Text style={styles.runnerAmount}>You get: R{(item.budget * 0.85).toFixed(0)}</Text>
        </View>
      </View>
      
      {item.notes && (
        <Text style={styles.taskNotes} numberOfLines={2}>
          {item.notes}
        </Text>
      )}
      
      <View style={styles.taskMeta}>
        <View style={styles.taskInfo}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.taskArea}>{item.area}</Text>
        </View>
        <View style={styles.taskInfo}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.taskDate}>
            {new Date(item.dateNeeded).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.taskFooter}>
        <View style={styles.posterInfo}>
          <Text style={styles.posterName}>By: {item.createdByUserName}</Text>
        </View>
        <TouchableOpacity
          style={[styles.claimButton, item.priority === 'urgent' && styles.urgentButton]}
          onPress={() => handleClaimTask(item)}
        >
          <Text style={styles.claimButtonText}>
            {item.priority === 'urgent' ? 'Claim Urgent' : 'Claim Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Tasks</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#ff6b35" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks or areas..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredTasks.length} tasks available
        </Text>
        {user?.canAcceptTasks && (
          <View style={styles.runnerBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#28a745" />
            <Text style={styles.runnerText}>Runner Mode</Text>
          </View>
        )}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No tasks available</Text>
            <Text style={styles.emptySubtitle}>Check back later for new opportunities</Text>
          </View>
        }
      />
      
      <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filter Tasks</Text>
            <TouchableOpacity onPress={() => {
              setLocalFilters({});
              setShowFilters(false);
            }}>
              <Text style={styles.modalApply}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterContent}>
            <Text style={styles.filterLabel}>Budget Range</Text>
            <View style={styles.budgetInputs}>
              <TextInput
                style={styles.budgetInput}
                placeholder="Min R"
                value={localFilters.minBudget?.toString() || ''}
                onChangeText={(text) => setLocalFilters({...localFilters, minBudget: parseInt(text) || undefined})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.budgetInput}
                placeholder="Max R"
                value={localFilters.maxBudget?.toString() || ''}
                onChangeText={(text) => setLocalFilters({...localFilters, maxBudget: parseInt(text) || undefined})}
                keyboardType="numeric"
              />
            </View>
            
            <Text style={styles.filterLabel}>Priority</Text>
            <View style={styles.priorityButtons}>
              {(['standard', 'urgent', 'low'] as Priority[]).map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[styles.priorityButton, localFilters.priority === priority && styles.priorityButtonActive]}
                  onPress={() => setLocalFilters({...localFilters, priority: localFilters.priority === priority ? undefined : priority})}
                >
                  <Text style={[styles.priorityButtonText, localFilters.priority === priority && styles.priorityButtonTextActive]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  runnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  runnerText: {
    fontSize: 12,
    color: '#28a745',
    marginLeft: 4,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    marginBottom: 12,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityIcon: {
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  taskPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  runnerAmount: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  taskNotes: {
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
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskArea: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 12,
    color: '#666',
  },
  claimButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  urgentButton: {
    backgroundColor: '#dc3545',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalApply: {
    fontSize: 16,
    color: '#ff6b35',
    fontWeight: '600',
  },
  filterContent: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
  },
  budgetInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  budgetInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  priorityButtonActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#666',
  },
  priorityButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
});

export default HomeScreen;