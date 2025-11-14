import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentMethodsScreen = ({ navigation }: any) => {
  const paymentMethods = [
    {
      id: 1,
      type: 'card',
      name: 'Credit Card',
      details: '**** **** **** 1234',
      isDefault: true,
    },
    {
      id: 2,
      type: 'payfast',
      name: 'PayFast',
      details: 'Secure South African payments',
      isDefault: false,
    },
  ];

  const handleAddPaymentMethod = () => {
    Alert.alert('Add Payment Method', 'This feature will be available soon');
  };

  const handleEditPaymentMethod = (method: any) => {
    Alert.alert('Edit Payment Method', `Edit ${method.name}`);
  };

  const handleDeletePaymentMethod = (method: any) => {
    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete ${method.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <TouchableOpacity onPress={handleAddPaymentMethod}>
          <Ionicons name="add" size={24} color="#ff6b35" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Manage your payment methods for secure transactions
        </Text>

        <View style={styles.section}>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentItem}>
              <View style={styles.paymentIcon}>
                <Ionicons 
                  name={method.type === 'card' ? 'card-outline' : 'wallet-outline'} 
                  size={24} 
                  color="#ff6b35" 
                />
              </View>
              
              <View style={styles.paymentInfo}>
                <View style={styles.paymentHeader}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.paymentDetails}>{method.details}</Text>
              </View>

              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => handleEditPaymentMethod(method)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddPaymentMethod}>
          <Ionicons name="add-circle-outline" size={24} color="#ff6b35" />
          <Text style={styles.addButtonText}>Add New Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  defaultText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  paymentDetails: {
    fontSize: 14,
    color: '#666',
  },
  menuButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff6b35',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    color: '#ff6b35',
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default PaymentMethodsScreen;