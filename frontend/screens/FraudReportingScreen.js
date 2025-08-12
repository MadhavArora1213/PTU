import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Modal, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { submitFraudReport, getFraudReports, verifyFraudReport } from '../services/fraudService';
import { connectSocket, joinRoom } from '../services/notificationService';

const FraudReportingScreen = () => {
  const [reports, setReports] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [userPoints, setUserPoints] = useState(1250); // Mock user points
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchFraudReports();
    getCurrentLocation();
    
    // Connect to socket
    connectSocket().then(() => {
      if (userId) {
        joinRoom(userId);
      }
    });
  }, [userId]);

  const fetchFraudReports = async () => {
    try {
      const response = await getFraudReports();
      setReports(response.reports);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch fraud reports');
    }
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to tag reports');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const submitReport = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location is required to submit a report');
      return;
    }

    try {
      const reportData = {
        title,
        description,
        locationLat: location.latitude,
        locationLng: location.longitude,
        imageUrl: image || null
      };
      
      const response = await submitFraudReport(reportData);
      
      // Update local state
      setReports([response.report, ...reports]);
      setUserPoints(userPoints + 50); // Reward points for submitting report
      
      // Reset form
      setModalVisible(false);
      setTitle('');
      setDescription('');
      setImage(null);
      
      Alert.alert('Success', 'Fraud report submitted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit fraud report');
    }
  };

  const verifyReport = async (reportId) => {
    try {
      const response = await verifyFraudReport(reportId);
      
      // Update local state
      const updatedReports = reports.map(report => {
        if (report.id === reportId) {
          return response.report;
        }
        return report;
      });
      
      setReports(updatedReports);
      setUserPoints(userPoints + 50); // Reward points for verification
      
      Alert.alert('Success', 'Report verified and reward points added');
    } catch (error) {
      Alert.alert('Error', 'Failed to verify report');
    }
  };

  const renderReports = () => {
    return reports.map((report) => (
      <View key={report.id} style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>{report.title}</Text>
          <View style={[
            styles.statusBadge, 
            report.status === 'verified' ? styles.verifiedStatus : styles.pendingStatus
          ]}>
            <Text style={styles.statusText}>
              {report.status === 'verified' ? 'Verified' : 'Pending'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.reportDescription}>{report.description}</Text>
        
        <View style={styles.reportMeta}>
          <Text style={styles.reportDate}>Reported on: {new Date(report.created_at).toLocaleDateString()}</Text>
          {report.reward_points > 0 && (
            <Text style={styles.rewardPoints}>+{report.reward_points} points</Text>
          )}
        </View>
        
        {report.status === 'pending' && (
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={() => verifyReport(report.id)}
          >
            <Text style={styles.verifyButtonText}>Verify Report</Text>
          </TouchableOpacity>
        )}
        
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(report.location_lat),
            longitude: parseFloat(report.location_lng),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker 
            coordinate={{
              latitude: parseFloat(report.location_lat),
              longitude: parseFloat(report.location_lng)
            }} 
          />
        </MapView>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Fraud Shield</Text>
        <Text style={styles.subtitle}>Report and verify financial scams in your area</Text>
      </View>

      <View style={styles.pointsCard}>
        <Text style={styles.pointsTitle}>Your Contribution Points</Text>
        <Text style={styles.pointsValue}>{userPoints} points</Text>
      </View>

      <TouchableOpacity 
        style={styles.reportButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.reportButtonText}>+ Report Fraud</Text>
      </TouchableOpacity>

      <View style={styles.reportsContainer}>
        {renderReports()}
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report Fraud</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Brief title of the fraud"
            />
            
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Detailed description of the fraud"
              multiline
            />
            
            <Text style={styles.label}>Location</Text>
            {location ? (
              <Text style={styles.locationText}>
                Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
              </Text>
            ) : (
              <Text style={styles.locationText}>Location not available</Text>
            )}
            
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={getCurrentLocation}
            >
              <Text style={styles.locationButtonText}>Update Location</Text>
            </TouchableOpacity>
            
            <Text style={styles.label}>Image Evidence</Text>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.noImageText}>No image selected</Text>
            )}
            
            <TouchableOpacity 
              style={styles.imageButton}
              onPress={pickImage}
            >
              <Text style={styles.imageButtonText}>Select Image</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={submitReport}
            >
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
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
  pointsCard: {
    backgroundColor: '#FFD700',
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
  pointsTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  reportButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportsContainer: {
    padding: 20,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  verifiedStatus: {
    backgroundColor: '#e8f5e9',
  },
  pendingStatus: {
    backgroundColor: '#fff8e1',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  reportDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 22,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  reportDate: {
    fontSize: 14,
    color: '#999',
  },
  rewardPoints: {
    fontSize: 14,
    color: '#2E8B57',
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#2E8B57',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    height: 150,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    backgroundColor: '#2E8B57',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    fontSize: 24,
    color: 'white',
  },
  modalContent: {
    padding: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: '#2E8B57',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FraudReportingScreen;