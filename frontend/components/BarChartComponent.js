import React from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-svg-charts';
import { G, Line } from 'react-native-svg';

const BarChartComponent = ({ data, style }) => {
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
    <View style={[{ height: 200, padding: 20 }, style]}>
      <BarChart
        style={{ flex: 1 }}
        data={data}
        yAccessor={({ item }) => item.value}
        svg={{ fill: '#2E8B57' }}
        contentInset={{ top: 20, bottom: 20 }}
      >
        <GridLines />
      </BarChart>
    </View>
  );
};

export default BarChartComponent;