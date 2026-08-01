import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../services/api';
import { commonStyles } from '../styles/commonStyles';

interface Props {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword({ email: email.trim() });
      Alert.alert('Success', response.message, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={commonStyles.flex1}
      >
        <View style={commonStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={commonStyles.colors.primary} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Reset Password</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={commonStyles.content}>
          <Text style={commonStyles.title}>Forgot Password?</Text>
          <Text style={commonStyles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <View style={commonStyles.inputContainer}>
            <Text style={commonStyles.label}>Email Address</Text>
            <TextInput
              style={commonStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[commonStyles.primaryButton, loading && commonStyles.disabledButton]}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={commonStyles.primaryButtonText}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={commonStyles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.secondaryButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;