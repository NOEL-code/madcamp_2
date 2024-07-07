import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

const SignUp = ({navigation}) => {
  const gotoLogIn = () => {
    navigation.navigate('LogIn');
  };

  const gotoMain = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={gotoLogIn}></TouchableOpacity>

      <Text style={styles.title}>회원가입</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="이름"
          placeholderTextColor="#D9D9D9"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>아이디</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputWithButton]}
            placeholder="아이디"
            placeholderTextColor="#D9D9D9"
          />
          <TouchableOpacity style={styles.checkButton}>
            <Text style={styles.checkButtonText}>중복확인</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#D9D9D9"
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.arrowButton} onPress={gotoMain}>
        <Text style={styles.arrowButtonText}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithButton: {
    flex: 1,
  },
  checkButton: {
    backgroundColor: '#00C853',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
});

export default SignUp;
