import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/userSlice'; // Adjust the import path as needed
import { fetchLogin } from '../../Service/user'; // Adjust the import path as needed

const LogIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const handleLogin = async () => {

    try {
    const result = await fetchLogin(email, password);

      if (!result || result.error || !result.id) {
        Alert.alert('로그인 실패', '아이디와 비밀번호를 확인해주세요.');
      } else {
        const userData = result;
        console.log(userData);
        dispatch(
          setUser({
            id: userData.id,
            phoneNumber: userData.phoneNumber,
            photoUrl: userData.photoUrl,
            userName: userData.name,
            userEmail: userData.userEmail,
          }),
        );
        console.log('Redux User State:', user); // Redux에 저장된 사용자 정보 출력
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('로그인 실패', '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <Text style ={styles.subTitle}>환영합니다!</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor="#C7C7CD"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#C7C7CD"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>

      <TouchableOpacity style={styles.logInButton} onPress={handleLogin}>
        <Text style={styles.logInButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
      <Text style = {styles.question}>아직 회원이 아니신가요?</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>회원가입</Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50,
  },
  title: { // 로그인
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: { // 환영합니다 
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputWrapper: { // 아이디 비번 입력창임 ㅋㅋ
    marginBottom: 15,
  },
  input: {
    height: 70,
    width: 350,
    borderColor: '#E5E5EA',
    borderWidth: 2,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
  },
  logInButton: {
    marginTop: 10,
    marginBottom: 30,
    width: 350,
    height: 70,
    backgroundColor: '#03CF5D',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signUpContainer: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  question: { // 아직 회원이 아니신가요? 
    color: '#5F5F5F',
    fontsize: 10,
    marginBottom: 5,
    alignItems: 'center'
  },
  signUpText: { // 회원가입
    color: '#5F5F5F',
    borderBottomWidth: 1,
    borderBottomColor: '#5F5F5F',
    fontsize: 10,
    alignItems: 'center',
    fontWeight: 'bold'
  }
});

export default LogIn;
