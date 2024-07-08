import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import api from '../../utils/api';

const statusStyles = {
  1: { color: '#03CF5D', text: '출석' },
  2: { color: '#FF0000', text: '결석' },
  3: { color: '#FFE600', text: '자리비움' },
  4: { color: '#D9D9D9', text: '퇴근' },
};

const statusBoxStyles = {
  1: { backgroundColor: '#DFF5E9' },
  2: { backgroundColor: '#FFE2E2' },
  3: { backgroundColor: '#FFF4D5' },
  4: { backgroundColor: '#F4F4F4' },
};

const TeamScreen = ({ route, navigation }) => {
  const { roomId } = route.params;
  const [roomInfo, setRoomInfo] = useState({ roomName: '', subTitle: '', members: [] });

  useEffect(() => {
    console.log('Room ID:', roomId); // 방의 ID를 콘솔에 출력

    const fetchRoomInfo = async () => {
      try {
        const response = await api.get(`/rooms/${roomId}`);
        setRoomInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch room info:', error);
      }
    };

    fetchRoomInfo();
  }, [roomId]);

  const getStatusStyle = (status) => {
    return statusStyles[status] || { color: '#000', text: '알 수 없음' };
  };

  const getStatusBoxStyle = (status) => {
    return statusBoxStyles[status] || { backgroundColor: '#EEE' };
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
      <Text style={styles.headerTitle}>{roomInfo.roomName}</Text>
      <Text style={styles.subTitle}>{roomInfo.subTitle}</Text>

      <View style={styles.separator} />
      <Text style={styles.sectionTitle}>학생 {roomInfo.members.length}명</Text>
      <ScrollView>
        {roomInfo.members.map((member, index) => {
          const statusStyle = getStatusStyle(member.status);
          const statusBoxStyle = getStatusBoxStyle(member.status);
          return (
            <View key={index} style={styles.userItem}>
              <Image
                source={require('assets/images/person.png')}
                style={styles.profileIcon}
              />
              <Text style={styles.userName}>{member.userId.name}</Text>
              <View style={[styles.statusIndicatorBox, statusBoxStyle]}>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: statusStyle.color },
                  ]}
                />
                <Text style={styles.statusText}>
                  {statusStyle.text}
                </Text>
              </View>
            </View>
          );
        })}
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
