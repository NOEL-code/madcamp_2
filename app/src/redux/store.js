import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import createRoomReducer from './createRoomSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    createRoom: createRoomReducer,
  },
});

export default store;
