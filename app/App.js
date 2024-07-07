import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './MainScreen'; // 기존 화면
import CreateRoomScreen from './CreateRoomScreen'; // 새로 추가된 화면
import JoinRoomScreen from './JoinRoomScreen';
import CreateRoomName from './CreateRoomName';
import TeamScreen from './TeamScreen';
import TeamAdminScreen from './TeamAdminScreen';
import TeamApplyScreen from './TeamApplyScreen';
import CameraScreen from './CameraScreen';
import StatisticsScreen from './StatisticsScreen';
import InviteRoomScreen from './InviteRoomScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
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
          name="Statistic"
          component={StatisticsScreen}
          options={{headerShown: false}}
        />
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
