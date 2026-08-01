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
    if (task.createdByUserId === user?.id) {
      Alert.alert('Error', 'You cannot accept your own task');
      return;
    }

    Alert.alert(
      'Accept Task',
      `Do you want to accept "${task.taskTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await dispatch(acceptTask(task.id)).unwrap();
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

  const canAcceptTask = task.taskStatus === 'posted' && task.createdByUserId !== user?.id;
  const canConfirmCompletion = task.taskStatus === 'completed' && task.createdByUserId === user?.id;
  const canMarkCompleted = task.taskStatus === 'in_progress' && task.acceptedByUserId === user?.id;
  const canAppeal = task.taskStatus === 'rejected' && task.acceptedByUserId === user?.id;
  const canRate = (task.taskStatus === 'runner_paid' || task.taskStatus === 'confirmed') && 
                  (task.createdByUserId === user?.id || task.acceptedByUserId === user?.id);

  const handleMarkCompleted = () => {
    Alert.alert(
      'Mark as Completed',
      'Are you sure you have completed this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Completed',
          onPress: () => {
            // Update task status to completed
            navigation.navigate('TaskRating', { task, userType: 'runner' });
          }
        }
      ]
    );
  };

  const handleConfirmCompletion = () => {
    navigation.navigate('TaskConfirmation', { task });
  };

  const handleAppeal = () => {
    navigation.navigate('TaskAppeal', { task });
  };

  const handleRate = () => {
    const userType = task.createdByUserId === user?.id ? 'creator' : 'runner';
    navigation.navigate('TaskRating', { task, userType });
  };

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
            <Text style={styles.taskTitle}>{task.taskTitle}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.taskStatus) }]}>
              <Text style={styles.statusText}>{task.taskStatus}</Text>
            </View>
          </View>

          <Text style={styles.taskPrice}>R{task.budget}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.taskDescription}>{task.taskDescription}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Area</Text>
            <Text style={styles.taskCategory}>{task.area}</Text>
          </View>

          {task.createdByUser && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Posted by</Text>
              <View style={styles.posterInfo}>
                <View style={styles.posterAvatar}>
                  <Text style={styles.posterInitial}>
                    {task.createdByUser.firstName?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.posterName}>{task.createdByUser.firstName} {task.createdByUser.lastName}</Text>
                  <Text style={styles.posterEmail}>{task.createdByUser.email}</Text>
                </View>
              </View>
            </View>
          )}

          {task.acceptedByUser && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assigned to</Text>
              <View style={styles.posterInfo}>
                <View style={styles.posterAvatar}>
                  <Text style={styles.posterInitial}>
                    {task.acceptedByUser.firstName?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.posterName}>{task.acceptedByUser.firstName} {task.acceptedByUser.lastName}</Text>
                  <Text style={styles.posterEmail}>{task.acceptedByUser.email}</Text>
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

        {canMarkCompleted && (
          <TouchableOpacity style={styles.completeButton} onPress={handleMarkCompleted}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.completeButtonText}>Mark as Completed</Text>
          </TouchableOpacity>
        )}

        {canConfirmCompletion && (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmCompletion}>
            <Ionicons name="clipboard-outline" size={20} color="white" />
            <Text style={styles.confirmButtonText}>Review Completion</Text>
          </TouchableOpacity>
        )}

        {canAppeal && (
          <TouchableOpacity style={styles.appealButton} onPress={handleAppeal}>
            <Ionicons name="megaphone-outline" size={20} color="white" />
            <Text style={styles.appealButtonText}>Appeal Rejection</Text>
          </TouchableOpacity>
        )}

        {canRate && (
          <TouchableOpacity style={styles.rateButton} onPress={handleRate}>
            <Ionicons name="star-outline" size={20} color="white" />
            <Text style={styles.rateButtonText}>Rate Experience</Text>
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
  completeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appealButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appealButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  rateButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TaskDetailsScreen;