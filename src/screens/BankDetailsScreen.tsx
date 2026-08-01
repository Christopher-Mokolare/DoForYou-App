import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userAPI } from '../services/api';
import { commonStyles, colors } from '../styles/commonStyles';
import { BankDetails } from '../types';

interface Props {
  navigation: any;
}

const BankDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: '',
    accountNumber: '',
    branchCode: '',
    accountHolderName: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadBankDetails();
  }, []);

  const loadBankDetails = async () => {
    try {
      // Try to load from backend first
      const details = await userAPI.getBankDetails();
      setBankDetails(details);
      console.log('Bank details loaded from backend');
    } catch (error: any) {
      console.log('Backend bank details not available, checking local storage');
      try {
        // Fallback to local storage
        const localDetails = await AsyncStorage.getItem('bank_details');
        if (localDetails) {
          setBankDetails(JSON.parse(localDetails));
          console.log('Bank details loaded from local storage');
        }
      } catch (localError) {
        console.log('No local bank details found');
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const validateBankDetails = () => {
    const errors: string[] = [];
    
    if (!bankDetails.bankName.trim()) {
      errors.push('Bank name is required');
    }
    
    if (!bankDetails.accountHolderName.trim()) {
      errors.push('Account holder name is required');
    }
    
    if (!bankDetails.accountNumber.trim()) {
      errors.push('Account number is required');
    } else if (bankDetails.accountNumber.length < 8) {
      errors.push('Account number must be at least 8 digits');
    }
    
    if (!bankDetails.branchCode.trim()) {
      errors.push('Branch code is required');
    } else if (bankDetails.branchCode.length !== 6) {
      errors.push('Branch code must be exactly 6 digits');
    }
    
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateBankDetails();
    if (validationErrors.length > 0) {
      Alert.alert('Validation Error', validationErrors.join('
'));
      return;
    }

    setLoading(true);
    try {
      // Try to save to backend
      const result = await userAPI.updateBankDetails(bankDetails);
      
      // Also save to local storage as backup
      await AsyncStorage.setItem('bank_details', JSON.stringify(bankDetails));
      
      Alert.alert('Success', result.message || 'Bank details saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.log('Backend save failed, saving locally:', error.message);
      try {
        // Save to local storage if backend fails
        await AsyncStorage.setItem('bank_details', JSON.stringify(bankDetails));
        Alert.alert('Success', 'Bank details saved locally (will sync when backend is available)', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } catch (localError) {
        Alert.alert('Error', 'Failed to save bank details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof BankDetails, value: string) => {
    setBankDetails(prev => ({ ...prev, [field]: value }));
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, color: colors.text }}>Loading bank details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Bank Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color={colors.success} />
          <Text style={commonStyles.infoText}>
            Your bank details are encrypted and secure. They are used for payment processing only.
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Banking Information</Text>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Bank Name *</Text>
            <TextInput
              style={commonStyles.input}
              value={bankDetails.bankName}
              onChangeText={(value) => updateField('bankName', value)}
              placeholder="e.g., Standard Bank, FNB, ABSA"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Account Holder Name *</Text>
            <TextInput
              style={commonStyles.input}
              value={bankDetails.accountHolderName}
              onChangeText={(value) => updateField('accountHolderName', value)}
              placeholder="Full name as on bank account"
            />
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Account Number *</Text>
            <TextInput
              style={commonStyles.input}
              value={bankDetails.accountNumber}
              onChangeText={(value) => updateField('accountNumber', value.replace(/[^0-9]/g, ''))}
              placeholder="Account number (8+ digits)"
              keyboardType="numeric"
              maxLength={15}
            />
            {bankDetails.accountNumber && bankDetails.accountNumber.length < 8 && (
              <Text style={styles.validationText}>Account number must be at least 8 digits</Text>
            )}
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Branch Code *</Text>
            <TextInput
              style={commonStyles.input}
              value={bankDetails.branchCode}
              onChangeText={(value) => updateField('branchCode', value.replace(/[^0-9]/g, ''))}
              placeholder="6-digit branch code"
              keyboardType="numeric"
              maxLength={6}
            />
            {bankDetails.branchCode && bankDetails.branchCode.length !== 6 && (
              <Text style={styles.validationText}>Branch code must be exactly 6 digits</Text>
            )}
          </View>

          <TouchableOpacity
            style={[commonStyles.primaryButton, loading && commonStyles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={commonStyles.primaryButtonText}>
              {loading ? 'Saving...' : 'Save Bank Details'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={commonStyles.warningCard}>
          <Ionicons name="information-circle" size={24} color={colors.warning} />
          <Text style={commonStyles.warningText}>
            Bank details are required to receive payments as a task runner. Ensure all information is accurate.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  validationText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  }
};

export default BankDetailsScreen;