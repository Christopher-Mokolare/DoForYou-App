import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tasksAPI } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import { Task } from '../types';

interface Props {
  navigation: any;
  route: any;
}

const TaskAppealScreen: React.FC<Props> = ({ navigation, route }) => {
  const { task }: { task: Task } = route.params;
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAppeal = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for your appeal');
      return;
    }

    setLoading(true);
    try {
      await tasksAPI.appealTask(task.id, reason.trim());
      Alert.alert(
        'Appeal Submitted',
        'Your appeal has been submitted to admin for review. You will be notified within 24 hours.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit appeal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={commonStyles.colors.primary} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Appeal Task Rejection</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Task Details</Text>
          <Text style={commonStyles.taskDescription}>{task.taskDescription}</Text>
          <Text style={commonStyles.taskArea}>Area: {task.area}</Text>
          <Text style={commonStyles.taskBudget}>Payment: R{task.runnerAmount}</Text>
        </View>

        <View style={commonStyles.warningCard}>
          <Ionicons name="information-circle" size={24} color={commonStyles.colors.warning} />
          <Text style={commonStyles.warningText}>
            The task creator has rejected your completion. You can appeal this decision to admin for review.
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Appeal Reason</Text>
          <Text style={commonStyles.subtitle}>
            Explain why you believe the task was completed satisfactorily:
          </Text>
          
          <TextInput
            style={[commonStyles.input, commonStyles.textArea]}
            value={reason}
            onChangeText={setReason}
            placeholder="Provide detailed explanation of why the task should be considered complete..."
            multiline
            numberOfLines={6}
            maxLength={500}
          />
          
          <Text style={commonStyles.characterCount}>
            {reason.length}/500 characters
          </Text>

          <TouchableOpacity
            style={[commonStyles.primaryButton, (loading || !reason.trim()) && commonStyles.disabledButton]}
            onPress={handleAppeal}
            disabled={loading || !reason.trim()}
          >
            <Text style={commonStyles.primaryButtonText}>
              {loading ? 'Submitting Appeal...' : 'Submit Appeal to Admin'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={commonStyles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.secondaryButtonText}>Accept Rejection</Text>
          </TouchableOpacity>
        </View>

        <View style={commonStyles.infoCard}>
          <Text style={commonStyles.infoTitle}>Appeal Process:</Text>
          <Text style={commonStyles.infoText}>
            • Admin will review your appeal within 24 hours{'\n'}
            • You will be notified of the decision{'\n'}
            • Admin's decision is final{'\n'}
            • If approved, you will receive payment immediately
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskAppealScreen;