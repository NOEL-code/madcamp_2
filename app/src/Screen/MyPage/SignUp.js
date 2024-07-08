import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import api from '../../utils/api'; // api 설정 파일 불러오기

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSignUp = async () => {
    try {
      // 서버로 이미지 업로드
      let photoUrl = '';
      if (photo) {
        const formData = new FormData();
        formData.append('image', {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName,
        });

        const uploadResponse = await api.post('/users/create/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        photoUrl = uploadResponse.data.imageUrl;
      }

      const response = await api.post('/users/register', {
        userEmail: email,
        userPassword: password,
        name: name,
        phoneNumber: phoneNumber,
        photoUrl: photoUrl
      });

      console.log(response.data);
      const { accessToken, refreshToken } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error('Invalid response from server');
      }

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      navigation.navigate('LogIn');
    } catch (error) {
      if (error.response) {
        console.log('Error response data:', error.response.data); // 오류 응답 데이터 로그
        Alert.alert(
          '회원가입 실패',
          error.response.data.message || '회원가입 중 오류가 발생했습니다.'
        );
      } else {
        Alert.alert('회원가입 실패', '서버와의 통신에 문제가 발생했습니다.');
      }
      console.error('SignUp error', error);
    }
  };

  const handleImageChange = async () => {
    const permission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (permission === RESULTS.GRANTED) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxWidth: 300,
          maxHeight: 300,
          quality: 1,
        },
        async response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.assets && response.assets.length > 0) {
            const source = {
              uri: response.assets[0].uri,
              type: response.assets[0].type,
              fileName: response.assets[0].fileName,
            };
            setPhoto(source);
          }
        },
      );
    } else {
      const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission denied',
          'You need to grant storage permissions to change the profile image.',
        );
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('assets/images/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <Text style={styles.title}>회원가입</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="이름"
          placeholderTextColor="#D9D9D9"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#D9D9D9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#D9D9D9"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>전화번호</Text>
        <TextInput
          style={styles.input}
          placeholder="전화번호"
          placeholderTextColor="#D9D9D9"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>프로필 사진</Text>
        <TouchableOpacity onPress={handleImageChange}>
          <View style={styles.imagePicker}>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>사진 선택</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.arrowButton} onPress={handleSignUp}>
        <Text style={styles.arrowButtonText}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#00C853',
    paddingVertical: 5,
    fontSize: 16,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#00C853',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  imagePickerText: {
    color: '#00C853',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  arrowButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#00C853',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  arrowButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginBottom: 20,
  },
});

export default SignUp;
