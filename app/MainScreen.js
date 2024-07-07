import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import api from './api'; // api 설정 파일 불러오기

const participatingRooms = [
  {name: '카이부캠방', count: 80},
  {name: '우히히 방', count: 20},
  {name: '메렁', count: 5},
];

const managingRooms = [
  {name: '우히히 방', count: 20},
  {name: '메렁', count: 5},
];

const MainScreen = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await api.get('/users/me');
        console.log('User data:', response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        navigation.navigate('LogIn');
      }
    };

    checkToken();
  }, [navigation]);

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
                source={require('../../../assets/images/roomCreate.png')}
                style={styles.headerButtonIcon}
              />
              <Text style={styles.headerButtonText}>방 생성</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButtonRight}
              onPress={() => navigation.navigate('joinRoom')}>
              <Image
                source={require('../../../assets/images/joinRoom.png')}
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
                  source={require('../../../assets/images/roomProfile.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomCount}>{room.count}명</Text>
                <TouchableOpacity
                  style={styles.forwardButton}
                  onPress={() => navigation.navigate('Team')}>
                  <Image
                    source={require('../../../assets/images/next.png')}
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
                  source={require('../../../assets/images/roomProfile.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomCount}>{room.count}명</Text>
                <TouchableOpacity
                  style={styles.forwardButton}
                  onPress={() => navigation.navigate('TeamAdmin')}>
                  <Image
                    source={require('../../../assets/images/next.png')}
                    style={styles.forwardIcon}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Stat')}>
          <Image
            source={require('../../../assets/images/staticsNotSelected.png')}
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
            source={require('../../../assets/images/myPageNotSelected.png')}
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
