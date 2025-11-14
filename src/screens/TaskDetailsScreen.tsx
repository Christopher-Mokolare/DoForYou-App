import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { acceptTask } from '../store/slices/tasksSlice';

const TaskDetailsScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { task } = route.params;

  const handleAcceptTask = async () => {
    if (task.poster && user && task.poster.id === user.id) {
      Alert.alert('Error', 'You cannot accept your own task');
      return;
    }

    Alert.alert(
      'Accept Task',
      `Do you want to accept "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await dispatch(acceptTask(task._id)).unwrap();
              Alert.alert('Success', 'Task accepted successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error: any) {
              Alert.alert('Error', error || 'Failed to accept task');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return '#007bff';
      case 'claimed': return '#ffc107';
      case 'in_progress': return '#17a2b8';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  const canAcceptTask = task.status === 'posted' && (!task.poster || task.poster.id !== user?.id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
              <Text style={styles.statusText}>{task.status}</Text>
            </View>
          </View>

          <Text style={styles.taskPrice}>R{task.price}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <Text style={styles.taskCategory}>{task.category}</Text>
          </View>

          {task.poster && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Posted by</Text>
              <View style={styles.posterInfo}>
                <View style={styles.posterAvatar}>
                  <Text style={styles.posterInitial}>
                    {task.poster.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.posterName}>{task.poster.name}</Text>
                  <Text style={styles.posterEmail}>{task.poster.email}</Text>
                </View>
              </View>
            </View>
          )}

          {task.assignee && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assigned to</Text>
              <View style={styles.posterInfo}>
                <View style={styles.posterAvatar}>
                  <Text style={styles.posterInitial}>
                    {task.assignee.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.posterName}>{task.assignee.name}</Text>
                  <Text style={styles.posterEmail}>{task.assignee.email}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {canAcceptTask && (
          <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptTask}>
            <Text style={styles.acceptButtonText}>Accept Task</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  taskPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  taskCategory: {
    fontSize: 16,
    color: '#666',
  },
  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  posterInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  posterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  posterEmail: {
    fontSize: 14,
    color: '#666',
  },
  acceptButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TaskDetailsScreen;