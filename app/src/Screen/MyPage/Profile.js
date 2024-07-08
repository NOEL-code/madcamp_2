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
import api from '../../utils/api';

const initialWaitRooms = [{name: '카이부캠방'}, {name: '키키'}];
const initialIngRooms = [
  {name: '1분반', count: 20},
  {name: '우히히', count: 5},
  {name: '메렁', count: 13},
];

const Profile = ({navigation}) => {
  const [waitRooms, setWaitRooms] = useState(initialWaitRooms);
  const [ingRooms, setIngRooms] = useState(initialIngRooms);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    requestPermissions();
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
            formData.append('userId', '사용자 ID'); // 적절한 사용자 ID를 여기에 추가

            try {
              const res = await api.post('/update/image', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              console.log('Image uploaded successfully: ', res.data);
            } catch (error) {
              console.error('Error uploading image: ', error);
            }
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

  const handleCancel = roomName => {
    setWaitRooms(waitRooms.filter(room => room.name !== roomName));
  };

  const handleExit = roomName => {
    setIngRooms(ingRooms.filter(room => room.name !== roomName));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={
                photo ? photo : require('../../../assets/images/person.png')
              }
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleImageChange}>
              <Text style={styles.cameraIcon}>이미지 변경</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileText}>
            <Text style={styles.name}>이수민</Text>
            <Text style={styles.userId}>ID smo1111</Text>
            <TouchableOpacity
              onPress={() => {
                /* 로그아웃 기능 구현 */
              }}>
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
                <Text style={styles.roomName}>{room.name}</Text>
                <TouchableOpacity
                  style={styles.rightAlign}
                  onPress={() => handleCancel(room.name)}>
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
                <Text style={styles.roomName}>{room.name}</Text>
                <TouchableOpacity
                  style={styles.rightAlign}
                  onPress={() => handleExit(room.name)}>
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
    right: 130,
    backgroundColor: '#00C853',
    width: 100,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    color: '#FFFFFF',
    fontSize: 16,
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
    color: '#5F5F5F',
    marginTop: 10,
    borderBottomColor: '#5F5F5F',
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
