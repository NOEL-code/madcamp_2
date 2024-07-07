import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';

const CreateRoomScreen = ({navigation}) => {
  const [roomName, setRoomName] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleInputChange = text => {
    if (text.length <= 9) {
      setRoomName(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = () => {
    if (roomName.trim()) {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Main');
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
      </View>
      <View style={styles.content}>
        <Text style={styles.config}>방 이름을 작성해 주세요.</Text>
        <TextInput
          style={styles.roomInput}
          placeholder="방 이름"
          placeholderTextColor="#888"
          value={roomName}
          onChangeText={handleInputChange}
        />
        <Text style={styles.charCount}>{charCount}/9</Text>

        <TouchableOpacity
          style={[styles.button, !roomName.trim() && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!roomName.trim()}>
          <Text style={styles.create}>방 생성하기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>방 생성이 완료 되었습니다.</Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={styles.modalButton}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  create: {
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    marginLeft: 130,
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 30,
    width: 150,
    height: 50,
    backgroundColor: '#6DDD5B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6DDD5B80', // lighter green color to indicate disabled state
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
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: '13%', // You can adjust this value to position it precisely as needed
  },
  roomInput: {
    width: '60%',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    fontSize: 18,
    color: '#03CF5D',
  },
});

export default CreateRoomScreen;
