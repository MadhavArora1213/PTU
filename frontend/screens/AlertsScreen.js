import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { onNotification, onLocalFraudAlert } from '../services/notificationService';

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Listen for notifications
    const notificationListener = onNotification((notification) => {
      setAlerts(prevAlerts => [notification, ...prevAlerts]);
      Alert.alert('New Alert', notification.message);
    });

    // Listen for local fraud alerts
    const fraudAlertListener = onLocalFraudAlert((alert) => {
      setAlerts(prevAlerts => [alert, ...prevAlerts]);
      Alert.alert('Fraud Alert', alert.message);
    });

    return () => {
      // Clean up listeners
      if (notificationListener) notificationListener.off();
      if (fraudAlertListener) fraudAlertListener.off();
    };
  }, []);

  const renderAlert = ({ item }) => {
    const isFraudAlert = item.type === 'fraud';
    
    return (
      <View style={[styles.alertCard, isFraudAlert && styles.fraudAlert]}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.alertTime}>{item.time}</Text>
        </View>
        <Text style={styles.alertMessage}>{item.message}</Text>
        {isFraudAlert && item.location && (
          <Text style={styles.locationText}>
            Location: {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Real-Time Alerts</Text>
        <Text style={styles.subtitle}>Stay informed about financial threats</Text>
      </View>

      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.alertsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No alerts yet</Text>
          </View>
        }
      />
    </View>
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
  alertsList: {
    padding: 20,
  },
  alertCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fraudAlert: {
    borderLeftWidth: 5,
    borderLeftColor: '#ff6b6b',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  alertTime: {
    fontSize: 14,
    color: '#999',
  },
  alertMessage: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  locationText: {
    fontSize: 14,
    color: '#2E8B57',
    marginTop: 10,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});

export default AlertsScreen;