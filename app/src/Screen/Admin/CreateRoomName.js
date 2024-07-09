import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import api from '../../utils/api';

const CreateRoomNameScreen = ({navigation}) => {
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const {memberIds} = useSelector(state => state.createRoom);
  const currentUser = useSelector(state => state.user); // currentUser를 가져옴

  console.log(memberIds);

  const handleNameChange = text => {
    if (text.length <= 9) {
      setRoomName(text);
    }
  };

  const handleDescriptionChange = text => {
    setDescription(text);
  };

  const handleSubmit = async () => {
    if (roomName.trim()) {
      try {
        await api.post('/rooms/create', {
          roomName,
          roomDescription,
          host: currentUser.id,
          members: memberIds.map(id => ({userId: id})),
        });
        setModalVisible(true);
      } catch (error) {
        console.error('Failed to create room:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Main');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('assets/images/back.png')}
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
          onChangeText={handleNameChange}
        />

        <Text style={styles.config}>방 설명을 작성해 주세요.</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="방 설명"
          placeholderTextColor="#888"
          value={roomDescription}
          onChangeText={handleDescriptionChange}
          multiline
        />

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginTop: 20,
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
  descriptionInput: {
    width: '80%',
    height: 100,
    margin: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    textAlignVertical: 'top',
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

export default CreateRoomNameScreen;
