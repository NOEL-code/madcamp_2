import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {PERMISSIONS, request, check, RESULTS} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';
import {fetchImage, fetchLogout} from '../../Service/user'; // Adjust the import path as needed
import api from '../../utils/api'; // API 호출을 위한 모듈 임포트

const Profile = ({navigation}) => {
  const [waitRooms, setWaitRooms] = useState([]);
  const [ingRooms, setIngRooms] = useState([]);
  const [photo, setPhoto] = useState(null);

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    requestPermissions();
    fetchUserRooms(); // 참여 중인 방 목록 불러오기
    fetchAppliedRooms(); // 승인 대기 중인 방 목록 불러오기
  }, []);

  const requestPermissions = async () => {
    const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (result !== RESULTS.GRANTED) {
      Alert.alert(
        'Permission denied',
        'You need to grant storage permissions to change the profile image.',
      );
    }
  };

  const fetchUserRooms = async () => {
    try {
      const response = await api.get(`/rooms/user/${user.id}`);
      setIngRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch user rooms:', error);
      Alert.alert('오류', '참여 중인 방 목록을 불러오는 데 실패했습니다.');
    }
  };

  const fetchAppliedRooms = async () => {
    try {
      const response = await api.get(`/apply/user/${user.id}`);
      const waitRooms = response.data.filter(room =>
        room.members.some(
          member => member.userId._id === user.id && member.status === 1,
        ),
      );
      setWaitRooms(waitRooms);
    } catch (error) {
      console.error('Failed to fetch applied rooms:', error);
      Alert.alert('오류', '승인 대기 중인 방 목록을 불러오는 데 실패했습니다.');
    }
  };

  const handleImageChange = async () => {
    const permission = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (permission === RESULTS.GRANTED) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxWidth: 300,
          maxHeight: 300,
          quality: 1,
        },
        async response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.assets && response.assets.length > 0) {
            const source = {uri: response.assets[0].uri};
            setPhoto(source);

            // 서버로 이미지 업로드
            const formData = new FormData();
            formData.append('image', {
              uri: response.assets[0].uri,
              type: response.assets[0].type,
              name: response.assets[0].fileName,
            });
            formData.append('userId', user.id); // Redux 상태에서 사용자 ID 가져오기

            await fetchImage(formData, user, dispatch); // fetchImage 함수 호출
          }
        },
      );
    } else {
      Alert.alert(
        'Permission denied',
        'You need to grant storage permissions to change the profile image.',
      );
    }
  };

  const handleLogout = async () => {
    const result = await fetchLogout();
    if (result.success) {
      navigation.navigate('LogIn');
    } else {
      Alert.alert('로그아웃 실패', '로그아웃하는 동안 문제가 발생했습니다.');
    }
  };

  const handleCancel = async roomId => {
    try {
      await api.put(`/apply/cancel/${roomId}/${user.id}`);
      setWaitRooms(waitRooms.filter(room => room.roomId._id !== roomId));
      Alert.alert('신청 취소 성공', '참여 신청을 성공적으로 취소했습니다.');
    } catch (error) {
      console.error('Failed to cancel application:', error);
      Alert.alert(
        '신청 취소 실패',
        '참여 신청을 취소하는 동안 문제가 발생했습니다.',
      );
    }
  };

  const handleExit = async roomId => {
    try {
      await api.delete(`/rooms/${roomId}/member/${user.id}`);
      setIngRooms(ingRooms.filter(room => room._id !== roomId));
      Alert.alert('방 나가기 성공', '방에서 성공적으로 나갔습니다.');
    } catch (error) {
      console.error('Failed to leave room:', error);
      Alert.alert('방 나가기 실패', '방을 나가는 동안 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={photo ? photo : {uri: user.photoUrl}}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleImageChange}>
              <Image
                style={styles.cameraIcon}
                source={require('../../../assets/images/profileCamera.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileText}>
            <Text style={styles.name}>{user.userName}</Text>
            <Text style={styles.userId}>{user.userEmail}</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.roomsContainer}>
          <View style={styles.RoomList}>
            <Text style={styles.sectionTitle}>승인 대기</Text>
            {waitRooms.map((room, index) => (
              <View key={index} style={styles.roomItem}>
                <Image
                  source={require('../../../assets/images/person.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.roomName}>{room.roomId.roomName}</Text>
                <TouchableOpacity
                  style={styles.rightAlign}
                  onPress={() => handleCancel(room.roomId._id)}>
                  <Text style={styles.cancelButton}>취소</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.RoomList}>
            <Text style={styles.sectionTitle}>참여중인 방</Text>
            {ingRooms.map((room, index) => (
              <View key={index} style={styles.roomItem}>
                <Image
                  source={require('../../../assets/images/person.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.roomName}>{room.roomName}</Text>
                <TouchableOpacity
                  style={styles.rightAlign}
                  onPress={() => handleExit(room._id)}>
                  <Text style={styles.leaveButton}>나가기</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Stat')}>
          <Image
            source={require('../../../assets/images/statistics.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image
            source={require('../../../assets/images/home.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../../../assets/images/myPage.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  profileContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 40,
    marginBottom: 20,
    position: 'relative',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#D9D9D9',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    height: 40,
    width: 40,
  },
  profileText: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userId: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  logoutText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  roomsContainer: {
    flex: 1,
    paddingHorizontal: 50,
    marginTop: 20,
  },
  RoomList: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  roomName: {
    fontSize: 18,
    flex: 1,
  },
  cancelButton: {
    color: 'red',
    fontSize: 16,
    paddingRight: 10,
  },
  leaveButton: {
    color: 'red',
    fontSize: 16,
  },
  rightAlign: {
    marginLeft: 'auto',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default Profile;
