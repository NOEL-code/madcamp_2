import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
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

const TeamScreen = ({route, navigation}) => {
  const {roomId} = route.params;
  const currentUser = useSelector(state => state.user);
  const [roomInfo, setRoomInfo] = useState({
    roomName: '',
    subTitle: '',
    members: [],
  });
  const [topWorkerId, setTopWorkerId] = useState(null);

  useEffect(() => {
    console.log('Room ID:', roomId);

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
        setRoomInfo({
          ...response.data,
          members: membersWithStatus,
        });
      } catch (error) {
        console.error('Failed to fetch room info:', error);
      }
    };

    const fetchTopWorker = async () => {
      try {
        const response = await api.get(`/rooms/${roomId}/getTopWorker`);
        setTopWorkerId(response.data.topWorkerId);
        console.log('Top Worker ID:', response.data.topWorkerId); // 로그 추가
      } catch (error) {
        console.error('Failed to fetch top worker:', error);
      }
    };

    fetchRoomInfo();
    fetchTopWorker();
  }, [roomId]);

  const getStatusStyle = status => {
    return statusStyles[status] || {color: '#000', text: '알 수 없음'};
  };

  const getStatusBoxStyle = status => {
    return statusBoxStyles[status] || {backgroundColor: '#EEE'};
  };

  const currentUserStatus = roomInfo.members.find(
    member => member.userId._id === currentUser.id,
  );
  const otherMembers = roomInfo.members.filter(
    member => member.userId._id !== currentUser.id,
  );

  const sendSMS = async phoneNumber => {
    const url = `sms:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('이 장치는 문자 메시지 기능을 지원하지 않습니다.');
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  };

  const handleUserClick = user => {
    if (user.status === 2) {
      // 자리비움 상태
      const phoneNumber = user.userId.phoneNumber;
      if (phoneNumber) {
        sendSMS(phoneNumber);
      } else {
        Alert.alert('전화번호를 찾을 수 없습니다.');
      }
    }
  };

  useEffect(() => {
    console.log('Current User Status:', currentUserStatus);
    console.log('Top Worker ID:', topWorkerId);
  }, [currentUserStatus, topWorkerId]);

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
      <Text style={styles.sectionTitle}>나의 상태</Text>
      {currentUserStatus && (
        <View style={styles.userItem}>
          <View style={styles.profileContainer}>
            <Image
              source={{uri: currentUserStatus.userId.photoUrl}}
              style={styles.profileIcon}
            />
            {currentUserStatus.userId._id === topWorkerId && (
              <Image
                source={require('assets/images/crown.png')}
                style={styles.crownIcon}
              />
            )}
          </View>

          <Text style={styles.userName}>{currentUserStatus.userId.name}</Text>
          <View
            style={[
              styles.statusIndicatorBox,
              getStatusBoxStyle(currentUserStatus.status),
            ]}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: getStatusStyle(currentUserStatus.status)
                    .color,
                },
              ]}
            />
            <Text style={styles.statusText}>
              {getStatusStyle(currentUserStatus.status).text}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>학생 {otherMembers.length}명</Text>
      <ScrollView>
        {otherMembers.map((member, index) => {
          const statusStyle = getStatusStyle(member.status);
          const statusBoxStyle = getStatusBoxStyle(member.status);
          return (
            <TouchableOpacity
              key={index}
              style={styles.userItem}
              onPress={() => handleUserClick(member)}>
              <View style={styles.profileContainer}>
                <Image
                  source={{uri: member.userId.photoUrl}}
                  style={styles.profileIcon}
                />
                {member.userId._id === topWorkerId && (
                  <Image
                    source={require('assets/images/crown.png')}
                    style={styles.crownIcon}
                  />
                )}
              </View>

              <Text style={styles.userName}>{member.userId.name}</Text>
              <View style={[styles.statusIndicatorBox, statusBoxStyle]}>
                <View
                  style={[
                    styles.statusIndicator,
                    {backgroundColor: statusStyle.color},
                  ]}
                />
                <Text style={styles.statusText}>{statusStyle.text}</Text>
              </View>
            </TouchableOpacity>
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
  profileContainer: {
    position: 'relative',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  crownIcon: {
    position: 'absolute',
    top: -10,
    left: 19,
    width: 24,
    height: 24,
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
