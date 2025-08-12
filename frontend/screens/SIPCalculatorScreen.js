import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import { G, Line, Circle } from 'react-native-svg';

const SIPCalculatorScreen = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');
  const [futureValue, setFutureValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [wealthGained, setWealthGained] = useState(0);
  const [chartData, setChartData] = useState([]);

  const calculateSIP = () => {
    if (!monthlyInvestment || !interestRate || !investmentPeriod) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const monthlyInvestmentAmount = parseFloat(monthlyInvestment);
    const annualInterestRate = parseFloat(interestRate);
    const investmentPeriodInYears = parseFloat(investmentPeriod);

    // SIP formula: FV = P × (((1 + i)^n - 1) / i) × (1 + i)
    // Where P = Monthly investment, i = monthly interest rate, n = number of months
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const numberOfMonths = investmentPeriodInYears * 12;
    
    const futureValueAmount = monthlyInvestmentAmount * 
      (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1) / 
      monthlyInterestRate * (1 + monthlyInterestRate);

    const totalInvestmentAmount = monthlyInvestmentAmount * numberOfMonths;
    const wealthGainedAmount = futureValueAmount - totalInvestmentAmount;

    setFutureValue(parseFloat(futureValueAmount.toFixed(2)));
    setTotalInvestment(parseFloat(totalInvestmentAmount.toFixed(2)));
    setWealthGained(parseFloat(wealthGainedAmount.toFixed(2)));

    // Prepare data for chart (yearly growth)
    const yearlyData = [];
    for (let year = 0; year <= investmentPeriodInYears; year++) {
      const months = year * 12;
      const value = monthlyInvestmentAmount * 
        (Math.pow(1 + monthlyInterestRate, months) - 1) / 
        monthlyInterestRate * (1 + monthlyInterestRate);
      yearlyData.push(value);
    }
    setChartData(yearlyData);
  };

  const GridLines = ({ x, y, bandwidth, data }) => {
    return (
      <G>
        {data.map((_, index) => (
          <Line
            key={index}
            x1={x(index)}
            y1={0}
            x2={x(index)}
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
        <Text style={styles.title}>SIP Calculator</Text>
        <Text style={styles.subtitle}>Calculate your Systematic Investment Plan returns</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Monthly Investment (₹)</Text>
        <TextInput
          style={styles.input}
          value={monthlyInvestment}
          onChangeText={setMonthlyInvestment}
          keyboardType="numeric"
          placeholder="Enter monthly investment amount"
        />
        
        <Text style={styles.label}>Expected Return Rate (%)</Text>
        <TextInput
          style={styles.input}
          value={interestRate}
          onChangeText={setInterestRate}
          keyboardType="numeric"
          placeholder="Enter expected annual return rate"
        />
        
        <Text style={styles.label}>Investment Period (Years)</Text>
        <TextInput
          style={styles.input}
          value={investmentPeriod}
          onChangeText={setInvestmentPeriod}
          keyboardType="numeric"
          placeholder="Enter investment period in years"
        />
        
        <TouchableOpacity 
          style={styles.calculateButton} 
          onPress={calculateSIP}
        >
          <Text style={styles.calculateButtonText}>Calculate SIP</Text>
        </TouchableOpacity>
      </View>

      {futureValue > 0 && (
        <View style={styles.results}>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Future Value</Text>
            <Text style={styles.resultValue}>₹{futureValue.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Total Investment</Text>
            <Text style={styles.resultValue}>₹{totalInvestment.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Wealth Gained</Text>
            <Text style={styles.resultValue}>₹{wealthGained.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      )}

      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Investment Growth Over Time</Text>
          <LineChart
            style={styles.chart}
            data={chartData}
            svg={{ stroke: '#2E8B57', strokeWidth: 2 }}
            contentInset={{ top: 20, bottom: 20 }}
          >
            <GridLines />
          </LineChart>
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>Years</Text>
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What is SIP?</Text>
        <Text style={styles.infoText}>
          SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly 
          in mutual funds. It helps in rupee cost averaging and the power of compounding, 
          making it easier to achieve long-term financial goals.
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
    textAlign: 'center',
  },
  chart: {
    height: 200,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  chartLabel: {
    fontSize: 14,
    color: '#666',
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

export default SIPCalculatorScreen;