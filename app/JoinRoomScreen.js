import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';

const initialRoom = [
  {name: '방1'},
  {name: '방2'},
  {name: '방3'},
  {name: '방4'},
  {name: '방5'},
  {name: '방6'},
];

const JoinRoomScreen = ({navigation}) => {
  const [rooms, setRooms] = useState(initialRoom);
  const [search, setSearch] = useState('');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = index => {
    setSelectedRoomIndex(index);
  };

  const handleSubmit = () => {
    if (selectedRoomIndex !== null) {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Main');
  };

  const filteredRooms = rooms.filter(room => room.name.includes(search));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('./assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>참여 신청</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={selectedRoomIndex === null}
          style={[
            styles.headerButton,
            selectedRoomIndex === null && styles.headerButtonDisabled,
          ]}>
          <Text
            style={
              selectedRoomIndex === null
                ? styles.headerButtonTextDisabled
                : styles.headerButtonText
            }>
            신청
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="방 검색"
        placeholderTextColor="#888"
        value={search}
        onChangeText={text => setSearch(text)}
      />
      <ScrollView>
        {filteredRooms.map((room, index) => (
          <View key={index} style={styles.roomItem}>
            <Image
              source={require('./assets/images/person.png')}
              style={styles.profileIcon}
            />
            <Text style={styles.roomName}>{room.name}</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleSelect(index)}>
              <View
                style={[
                  styles.selectIndicator,
                  {
                    backgroundColor:
                      selectedRoomIndex === index ? '#03CF5D' : 'gray',
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Image
            source={require('./assets/images/statistics.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('./assets/images/home.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('./assets/images/myPage.png')}
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
            <Text style={styles.modalText}>신청완료</Text>
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
    borderRadius: 25,
  },
  roomName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  selectButton: {
    padding: 10,
  },
  selectIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
