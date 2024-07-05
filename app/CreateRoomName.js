import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

const CreateRoomScreen = ({navigation}) => {
  const [roomName, setRoomName] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = text => {
    if (text.length <= 9) {
      setRoomName(text);
      setCharCount(text.length);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('./assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>방 생성</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Main');
          }}>
          <Text style={styles.headerButton}>완료</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.config}>방 이름 설정</Text>
        <TextInput
          style={styles.roomInput}
          placeholder="방 이름"
          placeholderTextColor="#888"
          value={roomName}
          onChangeText={handleInputChange}
        />
        <Text style={styles.charCount}>{charCount}/9</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerButton: {
    fontSize: 18,
    color: 'black',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  config: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    width: '80%',
    fontSize: 16,
    marginBottom: 10,
    marginLeft: '13%', // You can adjust this value to position it precisely as needed
  },
  roomInput: {
    width: '80%',
    margin: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    textAlign: 'center',
  },
  charCount: {
    fontSize: 16,
    color: '#888',
  },
});

export default CreateRoomScreen;
