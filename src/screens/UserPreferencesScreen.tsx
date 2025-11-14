import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUserPreferences, updateUserPreferences } from '../store/slices/userSlice';
import { UserPreferences } from '../types';

interface UserPreferencesScreenProps {
  navigation: any;
}

const UserPreferencesScreen: React.FC<UserPreferencesScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { preferences, isLoading } = useSelector((state: RootState) => state.user);
  
  const [localPreferences, setLocalPreferences] = useState<Partial<UserPreferences>>({
    canCreateTasks: true,
    canAcceptTasks: true,
    taskCreatorNotifications: true,
    taskRunnerNotifications: true,
    paymentNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    minTaskAmount: 0,
    maxTaskAmount: 1000
  });

  useEffect(() => {
    dispatch(fetchUserPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      await dispatch(updateUserPreferences(localPreferences)).unwrap();
      Alert.alert('Success', 'Preferences updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences');
    }
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <LinearGradient colors={['#ff6b35', '#ff8c42', '#ffa726']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* User Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Type</Text>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceLabel}>Can Create Tasks</Text>
                <Text style={styles.preferenceDescription}>Post tasks for others to complete</Text>
              </View>
              <Switch
                value={localPreferences.canCreateTasks}
                onValueChange={(value) => updatePreference('canCreateTasks', value)}
                trackColor={{ false: '#e9ecef', true: '#ff6b35' }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceLabel}>Can Accept Tasks</Text>
                <Text style={styles.preferenceDescription}>Accept and complete tasks from others</Text>
              </View>
              <Switch
                value={localPreferences.canAcceptTasks}
                onValueChange={(value) => updatePreference('canAcceptTasks', value)}
                trackColor={{ false: '#e9ecef', true: '#ff6b35' }}
                thumbColor="white"
              />
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceLabel}>Task Creator Notifications</Text>
                <Text style={styles.preferenceDescription}>Updates about your posted tasks</Text>
              </View>
              <Switch
                value={localPreferences.taskCreatorNotifications}
                onValueChange={(value) => updatePreference('taskCreatorNotifications', value)}
                trackColor={{ false: '#e9ecef', true: '#ff6b35' }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceLabel}>Task Runner Notifications</Text>
                <Text style={styles.preferenceDescription}>Updates about tasks you're working on</Text>
              </View>
              <Switch
                value={localPreferences.taskRunnerNotifications}
                onValueChange={(value) => updatePreference('taskRunnerNotifications', value)}
                trackColor={{ false: '#e9ecef', true: '#ff6b35' }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceLabel}>Payment Notifications</Text>
                <Text style={styles.preferenceDescription}>Payment confirmations and updates</Text>
              </View>
              <Switch
                value={localPreferences.paymentNotifications}
                onValueChange={(value) => updatePreference('paymentNotifications', value)}
                trackColor={{ false: '#e9ecef', true: '#ff6b35' }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceLabel}>Email Notifications</Text>
                <Text style={styles.preferenceDescription}>Receive notifications via email</Text>
              </View>
              <Switch
                value={localPreferences.emailNotifications}
                onValueChange={(value) => updatePreference('emailNotifications', value)}
                trackColor={{ false: '#e9ecef', true: '#ff6b35' }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceLabel}>SMS Notifications</Text>
                <Text style={styles.preferenceDescription}>Receive notifications via SMS</Text>
              </View>
              <Switch
                value={localPreferences.smsNotifications}
                onValueChange={(value) => updatePreference('smsNotifications', value)}
                trackColor={{ false: '#e9ecef', true: '#ff6b35' }}
                thumbColor="white"
              />
            </View>
          </View>

          {/* Task Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Preferences</Text>
            
            <View style={styles.budgetContainer}>
              <View style={styles.budgetInput}>
                <Text style={styles.budgetLabel}>Minimum Task Amount (R)</Text>
                <TextInput
                  style={styles.budgetField}
                  placeholder="0"
                  keyboardType="numeric"
                  value={localPreferences.minTaskAmount?.toString() || ''}
                  onChangeText={(text) => updatePreference('minTaskAmount', text ? parseInt(text) : 0)}
                />
              </View>
              
              <View style={styles.budgetInput}>
                <Text style={styles.budgetLabel}>Maximum Task Amount (R)</Text>
                <TextInput
                  style={styles.budgetField}
                  placeholder="1000"
                  keyboardType="numeric"
                  value={localPreferences.maxTaskAmount?.toString() || ''}
                  onChangeText={(text) => updatePreference('maxTaskAmount', text ? parseInt(text) : 1000)}
                />
              </View>
            </View>
          </View>

          {/* Bank Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bank Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bank Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter bank name"
                value={localPreferences.bankName || ''}
                onChangeText={(text) => updatePreference('bankName', text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account number"
                keyboardType="numeric"
                value={localPreferences.accountNumber || ''}
                onChangeText={(text) => updatePreference('accountNumber', text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Branch Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter branch code"
                keyboardType="numeric"
                value={localPreferences.branchCode || ''}
                onChangeText={(text) => updatePreference('branchCode', text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Holder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account holder name"
                value={localPreferences.accountHolderName || ''}
                onChangeText={(text) => updatePreference('accountHolderName', text)}
              />
            </View>
          </View>
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
  saveButton: {
    padding: 5,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 15,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
  },
  budgetContainer: {
    gap: 15,
  },
  budgetInput: {
    marginBottom: 15,
  },
  budgetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  budgetField: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
});

export default UserPreferencesScreen;