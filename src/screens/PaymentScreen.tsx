import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { paymentAPI } from '../services/paymentService';
import { Task } from '../types';

interface PaymentScreenProps {
  route: {
    params: {
      task: Task;
    };
  };
}

const PaymentScreen: React.FC<PaymentScreenProps> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { task } = route.params as { task: Task };
  
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generatePaymentUrl();
  }, []);

  const generatePaymentUrl = async () => {
    try {
      setIsLoading(true);
      const response = await paymentAPI.generatePaymentUrl(task.id.toString());
      setPaymentUrl(response.paymentUrl);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to generate payment URL');
      Alert.alert('Error', 'Failed to generate payment URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    
    // Check for success URL
    if (url.includes('doforyou://payment/success')) {
      navigation.navigate('PaymentSuccess', { task });
      return;
    }
    
    // Check for cancel URL
    if (url.includes('doforyou://payment/cancel')) {
      navigation.navigate('PaymentCancel', { task });
      return;
    }
  };

  const handleError = () => {
    Alert.alert(
      'Payment Error',
      'There was an error processing your payment. Please try again.',
      [
        { text: 'Retry', onPress: generatePaymentUrl },
        { text: 'Cancel', onPress: () => navigation.goBack() }
      ]
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#ff6b35', '#ff8c42', '#ffa726']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Preparing payment...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error || !paymentUrl) {
    return (
      <LinearGradient colors={['#ff6b35', '#ff8c42', '#ffa726']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="white" />
          <Text style={styles.errorTitle}>Payment Error</Text>
          <Text style={styles.errorMessage}>{error || 'Unable to load payment page'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={generatePaymentUrl}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ff6b35" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{task.taskDescription}</Text>
        <Text style={styles.taskAmount}>Amount: R{task.budget}</Text>
      </View>

      <WebView
        source={{ uri: paymentUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <ActivityIndicator size="large" color="#ff6b35" />
            <Text style={styles.webviewLoadingText}>Loading payment page...</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  taskInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  taskAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  webviewLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  retryButtonText: {
    color: '#ff6b35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;