import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput
} from 'react-native';


const LogIn = ({navigation}) => {
    return (
    <View style={styles.container}>
        <Text style={styles.appName}>앱이름앱이름앱이름</Text>
        <Text style={styles.welcomeText}>환영합니다!</Text>

        <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>아이디</Text>
                <TextInput style={styles.input} placeholder="아이디" placeholderTextColor="#FFFFFF"/>
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput style={styles.input} placeholder="비밀번호" placeholderTextColor="#FFFFFF" secureTextEntry={true}/>
            </View>
            <TouchableOpacity
                style={styles.signUpButton}
                onPress = {gotoMain}
            >
        </TouchableOpacity>
        </View>

        <TouchableOpacity
            style={styles.logInButton}
            onPress = {() => navigation.navigate('SignUp')}
            >
            <Text style={styles.signUpText}>아직 회원이 아니신가요?</Text>
        </TouchableOpacity>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // 전체 배경 흰색
        paddingHorizontal: 24,
      },
      appName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
      },
      welcomeText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
      },
      inputContainer: {
        backgroundColor: '#00C853', // 녹색 배경
        padding: 20,
        borderRadius: 10,
        width: '100%',
        marginBottom: 20,
      },
      inputWrapper: {
        marginBottom: 15,
      },
      label: {
        color: '#FFFFFF',
        fontSize: 20,
        marginBottom: 15,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
      },
      signUpButton: {
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginBottom: 20,
      },
      logInButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginBottom: 20,
      },
      signUpText: {
        color: '#000000',
        fontSize: 15,
      },
});

export default LogIn;
