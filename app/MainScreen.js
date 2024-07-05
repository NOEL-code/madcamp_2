import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const rooms = [
  {name: '1분반', count: 20},
  {name: '우히히', count: 5},
  {name: '메렁', count: 13},
];

const MainScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>참여 중인 방</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text
              style={styles.addButtonText}
              onPress={() => navigation.navigate('joinRoom')}>
              +
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <View style={styles.profileContainer}>
            {rooms.map((room, index) => (
              <View key={index} style={styles.roomItem}>
                <Image
                  source={require('./assets/images/person.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomCount}>{room.count}명</Text>
                <TouchableOpacity style={styles.forwardButton}>
                  <Image source={require('./assets/images/next.png')} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>관리 중인 방</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateRoom')}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <View style={styles.separator} />

          <View style={styles.profileContainer}>
            {rooms.map((room, index) => (
              <View key={index} style={styles.roomItem}>
                <Image
                  source={require('./assets/images/person.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomCount}>{room.count}명</Text>
                <TouchableOpacity style={styles.forwardButton}>
                  <Image source={require('./assets/images/next.png')} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    margin: 20,
    marginTop: 50,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    top: 0,
  },
  addButtonText: {
    fontSize: 24,
    color: '#03CF5D',
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 20,
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
    backgroundColor: '#03CF5D',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forwardButtonText: {
    color: '#fff',
    fontSize: 18,
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
    marginTop: 20,
  },
});

export default MainScreen;
