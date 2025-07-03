import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  callStatus: 'idle',
  localStream: null,
  remoteStream: null,
  peerId: null,
  roomId: null,
  isMicOn: true,
  isCamOn: true,
  isHost: false,
  callRejected: false,
  error: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setCallStatus: (state, action) => {
      state.callStatus = action.payload;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    setPeerId: (state, action) => {
      state.peerId = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    toggleMic: (state) => {
      state.isMicOn = !state.isMicOn;
    },
    toggleCam: (state) => {
      state.isCamOn = !state.isCamOn;
    },
    setHost: (state, action) => {
      state.isHost = action.payload;
    },
    setCallRejected: (state, action) => {
      state.callRejected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetCall: () => initialState,
  },
});

export const {
  setCallStatus,
  setLocalStream,
  setRemoteStream,
  setPeerId,
  setRoomId,
  toggleMic,
  toggleCam,
  setHost,
  setCallRejected,
  setError,
  resetCall,
} = callSlice.actions;

export default callSlice.reducer;
