import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { G, Circle } from 'react-native-svg';

const PieChartComponent = ({ data }) => {
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
    <View style={{ height: 200, padding: 20 }}>
      <PieChart
        style={{ flex: 1 }}
        data={data}
        innerRadius={40}
        outerRadius={80}
        labelRadius={90}
      >
        <Labels />
      </PieChart>
    </View>
  );
};

export default PieChartComponent;