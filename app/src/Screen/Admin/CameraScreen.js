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
      Alert.alert('성공', '회원이 확인되었습니다.');
    } else {
      console.log('fail: Member not found!');
      setSelectedUserId(null);
      Alert.alert('실패', '회원을 찾을 수 없습니다.');
    }
  };

  const recordAttendance = async (action) => {
    if (!selectedUserId) {
      console.log(`fail: No member selected for ${action}!`);
      Alert.alert('실패', '회원을 선택하지 않았습니다.');
      return;
    }
    try {
      const response = await api.post(`/attendance/${action}/${selectedUserId}`);
      if (response.status === 200) {
        console.log(`success: ${action} recorded!`);
        Alert.alert('성공', `${action} 기록 완료!`);
      } else {
        console.log(`fail: Unable to record ${action}!`);
        Alert.alert('실패', `${action} 기록 실패!`);
      }
    } catch (error) {
      console.error(`Error recording ${action}:`, error);
      console.log(`fail: Unable to record ${action}!`);
      Alert.alert('실패', `${action} 기록 중 오류 발생!`);
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
      <TouchableOpacity style={styles.checkButton} onPress={checkMemberName}>
        <Text style={styles.checkButtonText}>Check Member</Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => recordAttendance('arrival')}>
          <Text style={styles.buttonText}>출근</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => recordAttendance('goout')}>
          <Text style={styles.buttonText}>자리비움</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => recordAttendance('comeback')}>
          <Text style={styles.buttonText}>복귀</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => recordAttendance('leave')}>
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
    alignSelf: 'center',
  },
  checkButton: {
    backgroundColor: '#03CF5D',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
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
