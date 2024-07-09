import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // 백엔드 API 서버 주소로 설정
  // baseURL: 'http://172.10.7.110:80/api', // 백엔드 API 서버 주소로 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      try {
        const response = await api.post('/users/refresh-token', {refreshToken});
        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;
          await AsyncStorage.setItem('accessToken', newAccessToken);
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
