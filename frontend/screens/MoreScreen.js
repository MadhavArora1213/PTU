import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../context/LanguageContext';

const MoreScreen = ({ navigation }) => {
  const { translate } = useLanguage();

  const menuItems = [
    {
      id: 1,
      title: 'Settings',
      description: 'App settings and preferences',
      icon: 'settings',
      action: () => navigation.navigate('Profile'),
      color: '#2E7D32'
    },
    {
      id: 2,
      title: 'About Us',
      description: 'Learn more about ArthRakshak',
      icon: 'info',
      action: () => showAboutUs(),
      color: '#388E3C'
    },
    {
      id: 3,
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: 'help',
      action: () => showHelpSupport(),
      color: '#43A047'
    },
    {
      id: 4,
      title: 'Privacy Policy',
      description: 'Read our privacy policy',
      icon: 'privacy-tip',
      action: () => showPrivacyPolicy(),
      color: '#4CAF50'
    },
    {
      id: 5,
      title: 'Terms of Service',
      description: 'Terms and conditions',
      icon: 'description',
      action: () => showTermsOfService(),
      color: '#66BB6A'
    },
    {
      id: 6,
      title: 'Rate App',
      description: 'Rate us on the app store',
      icon: 'star-rate',
      action: () => rateApp(),
      color: '#FFEB3B'
    },
    {
      id: 7,
      title: 'Share App',
      description: 'Share ArthRakshak with friends',
      icon: 'share',
      action: () => shareApp(),
      color: '#FF9800'
    },
    {
      id: 8,
      title: 'Feedback',
      description: 'Send us your feedback',
      icon: 'feedback',
      action: () => sendFeedback(),
      color: '#9C27B0'
    }
  ];

  const showAboutUs = () => {
    Alert.alert(
      translate('About ArthRakshak', 'About ArthRakshak'),
      translate('ArthRakshak is your comprehensive financial safety and education companion, powered by Punjab National Bank. We help you make informed financial decisions, protect against fraud, and build a secure financial future.', 'ArthRakshak is your comprehensive financial safety and education companion, powered by Punjab National Bank. We help you make informed financial decisions, protect against fraud, and build a secure financial future.'),
      [{ text: translate('OK', 'OK') }]
    );
  };

  const showHelpSupport = () => {
    Alert.alert(
      translate('Help & Support', 'Help & Support'),
      translate('Need help? Contact our support team:\n\nEmail: support@arthrakshak.com\nPhone: 1800-XXX-XXXX\n\nOr visit our help center for FAQs and guides.', 'Need help? Contact our support team:\n\nEmail: support@arthrakshak.com\nPhone: 1800-XXX-XXXX\n\nOr visit our help center for FAQs and guides.'),
      [
        { text: translate('Cancel', 'Cancel'), style: 'cancel' },
        { 
          text: translate('Email Support', 'Email Support'), 
          onPress: () => Linking.openURL('mailto:support@arthrakshak.com') 
        }
      ]
    );
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      translate('Privacy Policy', 'Privacy Policy'),
      translate('Your privacy is important to us. We collect and use your information to provide better financial services while keeping your data secure. For detailed information, please visit our website.', 'Your privacy is important to us. We collect and use your information to provide better financial services while keeping your data secure. For detailed information, please visit our website.'),
      [{ text: translate('OK', 'OK') }]
    );
  };

  const showTermsOfService = () => {
    Alert.alert(
      translate('Terms of Service', 'Terms of Service'),
      translate('By using ArthRakshak, you agree to our terms and conditions. Please use the app responsibly and follow all financial regulations in your region.', 'By using ArthRakshak, you agree to our terms and conditions. Please use the app responsibly and follow all financial regulations in your region.'),
      [{ text: translate('OK', 'OK') }]
    );
  };

  const rateApp = () => {
    Alert.alert(
      translate('Rate ArthRakshak', 'Rate ArthRakshak'),
      translate('Enjoying ArthRakshak? Please rate us on the app store to help others discover our financial safety tools!', 'Enjoying ArthRakshak? Please rate us on the app store to help others discover our financial safety tools!'),
      [
        { text: translate('Cancel', 'Cancel'), style: 'cancel' },
        { text: translate('Rate Now', 'Rate Now'), onPress: () => console.log('Open app store rating') }
      ]
    );
  };

  const shareApp = () => {
    Alert.alert(
      translate('Share ArthRakshak', 'Share ArthRakshak'),
      translate('Help your friends and family stay financially safe! Share ArthRakshak with them.', 'Help your friends and family stay financially safe! Share ArthRakshak with them.'),
      [
        { text: translate('Cancel', 'Cancel'), style: 'cancel' },
        { text: translate('Share', 'Share'), onPress: () => console.log('Open share dialog') }
      ]
    );
  };

  const sendFeedback = () => {
    Alert.alert(
      translate('Send Feedback', 'Send Feedback'),
      translate('We value your feedback! Help us improve ArthRakshak by sharing your thoughts and suggestions.', 'We value your feedback! Help us improve ArthRakshak by sharing your thoughts and suggestions.'),
      [
        { text: translate('Cancel', 'Cancel'), style: 'cancel' },
        { 
          text: translate('Send Email', 'Send Email'), 
          onPress: () => Linking.openURL('mailto:feedback@arthrakshak.com?subject=App Feedback') 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{translate('More', 'More')}</Text>
        <Text style={styles.subtitle}>{translate('Additional features and settings', 'Additional features and settings')}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Icon name={item.icon} size={24} color="#FFFDE7" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                {translate(item.title, item.title)}
              </Text>
              <Text style={styles.menuDescription}>
                {translate(item.description, item.description)}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color="#388E3C" />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          {translate('ArthRakshak v1.0.0', 'ArthRakshak v1.0.0')}
        </Text>
        <Text style={styles.versionSubtext}>
          {translate('Powered by Punjab National Bank', 'Powered by Punjab National Bank')}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7', // Cream background
  },
  header: {
    backgroundColor: '#2E7D32', // Primary color
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFDE7', // Cream text
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFDE7', // Cream text
    opacity: 0.9,
    marginTop: 5,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#388E3C',
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default MoreScreen;