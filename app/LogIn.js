import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';

const LogIn = ({navigation}) => {
    return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>회원가입</Text>

        <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>이름</Text>
                <TextInput style={styles.input} placeholder="이름" placeholderTextColor="#C7C7CD"/>
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>아이디</Text>
                <View style={styles.inputRow}>
                    <TextInput style={styles.inputWithButton} placeholder="아이디" placeholderTextColor="#C7C7CD"/>
                    <TouchableOpacity style={styles.checkButton}>
                        <Text style={styles.checkButtonText}>중복검사</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput style={styles.input} placeholder="비밀번호" placeholderTextColor="#C7C7CD" secureTextEntry={true}/>
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>전화번호</Text>
                <TextInput style={styles.input} placeholder="전화번호" placeholderTextColor="#C7C7CD"/>
            </View>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('Main')}>
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
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputWithButton: {
        flex: 1,
        height: 50,
        borderColor: '#E5E5EA',
        borderWidth: 1,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
    },
    checkButton: {
        marginLeft: 10,
        height: 50,
        width: 90,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#03CF5D',
        borderRadius: 14,
    },
    checkButtonText: {
        color: '#FFF',
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
