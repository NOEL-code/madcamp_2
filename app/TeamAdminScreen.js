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
import {Picker} from '@react-native-picker/picker';

const initialUsers = [
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

const TeamAdminScreen = ({navigation}) => {
  const [isTitleEditMode, setIsTitleEditMode] = useState(false);
  const [isSubTitleEditMode, setIsSubTitleEditMode] = useState(false);
  const [isStatusEditMode, setIsStatusEditMode] = useState(false);
  const [title, setTitle] = useState('팀 이름');
  const [subTitle, setSubTitle] = useState('한 줄 소개');
  const [usersState, setUsersState] = useState(initialUsers);

  const toggleTitleEditMode = () => {
    setIsTitleEditMode(!isTitleEditMode);
  };

  const toggleSubTitleEditMode = () => {
    setIsSubTitleEditMode(!isSubTitleEditMode);
  };

  const handleStatusChange = (value, index) => {
    const newUsers = [...usersState];
    newUsers[index].status = value;
    setUsersState(newUsers);
  };

  const deleteUser = index => {
    const newUsers = usersState.filter((_, i) => i !== index);
    setUsersState(newUsers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('./assets/images/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        {isTitleEditMode ? (
          <TextInput
            style={styles.headerTitleInput}
            value={title}
            onChangeText={setTitle}
          />
        ) : (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
        <TouchableOpacity onPress={toggleTitleEditMode}>
          <Image
            source={require('./assets/images/pencil.png')}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.subTitleContainer}>
        {isSubTitleEditMode ? (
          <TextInput
            style={styles.subTitleInput}
            value={subTitle}
            onChangeText={setSubTitle}
          />
        ) : (
          <Text style={styles.subTitle}>{subTitle}</Text>
        )}
        <TouchableOpacity onPress={toggleSubTitleEditMode}>
          <Image
            source={require('./assets/images/pencil.png')}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />

      <View style={styles.studentContainer}>
        <Text style={styles.sectionTitle}>학생 20명</Text>
        <TouchableOpacity
          onPress={() => setIsStatusEditMode(!isStatusEditMode)}>
          <Image
            source={require('./assets/images/pencil.png')}
            style={styles.editIcon}
          />
        </TouchableOpacity>
        <View style={styles.joinTextContainer}>
          <Text
            style={styles.joinText}
            onPress={() => navigation.navigate('TeamApply')}>
            참가 신청(1)
          </Text>
        </View>
      </View>
      <ScrollView>
        {isStatusEditMode ? (
          <View>
            {usersState.map((user, index) => (
              <View key={index} style={styles.userItem}>
                <Image
                  source={require('./assets/images/person.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.userName}>{user.name}</Text>
                <Picker
                  selectedValue={user.status}
                  style={styles.picker}
                  onValueChange={value => handleStatusChange(value, index)}>
                  <Picker.Item label="출석" value={1} />
                  <Picker.Item label="결석" value={2} />
                  <Picker.Item label="자리비움" value={3} />
                  <Picker.Item label="퇴근" value={4} />
                </Picker>
                <TouchableOpacity onPress={() => deleteUser(index)}>
                  <Text style={styles.delete}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>학생 초대하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View>
              {usersState.map((user, index) => (
                <View key={index} style={styles.userItem}>
                  <Image
                    source={require('./assets/images/person.png')}
                    style={styles.profileIcon}
                  />
                  <Text style={styles.userName}>{user.name}</Text>
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
              ))}
            </View>
          </View>
        )}
        <View style={styles.cameraContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('CameraAdmin')}>
            <Image
              style={styles.camera}
              source={require('./assets/images/camera.png')}
            />
          </TouchableOpacity>
        </View>
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align to the right
    padding: 10,
    marginRight: 30,
    marginTop: 30,
  },
  camera: {
    width: 50,
    height: 50,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
  },
  joinTextContainer: {
    flex: 1,
    alignItems: 'flex-end', // Added to align text to the right
  },
  joinText: {
    color: '#03CF5D',
    textDecorationLine: 'underline',
  },
  delete: {
    textDecorationLine: 'underline',
    color: '#FF0000',
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
  subTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    flex: 1,
  },
  subTitle: {
    fontSize: 16,
    color: '#888',
  },
  button: {
    backgroundColor: '#03CF5D', // 버튼 배경색상 추가
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: 170,
    borderRadius: 20,
    marginTop: 20,
  },
  subTitleInput: {
    fontSize: 16,
    color: '#888',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    flex: 1,
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
  picker: {
    height: 50,
    width: 140,
    fontSize: 11,
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
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 10,
  },
});

export default TeamAdminScreen;
