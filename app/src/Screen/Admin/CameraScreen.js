import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useSelector} from 'react-redux';
import api, {verifyUserImage} from '../../utils/api'; // Adjust the import path as needed

const CameraScreen = ({route, navigation}) => {
  const {members, roomId} = route.params;
  const [inputName, setInputName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const user = useSelector(state => state.user); // Adjust the path according to your store

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.CAMERA);
    if (result !== RESULTS.GRANTED) {
      const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (requestResult !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission denied',
          'You need to grant camera permissions to use this feature.',
        );
      }
    }
  };

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

  const recordAttendance = async action => {
    if (!selectedUserId) {
      console.log(`fail: No member selected for ${action}!`);
      Alert.alert('실패', '회원을 선택하지 않았습니다.');
      return;
    }
    try {
      const response = await api.post(
        `/attendance/${action}/${selectedUserId}`,
      );
      if (response.status === 200) {
        console.log(`success: ${action} recorded!`);
        Alert.alert('성공', `${action} 기록 완료!`, [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('TeamAdmin', {roomId});
            },
          },
        ]);
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
    check(PERMISSIONS.ANDROID.CAMERA).then(result => {
      if (result === RESULTS.GRANTED) {
        launchCameraFunction();
      } else {
        request(PERMISSIONS.ANDROID.CAMERA).then(newResult => {
          if (newResult === RESULTS.GRANTED) {
            launchCameraFunction();
          } else {
            Alert.alert(
              'Permission denied',
              'You need to grant camera permissions to use this feature.',
            );
          }
        });
      }
    });
  };

  const launchCameraFunction = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const source = {uri: response.assets[0].uri};
          setPhoto(source);
          const resultVerify = verifyUserImage(response.assets[0].uri, user.id);
          console.log(resultVerify);
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
              source={require('../../../assets/images/camera.png')}
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => recordAttendance('arrival')}>
          <Text style={styles.buttonText}>출근</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => recordAttendance('goout')}>
          <Text style={styles.buttonText}>자리비움</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => recordAttendance('comeback')}>
          <Text style={styles.buttonText}>복귀</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => recordAttendance('leave')}>
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
