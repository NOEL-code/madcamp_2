import api from '../utils/api'; // Adjust the import path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

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
