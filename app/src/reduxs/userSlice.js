import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    phoneNumber: null,
    photoUrl: null,
    userName: null,
    userEmail: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.phoneNumber = action.payload.phoneNumber;
      state.photoUrl = action.payload.photoUrl;
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
    },
    clearUser: state => {
      state.id = null;
      state.phoneNumber = null;
      state.photoUrl = null;
      state.userName = null;
      state.userEmail = null;
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
