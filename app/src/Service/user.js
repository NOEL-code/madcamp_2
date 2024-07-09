import api from '../utils/api'; // Adjust the import path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {setUser} from '../redux/userSlice'; // Adjust the import path as needed

export const fetchLogin = async (email, password) => {
  try {
    const response = await api.post('/users/login', {
      userEmail: email,
      userPassword: password,
    });
    console.log('Login response:', response.data);
    const {accessToken, refreshToken, resUser} = response.data;
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    return resUser;
  } catch (error) {
    if (error.response) {
      console.log('Error response data:', error.response.data); // 오류 응답 데이터 로그
      Alert.alert(
        '로그인 실패',
        error.response.data.message || '이메일 또는 비밀번호가 잘못되었습니다.',
      );
    } else {
      Alert.alert('로그인 실패', '서버와의 통신에 문제가 발생했습니다.');
    }
    console.error('Login error', error);
    return {success: false};
  }
};

export const fetchImage = async (formData, user, dispatch) => {
  try {
    const res = await api.post('/users/update/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Image uploaded successfully: ', res.data);

    // Redux 상태 업데이트
    dispatch(
      setUser({
        ...user,
        photoUrl: res.data.imageUrl,
      }),
    );
  } catch (error) {
    console.error('Error uploading image: ', error);
  }
};

export const verifyUserImage = async (imageUri, userId) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  });
  formData.append('userId', userId);

  try {
    const response = await api.post(`/verify/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Image uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading image with user ID:', error);
  }
};

export const fetchLogout = async () => {
  try {
    await api.get('/users/logout');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    return {success: true};
  } catch (error) {
    console.error('Logout error:', error);
    return {success: false};
  }
};
