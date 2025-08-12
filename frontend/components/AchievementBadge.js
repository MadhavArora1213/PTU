import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AchievementBadge = ({ name, points, size = 80 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.badge}>
        <Text style={styles.points}>{points}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2E8B57',
    marginBottom: 5,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  name: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default AchievementBadge;