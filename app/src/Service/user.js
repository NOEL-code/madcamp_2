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
    console.log('Image uploaded successfully: ', res);

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
    return response.data;
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
