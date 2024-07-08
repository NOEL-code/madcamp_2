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

const initialUsers = [
  {name: '정우성', selected: false},
  {name: '이수민', selected: false},
  {name: '정재현', selected: false},
  {name: '카리나', selected: false},
  {name: '윈터', selected: false},
  {name: '최예나', selected: false},
];

const InviteRoomScreen = ({navigation}) => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);

  const handleSelect = index => {
    const newUsers = [...users];
    newUsers[index].selected = !newUsers[index].selected;
    setUsers(newUsers);
  };

  useEffect(() => {
    const count = users.filter(user => user.selected).length;
    setSelectedCount(count);
  }, [users]);

  const filteredUsers = users.filter(user => user.name.includes(search));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('TeamAdmin')}>
          <Image
            source={require('../../../assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>멤버 초대</Text>
        <TouchableOpacity
          onPress={() => {
            if (selectedCount > 0) {
              navigation.navigate('TeamAdmin');
            }
          }}
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
            <Image
              source={require('../../../assets/images/person.png')}
              style={styles.profileIcon}
            />
            <Text style={styles.userName}>{user.name}</Text>
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
      <View style={styles.navbar}>
        <TouchableOpacity>
          <Image
            source={require('../../../assets/images/statistics.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../../../assets/images/home.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
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

export default InviteRoomScreen;
