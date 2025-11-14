import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationSettingsScreen = ({ navigation }: any) => {
  const [taskUpdates, setTaskUpdates] = useState(true);
  const [newTasks, setNewTasks] = useState(true);
  const [payments, setPayments] = useState(true);
  const [messages, setMessages] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const notificationTypes = [
    {
      title: 'Task Updates',
      subtitle: 'Status changes on your tasks',
      value: taskUpdates,
      onToggle: setTaskUpdates,
    },
    {
      title: 'New Tasks',
      subtitle: 'New tasks in your area',
      value: newTasks,
      onToggle: setNewTasks,
    },
    {
      title: 'Payments',
      subtitle: 'Payment confirmations and receipts',
      value: payments,
      onToggle: setPayments,
    },
    {
      title: 'Messages',
      subtitle: 'Direct messages from other users',
      value: messages,
      onToggle: setMessages,
    },
    {
      title: 'Marketing',
      subtitle: 'Promotional offers and updates',
      value: marketing,
      onToggle: setMarketing,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Choose what notifications you'd like to receive
        </Text>

        <View style={styles.section}>
          {notificationTypes.map((item, index) => (
            <View key={index} style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: '#e9ecef', true: '#ff6b35' }}
                thumbColor={item.value ? '#fff' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>
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
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default NotificationSettingsScreen;