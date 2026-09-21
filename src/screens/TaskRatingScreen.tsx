import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ratingsAPI } from '../services/api';
import { commonStyles } from '../styles/commonStyles';
import { colors } from '../styles/commonStyles';
import { Task } from '../types';

interface Props {
  navigation: any;
  route: any;
}

const TaskRatingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { task, userType }: { task: Task; userType: 'creator' | 'runner' } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRating = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await ratingsAPI.submit(String(task.taskId || task.id), rating, comment.trim() || undefined);
      Alert.alert(
        'Rating Submitted',
        'Thank you for your feedback!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setRating(index + 1)}
        style={commonStyles.starButton}
      >
        <Ionicons
          name={index < rating ? 'star' : 'star-outline'}
          size={40}
          color={index < rating ? '#FFD700' : '#ccc'}
        />
      </TouchableOpacity>
    ));
  };

  const getRatingText = () => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select Rating';
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Rate Experience</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={commonStyles.content}>
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Task Completed</Text>
          <Text style={commonStyles.taskDescription}>{task.taskDescription}</Text>
          <Text style={commonStyles.taskArea}>Area: {task.area}</Text>
          {userType === 'creator' ? (
            <Text style={commonStyles.taskHelper}>Completed by: {task.helperName}</Text>
          ) : (
            <Text style={commonStyles.taskHelper}>Posted by: {task.createdByUser?.name || `${task.createdByUser?.firstName || ''} ${task.createdByUser?.lastName || ''}`.trim() || 'Task creator'}</Text>
          )}
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>
            How was your experience with the {userType === 'creator' ? 'runner' : 'task creator'}?
          </Text>
          
          <View style={commonStyles.starsContainer}>
            {renderStars()}
          </View>
          
          <Text style={[commonStyles.ratingText, { color: colors.primary }]}>{getRatingText()}</Text>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Additional Comments (Optional)</Text>
            <TextInput
              style={[commonStyles.input, commonStyles.textArea]}
              value={comment}
              onChangeText={setComment}
              placeholder="Share your experience..."
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={[commonStyles.primaryButton, (loading || rating === 0) && commonStyles.disabledButton]}
            onPress={handleRating}
            disabled={loading || rating === 0}
          >
            <Text style={commonStyles.primaryButtonText}>
              {loading ? 'Submitting...' : 'Submit Rating'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={commonStyles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.secondaryButtonText}>Skip Rating</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TaskRatingScreen;