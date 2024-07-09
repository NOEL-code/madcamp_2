import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { launchCamera } from 'react-native-image-picker';
import api from '../../utils/api';

const CameraScreen = ({ route, navigation }) => {
  const { members } = route.params;
  const [inputName, setInputName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const checkMemberName = () => {
    const member = members.find(member => member.userId.name === inputName);

    if (member) {
      console.log('success: Member found!');
      setSelectedUserId(member.userId._id);
    } else {
      console.log('fail: Member not found!');
      setSelectedUserId(null);
    }
  };

  const recordArrival = async () => {
    if (!selectedUserId) {
      console.log('fail: No member selected!');
      return;
    }
    try {
      const response = await api.post(`/attendance/arrival/${selectedUserId}`);
      if (response.status === 200) {
        console.log('success: Arrival recorded!');
      } else {
        console.log('fail: Unable to record arrival!');
      }
    } catch (error) {
      console.error('Error recording arrival:', error);
      console.log('fail: Unable to record arrival!');
    }
  };

  const recordGoOut = async () => {
    if (!selectedUserId) {
      console.log('fail: No member selected!');
      return;
    }
    try {
      const response = await api.post(`/attendance/goout/${selectedUserId}`);
      if (response.status === 200) {
        console.log('success: Go out recorded!');
      } else {
        console.log('fail: Unable to record go out!');
      }
    } catch (error) {
      console.error('Error recording go out:', error);
      console.log('fail: Unable to record go out!');
    }
  };

  const recordComeBack = async () => {
    if (!selectedUserId) {
      console.log('fail: No member selected!');
      return;
    }
    try {
      const response = await api.post(`/attendance/comeback/${selectedUserId}`);
      if (response.status === 200) {
        console.log('success: Come back recorded!');
      } else {
        console.log('fail: Unable to record come back!');
      }
    } catch (error) {
      console.error('Error recording come back:', error);
      console.log('fail: Unable to record come back!');
    }
  };

  const recordLeave = async () => {
    if (!selectedUserId) {
      console.log('fail: No member selected!');
      return;
    }
    try {
      const response = await api.post(`/attendance/leave/${selectedUserId}`);
      if (response.status === 200) {
        console.log('success: Leave recorded!');
      } else {
        console.log('fail: Unable to record leave!');
      }
    } catch (error) {
      console.error('Error recording leave:', error);
      console.log('fail: Unable to record leave!');
    }
  };

  const handleCameraPress = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const source = { uri: response.assets[0].uri };
          setPhoto(source);
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleCameraPress}>
        <View style={styles.cameraContainer}>
          {photo ? (
            <Image source={photo} style={styles.photo} />
          ) : (
            <Image
              source={require('assets/images/camera.png')}
              style={styles.cameraIcon}
            />
          )}
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter member name"
        value={inputName}
        onChangeText={setInputName}
      />
      <TouchableOpacity onPress={checkMemberName}>
        <Text>Check Member</Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={recordArrival}>
          <Text style={styles.buttonText}>출근</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={recordGoOut}>
          <Text style={styles.buttonText}>자리비움</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={recordComeBack}>
          <Text style={styles.buttonText}>복귀</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={recordLeave}>
          <Text style={styles.buttonText}>퇴근</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  cameraContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  cameraIcon: {
    width: 100,
    height: 100,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '80%',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#03CF5D',
    paddingVertical: 15,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CameraScreen;
