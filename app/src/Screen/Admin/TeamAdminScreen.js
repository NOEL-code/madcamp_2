import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import api from '../../utils/api';
import {useSelector} from 'react-redux';

const statusStyles = {
  1: {color: '#03CF5D', text: '출석'},
  2: {color: '#FFE600', text: '자리비움'},
  3: {color: '#D9D9D9', text: '퇴근'},
};

const statusBoxStyles = {
  1: {backgroundColor: '#DFF5E9'},
  2: {backgroundColor: '#FFF4D5'},
  3: {backgroundColor: '#F4F4F4'},
};

const TeamAdminScreen = ({route, navigation}) => {
  const {roomId} = route.params;
  const currentUser = useSelector(state => state.user);
  const [roomInfo, setRoomInfo] = useState({
    roomName: '',
    subTitle: '',
    members: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStatusEditMode, setIsStatusEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [usersState, setUsersState] = useState([]);
  const [waitingUsers, setWaitingUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('현황');

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const response = await api.get(`/rooms/${roomId}`);
        const membersWithStatus = await Promise.all(
          response.data.members.map(async member => {
            const statusResponse = await api.get(
              `/attendance/status/${member.userId._id}`,
            );
            return {...member, status: statusResponse.data.status};
          }),
        );
        setRoomInfo(response.data);
        setTitle(response.data.roomName);
        setSubTitle(response.data.subTitle);
        setUsersState(membersWithStatus);
        setWaitingUsers(response.data.waitingList || []);
      } catch (error) {
        console.error('Failed to fetch room info:', error);
      }
    };

    fetchRoomInfo();
  }, [roomId]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleStatusChange = async (value, index) => {
    const userId = usersState[index].userId._id;
    try {
      await api.post(`/attendance/status/${userId}`, { status: value });
      const newUsers = [...usersState];
      newUsers[index].status = value;
      setUsersState(newUsers);
    } catch (error) {
      console.error('Failed to change status:', error);
    }
  };

  const deleteUser = index => {
    
  };

  const deleteRoom = async () => {
    try {
      await api.delete(`/rooms/${roomId}`);
      Alert.alert('성공', '방이 성공적으로 삭제되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete room:', error);
      Alert.alert('실패', '방 삭제에 실패했습니다.');
    }
  };

  const getStatusStyle = status => {
    return statusStyles[status] || {color: '#000', text: '알 수 없음'};
  };

  const getStatusBoxStyle = status => {
    return statusBoxStyles[status] || {backgroundColor: '#EEE'};
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        {isEditMode ? (
          <TextInput
            style={styles.headerTitleInput}
            value={title}
            onChangeText={setTitle}
          />
        ) : (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
        <TouchableOpacity onPress={toggleEditMode}>
          <Image
            source={require('assets/images/pencil.png')}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.subTitleContainer}>
        {isEditMode ? (
          <TextInput
            style={styles.subTitleInput}
            value={subTitle}
            onChangeText={setSubTitle}
          />
        ) : (
          <Text style={styles.subTitle}>{subTitle}</Text>
        )}
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setSelectedTab('현황')}
          style={[styles.tab, selectedTab === '현황' && styles.selectedTab]}>
          <Text
            style={[
              styles.tabText,
              selectedTab === '현황' && styles.selectedTabText,
            ]}>
            팀 현황
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('편집')}
          style={[styles.tab, selectedTab === '편집' && styles.selectedTab]}>
          <Text
            style={[
              styles.tabText,
              selectedTab === '편집' && styles.selectedTabText,
            ]}>
            팀 편집
          </Text>
        </TouchableOpacity>
      </View>
      {selectedTab === '현황' ? (
        <>
          <ScrollView>
            {usersState.map((user, index) => (
              <View key={index} style={styles.userItem}>
                <Image
                  source={require('assets/images/person.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.userName}>{user.userId.name}</Text>
                <View
                  style={[
                    styles.statusIndicatorBox,
                    getStatusBoxStyle(user.status),
                  ]}>
                  <View
                    style={[
                      styles.statusIndicator,
                      {backgroundColor: getStatusStyle(user.status).color},
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {getStatusStyle(user.status).text}
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.cameraContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CameraScreen', {
                    members: roomInfo.members,
                    roomId,
                  })
                }>
                <Image
                  style={styles.camera}
                  source={require('assets/images/camera.png')}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          <ScrollView>
            <View style={styles.waitingContainer}>
              <Text style={styles.waitingText}>대기 명단</Text>
              {waitingUsers.map((waitingUser, index) => (
                <View key={index} style={styles.userItem}>
                  <Image
                    source={require('assets/images/person.png')}
                    style={styles.profileIcon}
                  />
                  <Text style={styles.userName}>{waitingUser.name}</Text>
                  <TouchableOpacity style={styles.refuse}>
                    <Text style={styles.refuseText}>거절</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.accept}>
                    <Text style={styles.acceptText}>승인</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.teamListContainer}>
              <Text style={styles.teamText}>팀 명단</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('inviteRoom')}>
                <Text style={styles.buttonText}>+ 학생초대</Text>
              </TouchableOpacity>
            </View>
            {usersState.map((user, index) => (
              <View key={index} style={styles.userItem}>
                <Image
                  source={require('assets/images/person.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.userName}>{user.userId.name}</Text>
                <Picker
                  selectedValue={user.status}
                  style={styles.picker}
                  onValueChange={value => handleStatusChange(value, index)}>
                  <Picker.Item label="출석" value={1} />
                  <Picker.Item label="자리비움" value={2} />
                  <Picker.Item label="퇴근" value={3} />
                </Picker>
                <TouchableOpacity onPress={() => deleteUser(index)}>
                  <Text style={styles.delete}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress = {() => {deleteRoom()}}>
                <Text style={styles.deleteButtonText}>팀 삭제하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  refuse: {
    backgroundColor: '#FFE2E2',
    padding: 9,
    borderRadius: 15,
    marginRight: 10,
  },
  refuseText: {
    color: '#FF0000',
  },
  waitingText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 19,
    marginBottom: 15,
  },
  teamText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 19,
    marginBottom: 15,
  },
  accept: {
    backgroundColor: '#BEE0FF',
    padding: 9,
    borderRadius: 15,
    marginRight: 10,
  },
  acceptText: {
    color: '#2A99FF',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    marginRight: 30,
    marginTop: 30,
  },
  camera: {
    width: 50,
    height: 50,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  teamListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
  },
  joinTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  joinText: {
    color: '#03CF5D',
    textDecorationLine: 'underline',
  },
  complete: {
    fontSize: 11,
    color: '#2400FF',
  },
  delete: {
    textDecorationLine: 'underline',
    color: '#FF0000',
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  subTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  headerTitleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    flex: 1,
  },
  subTitle: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#6DDD5B',
    width: 100,
    borderRadius: 20,
    marginLeft: 30,
    padding: 10,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    width: 120,
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subTitleInput: {
    fontSize: 16,
    color: '#888',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    flex: 1,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    flex: 1,
    fontSize: 18,
  },
  picker: {
    height: 50,
    width: 140,
    fontSize: 11,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  statusIndicatorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 16,
    marginLeft: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#03CF5D',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default TeamAdminScreen;
