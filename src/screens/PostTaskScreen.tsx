import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createTask } from '../store/slices/tasksSlice';
import { CreateTaskData, Priority } from '../types';

const PostTaskScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [area, setArea] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('standard');
  const [dateNeeded, setDateNeeded] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateNeeded;
    setShowDatePicker(Platform.OS === 'ios');
    
    // Validate that the selected date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (currentDate < today) {
      Alert.alert('Invalid Date', 'Please select a date that is today or in the future.');
      return;
    }
    
    setDateNeeded(currentDate);
  };
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const areas = ['Johannesburg CBD', 'Sandton', 'Rosebank', 'Midrand', 'Pretoria', 'Cape Town', 'Durban', 'Other'];
  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: 'standard', label: 'Standard', color: '#6c757d' },
    { value: 'urgent', label: 'Urgent (+20%)', color: '#dc3545' },
    { value: 'low', label: 'Low Priority', color: '#28a745' }
  ];

  const handlePostTask = async () => {
    if (!taskName.trim() || taskDescription.trim().length < 20 || !area || !budget || !termsAccepted) {
      Alert.alert('Error', 'Please fill in all required fields and accept terms');
      return;
    }

    if (!user?.canCreateTasks) {
      Alert.alert('Error', 'You need to enable task creator mode in settings');
      return;
    }

    const budgetAmount = parseFloat(budget);
    if (isNaN(budgetAmount) || budgetAmount < 50 || budgetAmount > 100000) {
      Alert.alert('Error', 'Budget must be between R50 and R100000');
      return;
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateNeeded < today) {
      Alert.alert('Error', 'Please select a date that is today or in the future');
      return;
    }

    const taskData: CreateTaskData = {
      taskName: taskName.trim(),
      taskDescription: taskDescription.trim(),
      category: 'Other',
      area,
      dateNeeded: dateNeeded.toISOString(),
      budget: budgetAmount,
      notes: notes || undefined,
      termsAccepted,
      priority
    };

    Alert.alert(
      'Confirm Task Posting',
      `You will pay R${budgetAmount} upfront.

Breakdown:
• Task budget: R${budgetAmount}
• Platform fee (15%): R${(budgetAmount * 0.15).toFixed(2)}
• Runner receives: R${(budgetAmount * 0.85).toFixed(2)}

Proceed to payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed to Payment',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await dispatch(createTask(taskData)).unwrap();
              if (!result.paymentUrl) throw new Error('Secure payment URL was not returned by the backend.');
              navigation.navigate('Payment', { taskId: result.task.taskId, task: result.task });
            } catch (error: any) {
              Alert.alert('Payment Failed', 'Task was not created. Please try again.', [
                { text: 'Retry', onPress: () => handlePostTask() },
                { text: 'Cancel', style: 'cancel' }
              ]);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Post a Task</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Name *</Text>
              <View style={[styles.inputContainer, focusedField === 'taskName' && styles.inputFocused]}>
                <Ionicons name="clipboard-outline" size={20} color={focusedField === 'taskName' ? '#ff6b35' : '#666'} />
                <TextInput style={styles.input} placeholder="Short task name" placeholderTextColor="#999" value={taskName} onChangeText={setTaskName} onFocus={() => setFocusedField('taskName')} onBlur={() => setFocusedField('')} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Description *</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer, focusedField === 'description' && styles.inputFocused]}>
                <Ionicons name="document-text-outline" size={20} color={focusedField === 'description' ? '#ff6b35' : '#666'} style={styles.textAreaIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="What needs to be done? Be specific..."
                  placeholderTextColor="#999"
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  multiline
                  numberOfLines={4}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField('')}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Area *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {areas.map((areaOption) => (
                  <TouchableOpacity
                    key={areaOption}
                    style={[styles.categoryChip, area === areaOption && styles.categoryChipActive]}
                    onPress={() => setArea(areaOption)}
                  >
                    <Text style={[styles.categoryText, area === areaOption && styles.categoryTextActive]}>
                      {areaOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {area === 'Other' && (
                <TextInput
                  style={styles.customAreaInput}
                  placeholder="Enter your area"
                  value={area === 'Other' ? '' : area}
                  onChangeText={setArea}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date Needed *</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.dateText}>
                  {dateNeeded.toLocaleDateString()}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              
              <View style={styles.quickDateContainer}>
                <TouchableOpacity 
                  style={styles.quickDateButton}
                  onPress={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setDateNeeded(tomorrow);
                  }}
                >
                  <Text style={styles.quickDateText}>Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickDateButton}
                  onPress={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setDateNeeded(nextWeek);
                  }}
                >
                  <Text style={styles.quickDateText}>Next Week</Text>
                </TouchableOpacity>
              </View>
              
              {showDatePicker && (
                <DateTimePicker
                  value={dateNeeded}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  style={styles.datePicker}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {priorities.map((priorityOption) => (
                  <TouchableOpacity
                    key={priorityOption.value}
                    style={[styles.priorityChip, priority === priorityOption.value && { backgroundColor: priorityOption.color }]}
                    onPress={() => setPriority(priorityOption.value)}
                  >
                    <Text style={[styles.priorityText, priority === priorityOption.value && styles.priorityTextActive]}>
                      {priorityOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Budget (Rands) * <Text style={styles.minBudget}>Min: R50</Text></Text>
              <View style={[styles.inputContainer, focusedField === 'budget' && styles.inputFocused]}>
                <Text style={styles.currencySymbol}>R</Text>
                <TextInput
                  style={[styles.input, styles.priceInput]}
                  placeholder="100.00"
                  placeholderTextColor="#999"
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType="numeric"
                  onFocus={() => setFocusedField('budget')}
                  onBlur={() => setFocusedField('')}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer, focusedField === 'notes' && styles.inputFocused]}>
                <Ionicons name="chatbubble-outline" size={20} color={focusedField === 'notes' ? '#ff6b35' : '#666'} style={styles.textAreaIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Any special instructions or requirements..."
                  placeholderTextColor="#999"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  onFocus={() => setFocusedField('notes')}
                  onBlur={() => setFocusedField('')}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <Ionicons 
                name={termsAccepted ? "checkbox" : "square-outline"} 
                size={24} 
                color={termsAccepted ? '#ff6b35' : '#666'} 
              />
              <Text style={styles.termsText}>
                I accept the terms and conditions *
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, (loading || !termsAccepted) && styles.buttonDisabled]} 
            onPress={handlePostTask}
            disabled={loading || !termsAccepted}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.buttonText}>Creating Task...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="card-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Proceed to Payment</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#ff6b35',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  textAreaIcon: {
    marginTop: 5,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryScroll: {
    marginTop: 5,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryChipActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  customAreaInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  quickDateContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  quickDateButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickDateText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  datePicker: {
    marginTop: 10,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  priorityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  priorityText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  priorityTextActive: {
    color: 'white',
  },
  minBudget: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'normal',
  },
  paymentBreakdown: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  breakdownItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  termsText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },

  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginRight: 5,
  },
  priceInput: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PostTaskScreen;