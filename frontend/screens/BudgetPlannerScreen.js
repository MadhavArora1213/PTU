import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { G, Line, Circle } from 'react-native-svg';
import api from '../services/api';

const BudgetPlannerScreen = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [savings, setSavings] = useState('');
  const [budgetPlans, setBudgetPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgetPlans();
  }, []);

  const fetchBudgetPlans = async () => {
    try {
      const response = await api.get('/financial/budget');
      
      setBudgetPlans(response.data.budgetPlans);
      
      // Fetch categories from the response or use default if not provided
      if (response.data.categories && response.data.categories.length > 0) {
        setCategories(response.data.categories);
      } else {
        // Default categories if none provided from backend
        setCategories([
          { id: 1, name: 'Rent', amount: 15000, color: '#2E8B57' },
          { id: 2, name: 'Groceries', amount: 8000, color: '#FFD700' },
          { id: 3, name: 'Utilities', amount: 5000, color: '#32CD32' },
          { id: 4, name: 'Entertainment', amount: 4000, color: '#90EE90' },
          { id: 5, name: 'Transport', amount: 3000, color: '#8FBC8F' },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch budget plans');
    }
  };

  const createBudgetPlan = async () => {
    if (!income || !expenses || !savings) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/financial/budget', {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        income: parseFloat(income),
        expenses: parseFloat(expenses),
        savings: parseFloat(savings)
      });
      
      setLoading(false);
      Alert.alert('Success', 'Budget plan created successfully');
      fetchBudgetPlans();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to create budget plan');
    }
  };

  const addCategory = () => {
    if (!newCategory || !newCategoryAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newCat = {
      id: categories.length + 1,
      name: newCategory,
      amount: parseFloat(newCategoryAmount),
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    setCategories([...categories, newCat]);
    setNewCategory('');
    setNewCategoryAmount('');
    setModalVisible(false);
  };

  const data = categories.map((item) => ({
    key: item.id,
    amount: item.amount,
    svg: { fill: item.color },
    label: item.name,
  }));

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { label, pieCentroid } = slice;
      return (
        <G key={index}>
          <Circle cx={pieCentroid[0]} cy={pieCentroid[1]} r={4} fill={'white'} />
        </G>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Planner</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Create New Budget</Text>
        
        <Text style={styles.label}>Monthly Income (₹)</Text>
        <TextInput
          style={styles.input}
          value={income}
          onChangeText={setIncome}
          keyboardType="numeric"
          placeholder="Enter your monthly income"
        />
        
        <Text style={styles.label}>Monthly Expenses (₹)</Text>
        <TextInput
          style={styles.input}
          value={expenses}
          onChangeText={setExpenses}
          keyboardType="numeric"
          placeholder="Enter your monthly expenses"
        />
        
        <Text style={styles.label}>Monthly Savings (₹)</Text>
        <TextInput
          style={styles.input}
          value={savings}
          onChangeText={setSavings}
          keyboardType="numeric"
          placeholder="Enter your monthly savings"
        />
        
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={createBudgetPlan}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create Budget Plan'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Expense Breakdown</Text>
        {data.length > 0 ? (
          <PieChart
            style={styles.chart}
            data={data}
            innerRadius={40}
            outerRadius={80}
            labelRadius={90}
          >
            <Labels />
          </PieChart>
        ) : (
          <Text style={styles.noDataText}>No expense data available</Text>
        )}
      </View>

      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Categories</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={[styles.colorIndicator, { backgroundColor: category.color }]} />
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryAmount}>₹{category.amount.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            
            <Text style={styles.label}>Category Name</Text>
            <TextInput
              style={styles.input}
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="e.g., Entertainment"
            />
            
            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              value={newCategoryAmount}
              onChangeText={setNewCategoryAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalAddButton}
                onPress={addCategory}
              >
                <Text style={styles.modalAddButtonText}>Add Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E8B57',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chart: {
    height: 200,
    width: 200,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  categoriesSection: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#2E8B57',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalAddButton: {
    backgroundColor: '#2E8B57',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudgetPlannerScreen;