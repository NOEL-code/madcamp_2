import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import api from '../../utils/api';

const JoinRoomScreen = ({navigation}) => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);

  console.log(currentUser);
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      Alert.alert('오류', '방 목록을 가져오는데 실패했습니다.');
    }
  };

  const handleSelect = index => {
    setSelectedRoomIndex(index);
    handleApply(index); // 참여 신청 전송
  };

  const handleApply = async index => {
    const selectedRoom = rooms[index];
    try {
      const response = await api.post('/apply', {
        userId: currentUser.id,
        roomId: selectedRoom._id,
      });
      if (response.status === 200) {
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Failed to apply for room:', error);
      Alert.alert('신청 실패', '참여 신청을 전송하는데 실패했습니다.');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Main');
  };

  const filteredRooms = rooms.filter(room => room.roomName.includes(search));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>참여 신청</Text>
        <TouchableOpacity
          onPress={() => {}}
          style={[
            styles.headerButton,
            selectedRoomIndex === null && styles.headerButtonDisabled,
          ]}
        />
      </View>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="방 검색"
          placeholderTextColor="#888"
          value={search}
          onChangeText={text => setSearch(text)}
        />
      </View>
      <ScrollView style={styles.list}>
        {filteredRooms.map((room, index) => (
          <View key={index} style={styles.roomItem}>
            <Image
              source={require('assets/images/joinRoomProfile.png')}
              style={styles.profileIcon}
            />
            <Text style={styles.roomName}>{room.roomName}</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                selectedRoomIndex === index && styles.selectedButton,
              ]}
              onPress={() => handleSelect(index)}>
              <Text style={styles.joinText}>참여</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Image
            source={require('assets/images/statistics.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('assets/images/home.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('assets/images/myPage.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>참여 신청이 완료 되었습니다.</Text>
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
  list: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  searchBox: {
    padding: 15,
  },
  headerButton: {
    fontSize: 18,
  },
  headerButtonText: {
    color: 'black',
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerButtonTextDisabled: {
    color: '#888',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    margin: 15,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  profileIcon: {
    width: 50,
    height: 50,
  },
  roomName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  selectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#6DDD5B',
    borderRadius: 10,
  },
  selectedButton: {
    backgroundColor: '#03CF5D',
  },
  joinText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navIcon: {
    width: 30,
    height: 30,
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

export default JoinRoomScreen;
