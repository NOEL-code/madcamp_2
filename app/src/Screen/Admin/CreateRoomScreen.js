import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import api from '../../utils/api';
import {setMembers} from '../../redux/createRoomSlice'; // Redux 액션 임포트

const initialUsers = []; // 초기 사용자 데이터를 빈 배열로 설정

const CreateRoomScreen = ({navigation}) => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  const currentUser = useSelector(state => state.user);
  const dispatch = useDispatch(); // Redux 디스패치 사용

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const usersData = response.data.map(user => ({
          ...user,
          selected: false,
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSelect = index => {
    const newUsers = [...users];
    newUsers[index].selected = !newUsers[index].selected;
    setUsers(newUsers);
  };

  useEffect(() => {
    const count = users.filter(user => user.selected).length;
    setSelectedCount(count);
  }, [users]);

  const filteredUsers = users.filter(
    user =>
      user.userName &&
      user.userName.includes(search) &&
      user.id !== currentUser.id,
  );

  const handleNext = () => {
    const selectedUsers = users
      .filter(user => user.selected)
      .map(user => user.id);
    dispatch(setMembers({memberIds: selectedUsers})); // 선택된 멤버 ID를 Redux에 저장
    navigation.navigate('CreateRoomName');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image
            source={require('assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>방 생성</Text>
        <TouchableOpacity
          onPress={handleNext}
          disabled={selectedCount === 0}
          style={[
            styles.headerButton,
            selectedCount === 0 && styles.headerButtonDisabled,
          ]}>
          <Text
            style={
              selectedCount > 0
                ? styles.headerButtonText
                : styles.headerButtonTextDisabled
            }>
            다음
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.padding}>
        <TextInput
          style={styles.searchInput}
          placeholder="이름 검색"
          placeholderTextColor="#888"
          value={search}
          onChangeText={text => setSearch(text)}
        />
      </View>
      <ScrollView style={styles.view}>
        {filteredUsers.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <Image source={{uri: user.photoUrl}} style={styles.profileIcon} />
            <Text style={styles.userName}>{user.userName}</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleSelect(index)}>
              <View
                style={[
                  styles.selectIndicator,
                  {backgroundColor: user.selected ? '#03CF5D' : 'gray'},
                ]}
              />
            </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    margin: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerButton: {
    fontSize: 20,
  },
  headerButtonText: {
    color: 'black',
    fontSize: 20,
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerButtonTextDisabled: {
    color: '#888',
  },
  headerTitle: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  padding: {
    padding: 10,
  },
  searchInput: {
    margin: 15,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
  },
  view: {
    padding: 15,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  selectButton: {
    padding: 10,
  },
  selectIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
});

export default CreateRoomScreen;
