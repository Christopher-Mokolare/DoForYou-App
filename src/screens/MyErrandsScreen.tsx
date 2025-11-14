import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Task } from '../types';
import { tasksAPI } from '../services/api';

const MyErrandsScreen: React.FC = () => {
  const [errands, setErrands] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyErrands();
  }, []);

  const fetchMyErrands = async () => {
    try {
      const data = await tasksAPI.getMyTasks();
      setErrands(data);
    } catch (error) {
      console.error('Error fetching my errands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyErrands();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#007bff';
      case 'assigned': return '#ffc107';
      case 'in_progress': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const renderErrand = ({ item }: { item: Task }) => (
    <View style={styles.errandCard}>
      <Text style={styles.errandTitle}>{String(item.taskDescription || '').replace(/<[^>]*>/g, '')}</Text>
      <Text style={styles.errandCategory}>Area: {String(item.area || '').replace(/<[^>]*>/g, '')}</Text>
      <Text style={styles.errandPrice}>R{item.budget}</Text>
      <View style={styles.statusContainer}>
        <Text style={[styles.status, { color: getStatusColor(item.taskStatus) }]}>
          {String(item.taskStatus || '').replace(/<[^>]*>/g, '').replace('_', ' ').toUpperCase()}
        </Text>
      </View>
      {item.helperName && (
        <Text style={styles.assignee}>Assigned to: {String(item.helperName || '').replace(/<[^>]*>/g, '')}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={errands}
        renderItem={renderErrand}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No errands posted yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 20,
  },
  errandCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  errandDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  errandCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  errandPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 10,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  assignee: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
  },
});

export default MyErrandsScreen;