import {createSlice} from '@reduxjs/toolkit';

const createRoomSlice = createSlice({
  name: 'createRoom',
  initialState: {
    memberIds: [], // memberId를 배열로 변경
  },
  reducers: {
    setMembers: (state, action) => {
      state.memberIds = action.payload.memberIds; // memberIds를 설정
    },
    clearMembers: state => {
      state.memberIds = []; // memberIds를 초기화
    },
  },
});

export const {setMembers, clearMembers} = createRoomSlice.actions;
export default createRoomSlice.reducer;
