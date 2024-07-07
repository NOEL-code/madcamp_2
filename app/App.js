import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './src/Screen/MainScreen'; // 기존 화면
import CreateRoomScreen from './src/Screen/Admin/CreateRoomScreen'; // 새로 추가된 화면
import JoinRoomScreen from './src/Screen/Member/JoinRoomScreen';
import CreateRoomName from './src/Screen/Admin/CreateRoomName';
import TeamScreen from './src/Screen/Member/TeamScreen';
import TeamAdminScreen from './src/Screen/Admin/TeamAdminScreen';
import TeamApplyScreen from './src/Screen/Member/TeamApplyScreen';
import CameraScreen from './src/Screen/Admin/CameraScreen';
import StatisticsScreen from './src/Screen/Static/Statistics';
import LogInScreen from './src/Screen/MyPage/LogIn';
import SignUpScreen from './src/Screen/MyPage/SignUp';
import ProfileScreen from './src/Screen/MyPage/Profile';
import InviteRoomScreen from './src/Screen/Admin/InviteRoomScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateRoom"
          component={CreateRoomScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateRoomName"
          component={CreateRoomName}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="joinRoom"
          component={JoinRoomScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Team"
          component={TeamScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TeamAdmin"
          component={TeamAdminScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CameraAdmin"
          component={CameraScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TeamApply"
          component={TeamApplyScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LogIn"
          component={LogInScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Stat"
          component={StatisticsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="inviteRoom"
          component={InviteRoomScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
