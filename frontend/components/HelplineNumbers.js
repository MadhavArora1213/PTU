import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../context/LanguageContext';

const HelplineNumbers = () => {
  const { translate } = useLanguage();

  const helplineData = [
    {
      id: 1,
      name: 'Cyber Crime Helpline',
      number: '1930',
      description: 'Report cyber crimes and financial frauds',
      icon: 'security',
      color: '#2E7D32'
    },
    {
      id: 2,
      name: 'Banking Ombudsman',
      number: '14448',
      description: 'Banking complaints and grievances',
      icon: 'account-balance',
      color: '#388E3C'
    },
    {
      id: 3,
      name: 'Consumer Helpline',
      number: '1915',
      description: 'Consumer protection and complaints',
      icon: 'support-agent',
      color: '#43A047'
    },
    {
      id: 4,
      name: 'RBI Helpline',
      number: '14440',
      description: 'Reserve Bank of India assistance',
      icon: 'business',
      color: '#4CAF50'
    }
  ];

  const makeCall = (number, name) => {
    Alert.alert(
      translate('Call Helpline', 'Call Helpline'),
      translate(`Do you want to call ${name}?`, `Do you want to call ${name}?`),
      [
        {
          text: translate('Cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: translate('Call', 'Call'),
          onPress: () => {
            Linking.openURL(`tel:${number}`).catch(err => {
              Alert.alert(
                translate('Error', 'Error'),
                translate('Unable to make call', 'Unable to make call')
              );
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {translate('Emergency Helplines', 'Emergency Helplines')}
      </Text>
      <Text style={styles.sectionSubtitle}>
        {translate('Tap to call for immediate assistance', 'Tap to call for immediate assistance')}
      </Text>
      
      <View style={styles.helplineGrid}>
        {helplineData.map((helpline) => (
          <TouchableOpacity
            key={helpline.id}
            style={[styles.helplineCard, { borderLeftColor: helpline.color }]}
            onPress={() => makeCall(helpline.number, helpline.name)}
            activeOpacity={0.7}
          >
            <View style={styles.helplineHeader}>
              <View style={[styles.iconContainer, { backgroundColor: helpline.color }]}>
                <Icon name={helpline.icon} size={24} color="#FFFDE7" />
              </View>
              <View style={styles.helplineInfo}>
                <Text style={styles.helplineName}>
                  {translate(helpline.name, helpline.name)}
                </Text>
                <Text style={styles.helplineNumber}>{helpline.number}</Text>
              </View>
              <Icon name="phone" size={20} color={helpline.color} />
            </View>
            <Text style={styles.helplineDescription}>
              {translate(helpline.description, helpline.description)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Additional emergency info */}
      <View style={styles.emergencyInfo}>
        <Icon name="info" size={16} color="#388E3C" />
        <Text style={styles.emergencyText}>
          {translate('These are toll-free numbers available 24/7', 'These are toll-free numbers available 24/7')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFDE7', // Cream background
    padding: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32', // Primary color
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#388E3C', // Secondary color
    textAlign: 'center',
    marginBottom: 20,
  },
  helplineGrid: {
    gap: 12,
  },
  helplineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  helplineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helplineInfo: {
    flex: 1,
  },
  helplineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 2,
  },
  helplineNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFEB3B', // Accent color
    letterSpacing: 1,
  },
  helplineDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  emergencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
  },
  emergencyText: {
    fontSize: 12,
    color: '#388E3C',
    marginLeft: 5,
    fontStyle: 'italic',
  },
});

export default HelplineNumbers;