import React, {useState} from 'react';
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

const CreateRoomScreen = ({navigation}) => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');

  const handleSelect = index => {
    const newUsers = [...users];
    newUsers[index].selected = !newUsers[index].selected;
    setUsers(newUsers);
  };

  const filteredUsers = users.filter(user => user.name.includes(search));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('./assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>방 생성</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreateRoomName');
          }}>
          <Text style={styles.headerButton}>다음</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="이름 검색"
        placeholderTextColor="#888"
        value={search}
        onChangeText={text => setSearch(text)}
      />
      <ScrollView>
        {filteredUsers.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <Image
              source={require('./assets/images/person.png')}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerButton: {
    fontSize: 18,
    color: 'black',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    margin: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
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
