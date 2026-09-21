import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { paymentAPI } from '../services/api';
import * as WebBrowser from 'expo-web-browser';

interface Props {
  navigation: any;
  route: any;
}

const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { taskId } = route.params || {};
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const paymentUrl = await paymentAPI.getPaymentUrl(taskId);
      if (!paymentUrl) throw new Error('Payment link is not available yet.');
      await WebBrowser.openBrowserAsync(paymentUrl);
    } catch (error: any) {
      Alert.alert('Payment unavailable', error.response?.data?.message || error.message || 'Unable to start payment.');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Task Payment</Text>
          {taskId && (
            <Text style={styles.taskId}>Task ID: {taskId}</Text>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.sandboxButton]} 
            onPress={handlePayment}
            disabled={loading}
          >
            <Ionicons name="card-outline" size={20} color="white" />
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : 'Continue to secure payment'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.note}>
            You will be redirected to the secure payment provider. Payment confirmation is handled by the backend.
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  taskId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  sandboxButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PaymentScreen;