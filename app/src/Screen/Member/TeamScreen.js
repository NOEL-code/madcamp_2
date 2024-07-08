import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const users = [
  {name: '정우성', status: 1},
  {name: '이수민', status: 1},
  {name: '박종민', status: 3},
  {name: '김사랑', status: 4},
  {name: '윈터', status: 2},
];

const statusStyles = {
  1: {color: '#03CF5D', text: '출석'},
  2: {color: '#FF0000', text: '결석'},
  3: {color: '#FFE600', text: '자리비움'},
  4: {color: '#D9D9D9', text: '퇴근'},
};

const statusBoxStyles = {
  1: {backgroundColor: '#DFF5E9'},
  2: {backgroundColor: '#FFE2E2'},
  3: {backgroundColor: '#FFF4D5'},
  4: {backgroundColor: '#F4F4F4'},
};

const TeamScreen = ({navigation}) => {
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
      <Text style={styles.headerTitle}>팀이름</Text>
      <Text style={styles.subTitle}>팀 한 줄 소개</Text>

      <View style={styles.separator} />
      <Text style={styles.sectionTitle}>나의 상태</Text>
      <View style={styles.userItem}>
        <Image
          source={require('assets/images/person.png')}
          style={styles.profileIcon}
        />
        <Text style={styles.userName}>정우성</Text>
        <View style={[styles.statusIndicatorBox, statusBoxStyles[1]]}>
          <View
            style={[
              styles.statusIndicator,
              {backgroundColor: statusStyles[1].color},
            ]}
          />
          <Text style={styles.statusText}>{statusStyles[1].text}</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>학생 20명</Text>
      <ScrollView>
        {users.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <Image
              source={require('assets/images/person.png')}
              style={styles.profileIcon}
            />
            <Text style={styles.userName}>{user.name}</Text>
            <View
              style={[styles.statusIndicatorBox, statusBoxStyles[user.status]]}>
              <View
                style={[
                  styles.statusIndicator,
                  {backgroundColor: statusStyles[user.status].color},
                ]}
              />
              <Text style={styles.statusText}>
                {statusStyles[user.status].text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 5,
    color: '#888',
    marginBottom: 15,
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginTop: 10,
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
  statusIndicatorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
  },
});

export default TeamScreen;
