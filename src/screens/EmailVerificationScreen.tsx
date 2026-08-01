import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../services/api';
import { commonStyles } from '../styles/commonStyles';

interface Props {
  navigation: any;
  route: any;
}

const EmailVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { email } = route.params || {};

  const handleResendVerification = async () => {
    if (!email) return;

    setResendLoading(true);
    try {
      const response = await authAPI.resendVerification(email);
      Alert.alert('Success', response.message);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={commonStyles.centerContent}>
          <Ionicons name="mail-outline" size={80} color={commonStyles.colors.primary} />
          
          <Text style={commonStyles.title}>Verify Your Email</Text>
          <Text style={commonStyles.subtitle}>
            We've sent a verification link to:
          </Text>
          <Text style={[commonStyles.subtitle, { fontWeight: 'bold', color: commonStyles.colors.primary }]}>
            {email}
          </Text>
          
          <Text style={[commonStyles.subtitle, { marginTop: 20 }]}>
            Please check your email and click the verification link to activate your account.
          </Text>

          <TouchableOpacity
            style={[commonStyles.primaryButton, { marginTop: 30 }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={commonStyles.primaryButtonText}>Go to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.secondaryButton, resendLoading && commonStyles.disabledButton]}
            onPress={handleResendVerification}
            disabled={resendLoading}
          >
            <Text style={commonStyles.secondaryButtonText}>
              {resendLoading ? 'Sending...' : 'Resend Verification Email'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;