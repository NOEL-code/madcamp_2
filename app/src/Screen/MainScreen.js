import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import api from '../utils/api'; // api 설정 파일 불러오기
import NavBar from 'Components/NavBar';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native'; // react-navigation hooks 추가

const MainScreen = ({navigation}) => {
  const [participatingRooms, setParticipatingRooms] = useState([]);
  const [managingRooms, setManagingRooms] = useState([]);
  const currentUser = useSelector(state => state.user);
  const isFocused = useIsFocused(); // 화면이 포커스될 때마다 리렌더링하도록 하는 hook

  console.log(currentUser);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const userRoomsResponse = await api.get(
          `/rooms/user/${currentUser.id}`,
        );
        setParticipatingRooms(userRoomsResponse.data);

        const hostRoomsResponse = await api.get(
          `/rooms/host/${currentUser.id}`,
        );
        setManagingRooms(hostRoomsResponse.data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        Alert.alert('오류', '방 목록을 가져오는데 실패했습니다.');
      }
    };

    if (isFocused) {
      fetchRooms(); // 화면이 포커스될 때마다 방 목록을 다시 불러옴
    }
  }, [isFocused, currentUser.id]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>너 어디있니?</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButtonLeft}
              onPress={() => navigation.navigate('CreateRoom')}>
              <Image
                source={require('assets/images/roomCreate.png')}
                style={styles.headerButtonIcon}
              />
              <Text style={styles.headerButtonText}>방 생성</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButtonRight}
              onPress={() => navigation.navigate('joinRoom')}>
              <Image
                source={require('assets/images/joinRoom.png')}
                style={styles.headerButtonIcon}
              />
              <Text style={styles.headerButtonText}>기존 방 합류</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>참여 중인 방</Text>
          <View style={styles.separator} />
          <View style={styles.profileContainer}>
            {participatingRooms.map((room, index) => (
              <View key={index} style={styles.roomItem}>
                <Image
                  source={require('assets/images/roomProfile.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.roomName}>{room.roomName}</Text>
                <Text style={styles.roomCount}>{room.members.length}명</Text>
                <TouchableOpacity
                  style={styles.forwardButton}
                  onPress={() =>
                    navigation.navigate('Team', {roomId: room._id})
                  }>
                  <Image
                    source={require('assets/images/next.png')}
                    style={styles.forwardIcon}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>관리 중인 방</Text>
          <View style={styles.separator} />
          <View style={styles.profileContainer}>
            {managingRooms.map((room, index) => (
              <View key={index} style={styles.roomItem}>
                <Image
                  source={require('assets/images/roomProfile.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.roomName}>{room.roomName}</Text>
                <Text style={styles.roomCount}>{room.members.length}명</Text>
                <TouchableOpacity
                  style={styles.forwardButton}
                  onPress={() =>
                    navigation.navigate('TeamAdmin', {roomId: room._id})
                  }>
                  <Image
                    source={require('assets/images/next.png')}
                    style={styles.forwardIcon}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <NavBar navigation={navigation} currentRoute={'Main'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  headerButtonLeft: {
    marginLeft: 15,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    width: 150,
    height: 100,
    paddingTop: 15,
    paddingBottom: 10,
    borderRadius: 20,
  },
  headerButtonRight: {
    marginLeft: 35,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    width: 150,
    height: 100,
    paddingTop: 15,
    paddingBottom: 10,
    borderRadius: 20,
  },
  headerButtonIcon: {
    width: 50,
    height: 50,
  },
  headerButtonText: {
    marginTop: 10,
    fontSize: 16,
  },
  section: {
    margin: 20,
    marginTop: 20,
  },
  separator: {
    height: 2,
    backgroundColor: 'black',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
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
  roomCount: {
    fontSize: 16,
    marginRight: 25,
  },
  forwardButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6DDD5B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forwardIcon: {
    width: 30,
    height: 30,
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
  profileContainer: {
    marginTop: 10,
  },
});

export default MainScreen;
