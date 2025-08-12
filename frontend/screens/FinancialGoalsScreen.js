import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import GoalProgressChart from '../components/GoalProgressChart';

const FinancialGoalsScreen = () => {
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [goalType, setGoalType] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');

  useEffect(() => {
    // Fetch financial goals
    fetchFinancialGoals();
  }, []);

  const fetchFinancialGoals = async () => {
    try {
      // Replace with your actual backend URL
      const response = await axios.get('http://localhost:5003/api/financial/goals');
      
      setGoals(response.data.goals);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch financial goals');
    }
  };

  const createFinancialGoal = async () => {
    if (!goalType || !targetAmount || !targetDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Replace with your actual backend URL
      const response = await axios.post('http://localhost:5003/api/financial/goals', {
        goalType,
        targetAmount: parseFloat(targetAmount),
        targetDate
      });
      
      setModalVisible(false);
      Alert.alert('Success', 'Financial goal created successfully');
      fetchFinancialGoals();
    } catch (error) {
      Alert.alert('Error', 'Failed to create financial goal');
    }
  };

  const updateFinancialGoal = async (goalId) => {
    if (!contributionAmount) {
      Alert.alert('Error', 'Please enter contribution amount');
      return;
    }

    try {
      // Find the goal to update
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newCurrentAmount = goal.currentAmount + parseFloat(contributionAmount);
      
      // Replace with your actual backend URL
      const response = await axios.put(`http://localhost:5003/api/financial/goals/${goalId}`, {
        currentAmount: newCurrentAmount
      });
      
      // Update local state
      const updatedGoals = goals.map(g => {
        if (g.id === goalId) {
          const newProgress = (newCurrentAmount / g.targetAmount) * 100;
          return {
            ...g,
            currentAmount: newCurrentAmount,
            progress: newProgress
          };
        }
        return g;
      });
      
      setGoals(updatedGoals);
      setSelectedGoal(null);
      setContributionAmount('');
      Alert.alert('Success', 'Goal updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update financial goal');
    }
  };

  const deleteFinancialGoal = async (goalId) => {
    try {
      // Replace with your actual backend URL
      const response = await axios.delete(`http://localhost:5003/api/financial/goals/${goalId}`);
      
      // Update local state
      const updatedGoals = goals.filter(g => g.id !== goalId);
      setGoals(updatedGoals);
      Alert.alert('Success', 'Goal deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete financial goal');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Goals</Text>
        <Text style={styles.subtitle}>Track and achieve your financial targets</Text>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add New Goal</Text>
      </TouchableOpacity>

      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalType}>{goal.goalType}</Text>
            <TouchableOpacity onPress={() => deleteFinancialGoal(goal.id)}>
              <Text style={styles.deleteButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressContainer}>
            <GoalProgressChart progress={goal.progress} size={100} strokeWidth={10} />
            <View style={styles.progressInfo}>
              <Text style={styles.amountText}>
                ₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.dateText}>Target: {goal.targetDate}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => setSelectedGoal(goal)}
          >
            <Text style={styles.updateButtonText}>Update Progress</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Financial Goal</Text>
            
            <Text style={styles.label}>Goal Type</Text>
            <TextInput
              style={styles.input}
              value={goalType}
              onChangeText={setGoalType}
              placeholder="e.g., Emergency Fund, Home Down Payment"
            />
            
            <Text style={styles.label}>Target Amount (₹)</Text>
            <TextInput
              style={styles.input}
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
              placeholder="Enter target amount"
            />
            
            <Text style={styles.label}>Target Date</Text>
            <TextInput
              style={styles.input}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="YYYY-MM-DD"
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
                onPress={createFinancialGoal}
              >
                <Text style={styles.modalAddButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedGoal !== null}
        onRequestClose={() => setSelectedGoal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Progress</Text>
            <Text style={styles.modalSubtitle}>{selectedGoal?.goalType}</Text>
            
            <Text style={styles.label}>Contribution Amount (₹)</Text>
            <TextInput
              style={styles.input}
              value={contributionAmount}
              onChangeText={setContributionAmount}
              keyboardType="numeric"
              placeholder="Enter amount to add"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setSelectedGoal(null)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalAddButton}
                onPress={() => updateFinancialGoal(selectedGoal?.id)}
              >
                <Text style={styles.modalAddButtonText}>Update</Text>
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
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  addButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    fontSize: 20,
    color: '#ff6b6b',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressInfo: {
    flex: 1,
    marginLeft: 20,
  },
  amountText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  updateButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
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

export default FinancialGoalsScreen;