import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setFilters } from '../store/slices/tasksSlice';
import { TaskFilter, Priority } from '../types';

interface TaskFiltersScreenProps {
  navigation: any;
}

const TaskFiltersScreen: React.FC<TaskFiltersScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentFilters = useSelector((state: RootState) => state.tasks.filters);
  
  const [filters, setLocalFilters] = useState<TaskFilter>(currentFilters);

  const priorities: Priority[] = ['standard', 'urgent', 'low'];
  const areas = ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'];

  const applyFilters = () => {
    dispatch(setFilters(filters));
    navigation.goBack();
  };

  const clearFilters = () => {
    const emptyFilters: TaskFilter = {};
    setLocalFilters(emptyFilters);
    dispatch(setFilters(emptyFilters));
    navigation.goBack();
  };

  return (
    <LinearGradient colors={['#ff6b35', '#ff8c42', '#ffa726']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter Tasks</Text>
        <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Search Term */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Search tasks..."
                value={filters.searchTerm || ''}
                onChangeText={(text) => setLocalFilters({...filters, searchTerm: text})}
              />
            </View>
          </View>

          {/* Area */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Area</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
              {areas.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={[
                    styles.chip,
                    filters.area === area && styles.chipSelected
                  ]}
                  onPress={() => setLocalFilters({
                    ...filters,
                    area: filters.area === area ? undefined : area
                  })}
                >
                  <Text style={[
                    styles.chipText,
                    filters.area === area && styles.chipTextSelected
                  ]}>
                    {area}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityChip,
                    filters.priority === priority && styles.priorityChipSelected
                  ]}
                  onPress={() => setLocalFilters({
                    ...filters,
                    priority: filters.priority === priority ? undefined : priority
                  })}
                >
                  <Text style={[
                    styles.priorityText,
                    filters.priority === priority && styles.priorityTextSelected
                  ]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget Range (R)</Text>
            <View style={styles.budgetContainer}>
              <View style={styles.budgetInput}>
                <Text style={styles.budgetLabel}>Min</Text>
                <TextInput
                  style={styles.budgetField}
                  placeholder="0"
                  keyboardType="numeric"
                  value={filters.minBudget?.toString() || ''}
                  onChangeText={(text) => setLocalFilters({
                    ...filters,
                    minBudget: text ? parseInt(text) : undefined
                  })}
                />
              </View>
              <Text style={styles.budgetSeparator}>-</Text>
              <View style={styles.budgetInput}>
                <Text style={styles.budgetLabel}>Max</Text>
                <TextInput
                  style={styles.budgetField}
                  placeholder="1000"
                  keyboardType="numeric"
                  value={filters.maxBudget?.toString() || ''}
                  onChangeText={(text) => setLocalFilters({
                    ...filters,
                    maxBudget: text ? parseInt(text) : undefined
                  })}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
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
  clearButton: {
    padding: 5,
  },
  clearText: {
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
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  chipSelected: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  chipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: 'white',
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  priorityChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  priorityChipSelected: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  priorityText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  priorityTextSelected: {
    color: 'white',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetInput: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
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
  budgetSeparator: {
    fontSize: 18,
    color: '#666',
    marginHorizontal: 15,
    marginTop: 20,
  },
  footer: {
    padding: 20,
  },
  applyButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  applyButtonText: {
    color: '#ff6b35',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TaskFiltersScreen;