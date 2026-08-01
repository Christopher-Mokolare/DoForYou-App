import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { tasksAPI } from '../services/api';
import { updateTaskStatus } from '../store/slices/tasksSlice';
import { commonStyles } from '../styles/commonStyles';
import { Task } from '../types';

interface Props {
  navigation: any;
  route: any;
}

const TaskConfirmationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { task }: { task: Task } = route.params;
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleConfirmation = async (confirmed: boolean) => {
    setLoading(true);
    try {
      const confirmationData = {
        taskId: task.id,
        confirmed,
        reason: confirmed ? undefined : reason.trim()
      };

      const updatedTask = await tasksAPI.confirmCompletion(task.id, confirmationData);
      dispatch(updateTaskStatus({ taskId: task.id, status: updatedTask.taskStatus }));

      if (confirmed) {
        Alert.alert(
          'Task Confirmed!',
          `Payment of R${task.runnerAmount} has been processed to the runner.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Task Rejected',
          'The runner has been notified and can appeal this decision.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to process confirmation');
    } finally {
      setLoading(false);
    }
  };

  const paymentBreakdown = {
    originalAmount: task.budget,
    platformFee: task.platformFee,
    runnerAmount: task.runnerAmount
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={commonStyles.colors.primary} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Confirm Completion</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Task Details</Text>
          <Text style={commonStyles.taskDescription}>{task.taskDescription}</Text>
          <Text style={commonStyles.taskArea}>Area: {task.area}</Text>
          <Text style={commonStyles.taskHelper}>Completed by: {task.helperName}</Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Payment Breakdown</Text>
          <View style={commonStyles.paymentRow}>
            <Text>Original Amount:</Text>
            <Text style={commonStyles.amount}>R{paymentBreakdown.originalAmount}</Text>
          </View>
          <View style={commonStyles.paymentRow}>
            <Text>Platform Fee (15%):</Text>
            <Text style={commonStyles.fee}>-R{paymentBreakdown.platformFee}</Text>
          </View>
          <View style={[commonStyles.paymentRow, commonStyles.totalRow]}>
            <Text style={commonStyles.totalText}>Runner Payment:</Text>
            <Text style={commonStyles.totalAmount}>R{paymentBreakdown.runnerAmount}</Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Has this task been completed satisfactorily?</Text>
          
          <TouchableOpacity
            style={[commonStyles.confirmButton, loading && commonStyles.disabledButton]}
            onPress={() => handleConfirmation(true)}
            disabled={loading}
          >
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text style={commonStyles.confirmButtonText}>
              YES - Task Completed (Pay Runner)
            </Text>
          </TouchableOpacity>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Reason for rejection (if NO):</Text>
            <TextInput
              style={[commonStyles.input, commonStyles.textArea]}
              value={reason}
              onChangeText={setReason}
              placeholder="Explain why the task is not completed satisfactorily..."
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={[commonStyles.rejectButton, loading && commonStyles.disabledButton]}
            onPress={() => handleConfirmation(false)}
            disabled={loading || !reason.trim()}
          >
            <Ionicons name="close-circle" size={24} color="white" />
            <Text style={commonStyles.rejectButtonText}>
              NO - Task Not Completed
            </Text>
          </TouchableOpacity>
        </View>

        <View style={commonStyles.warningCard}>
          <Ionicons name="information-circle" size={24} color={commonStyles.colors.warning} />
          <Text style={commonStyles.warningText}>
            If you select NO, the runner can appeal this decision to admin for review.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskConfirmationScreen;