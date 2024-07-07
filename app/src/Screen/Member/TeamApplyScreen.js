import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const initialUsers = [
  {name: '정우성', status: 'pending'},
  {name: '이수민', status: 'pending'},
  {name: '박종민', status: 'pending'},
  {name: '김사랑', status: 'pending'},
];

const TeamApplyScreen = ({navigation}) => {
  const [usersState, setUsersState] = useState(initialUsers);

  const handleApprove = index => {
    const newUsers = [...usersState];
    newUsers[index].status = 'approved';
    setUsersState(newUsers);
  };

  const handleReject = index => {
    const newUsers = [...usersState];
    newUsers[index].status = 'rejected';
    setUsersState(newUsers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../../assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>팀이름</Text>
      </View>
      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>참가신청</Text>
      </View>
      <View style={styles.separator} />
      <ScrollView>
        <View>
          {usersState.map((user, index) => (
            <View key={index} style={styles.userItem}>
              <Image
                source={require('../../../assets/images/person.png')}
                style={styles.profileIcon}
              />
              <Text style={styles.userName}>{user.name}</Text>
              {user.status === 'pending' && (
                <>
                  <TouchableOpacity onPress={() => handleApprove(index)}>
                    <Text style={styles.approve}>승인</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleReject(index)}>
                    <Text style={styles.reject}>거절</Text>
                  </TouchableOpacity>
                </>
              )}
              {user.status === 'approved' && (
                <Text style={styles.approvedText}>승인됨</Text>
              )}
              {user.status === 'rejected' && (
                <Text style={styles.rejectedText}>거절됨</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => navigation.navigate('TeamAdmin')}>
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
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
  separator: {
    height: 2,
    backgroundColor: 'black',
    marginTop: 10,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 16,
    color: '#888',
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
  approve: {
    color: '#0000FF',
    marginRight: 10,
  },
  reject: {
    color: '#FF0000',
    marginRight: 10,
  },
  approvedText: {
    color: '#0000FF',
    marginRight: 10,
  },
  rejectedText: {
    color: '#FF0000',
    marginRight: 10,
  },
  completeButton: {
    backgroundColor: '#03CF5D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default TeamApplyScreen;
