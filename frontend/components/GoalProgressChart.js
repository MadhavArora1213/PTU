import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';

const GoalProgressChart = ({ progress, size, strokeWidth }) => {
  const chartSize = size || 100;
  const chartStrokeWidth = strokeWidth || 10;
  
  return (
    <View style={styles.container}>
      <ProgressCircle
        style={{ height: chartSize, width: chartSize }}
        progress={progress / 100}
        progressColor={'#2E8B57'}
        backgroundColor={'#f0f0f0'}
        strokeWidth={chartStrokeWidth}
        cornerRadius={50}
      />
      <Text style={[styles.progressText, { fontSize: chartSize / 4 }]}>
        {progress.toFixed(1)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    fontWeight: 'bold',
    color: '#2E8B57',
  },
});

export default GoalProgressChart;