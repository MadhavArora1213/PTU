import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BarChart } from 'react-native-svg-charts';
import { G, Line } from 'react-native-svg';

const EMICalculatorScreen = () => {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [chartData, setChartData] = useState([]);

  const calculateEMI = () => {
    if (!principal || !interestRate || !tenure) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const principalAmount = parseFloat(principal);
    const annualInterestRate = parseFloat(interestRate);
    const tenureInMonths = parseFloat(tenure) * 12;

    // EMI formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    // Where P = Principal, r = monthly interest rate, n = tenure in months
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const emiValue = principalAmount * monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, tenureInMonths) / 
      (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);

    const totalPaymentValue = emiValue * tenureInMonths;
    const totalInterestValue = totalPaymentValue - principalAmount;

    setEmi(parseFloat(emiValue.toFixed(2)));
    setTotalPayment(parseFloat(totalPaymentValue.toFixed(2)));
    setTotalInterest(parseFloat(totalInterestValue.toFixed(2)));

    // Prepare data for chart
    setChartData([
      { label: 'Principal', value: principalAmount },
      { label: 'Interest', value: totalInterestValue },
    ]);
  };

  const GridLines = ({ x, y, bandwidth, data }) => {
    return (
      <G>
        {data.map((_, index) => (
          <Line
            key={index}
            x1={x(index) + bandwidth / 2}
            y1={0}
            x2={x(index) + bandwidth / 2}
            y2={'100%'}
            stroke="#eee"
            strokeWidth={1}
          />
        ))}
      </G>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EMI Calculator</Text>
        <Text style={styles.subtitle}>Calculate your loan EMIs</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Loan Amount (₹)</Text>
        <TextInput
          style={styles.input}
          value={principal}
          onChangeText={setPrincipal}
          keyboardType="numeric"
          placeholder="Enter loan amount"
        />
        
        <Text style={styles.label}>Interest Rate (%)</Text>
        <TextInput
          style={styles.input}
          value={interestRate}
          onChangeText={setInterestRate}
          keyboardType="numeric"
          placeholder="Enter annual interest rate"
        />
        
        <Text style={styles.label}>Loan Tenure (Years)</Text>
        <TextInput
          style={styles.input}
          value={tenure}
          onChangeText={setTenure}
          keyboardType="numeric"
          placeholder="Enter loan tenure in years"
        />
        
        <TouchableOpacity 
          style={styles.calculateButton} 
          onPress={calculateEMI}
        >
          <Text style={styles.calculateButtonText}>Calculate EMI</Text>
        </TouchableOpacity>
      </View>

      {emi > 0 && (
        <View style={styles.results}>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Monthly EMI</Text>
            <Text style={styles.resultValue}>₹{emi.toFixed(2)}</Text>
          </View>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Total Payment</Text>
            <Text style={styles.resultValue}>₹{totalPayment.toFixed(2)}</Text>
          </View>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Total Interest</Text>
            <Text style={styles.resultValue}>₹{totalInterest.toFixed(2)}</Text>
          </View>
        </View>
      )}

      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Payment Breakdown</Text>
          <BarChart
            style={styles.chart}
            data={chartData}
            yAccessor={({ item }) => item.value}
            svg={{ fill: '#2E8B57' }}
            contentInset={{ top: 20, bottom: 20 }}
          >
            <GridLines />
          </BarChart>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>Principal</Text>
            <Text style={styles.chartLabel}>Interest</Text>
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What is EMI?</Text>
        <Text style={styles.infoText}>
          EMI (Equated Monthly Installment) is the fixed amount a borrower pays to the lender 
          at a specified date each month to repay a loan. It consists of both principal and 
          interest components.
        </Text>
      </View>
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
  calculateButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  results: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  resultCard: {
    width: '30%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 5,
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
    width: '100%',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  chartLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoSection: {
    backgroundColor: '#e8f5e9',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default EMICalculatorScreen;