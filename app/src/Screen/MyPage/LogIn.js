import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../redux/userSlice'; // Adjust the import path as needed
import {fetchLogin} from '../../Service/user'; // Adjust the import path as needed

const LogIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const handleLogin = async () => {
    try {
      console.log('로그인 누름');

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
      Alert.alert(
        '로그인 실패',
        '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor="#C7C7CD"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#C7C7CD"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
        <Text style={styles.signUpButtonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonText: {
    fontSize: 20,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  signUpButton: {
    marginTop: 30,
    height: 50,
    backgroundColor: '#03CF5D',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default LogIn;
