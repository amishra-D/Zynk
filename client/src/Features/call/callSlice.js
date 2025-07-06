import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { adduserroomAPI, createroomAPI, endcallAPI, validateroomAPI } from './callAPI';
export const createroomthunk = createAsyncThunk(
  '/room/createroom',
  async (data, thunkAPI) => {
    try {
      const response = await createroomAPI(data);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message || 'Room creation failed');
    }
  }
);

export const addparticipantthunk = createAsyncThunk(
  '/room/addparticipant',
  async (data, thunkAPI) => {
    try {
      const response = await adduserroomAPI(data);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message || 'Participant not added');
    }
  }
);
export const validateroomthunk = createAsyncThunk(
  '/room/validate',
  async (data, thunkAPI) => {
    try {
      const response = await validateroomAPI(data);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message || 'Room not found');
    }
  }
);
export const endcallthunk = createAsyncThunk(
  '/room/endcall',
  async (data, thunkAPI) => {
    try {
      const response = await endcallAPI(data);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message || 'Call ended failed');
    }
  }
);
const initialState = {
  callStatus: 'idle',
  roomvalid: false,
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
  extraReducers: (builder) => {
    builder
      .addCase(createroomthunk.pending, (state) => {
        state.callStatus = 'creating';
        state.error = null;
      })
      .addCase(createroomthunk.fulfilled, (state, action) => {
        state.callStatus = 'created';
        state.roomId = action.payload.room?.roomId;
        state.isHost = true;
      })
      .addCase(createroomthunk.rejected, (state, action) => {
        state.callStatus = 'error';
        state.error = action.payload;
      })
      .addCase(addparticipantthunk.pending, (state) => {
        state.callStatus = 'joining';
        state.error = null;
      })
      .addCase(addparticipantthunk.fulfilled, (state) => {
        state.callStatus = 'joined';
      })
      .addCase(addparticipantthunk.rejected, (state, action) => {
        state.callStatus = 'error';
        state.error = action.payload;
      })
      .addCase(validateroomthunk.pending, (state) => {
        state.callStatus = 'joining';
        state.error = null;
      })
      .addCase(validateroomthunk.fulfilled, (state) => {
        state.callStatus = 'joined';
        state.roomvalid = true;
      })
      .addCase(validateroomthunk.rejected, (state, action) => {
        state.callStatus = 'error';
        state.error = action.payload;
        state.roomvalid = false;
      })
       .addCase(endcallthunk.pending, (state) => {
        state.callStatus = 'joined';
        state.error = null;
      })
      .addCase(endcallthunk.fulfilled, (state) => {
        state.callStatus = 'ended';
      })
      .addCase(endcallthunk.rejected, (state, action) => {
        state.callStatus = 'error';
        state.error = action.payload;
        state.callStatus = 'joined';
      })
  }
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
