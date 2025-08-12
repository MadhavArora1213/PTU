import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AchievementBadge from './AchievementBadge';

const Leaderboard = ({ users }) => {
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.row}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>
        <View style={styles.userContainer}>
          <Text style={styles.userName}>{item.name}</Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{item.points} pts</Text>
        </View>
        <View style={styles.badgeContainer}>
          <AchievementBadge name={item.badge} points={item.points} size={50} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rankContainer: {
    width: 30,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    color: '#333',
  },
  pointsContainer: {
    width: 80,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  badgeContainer: {
    width: 60,
    alignItems: 'center',
  },
});

export default Leaderboard;