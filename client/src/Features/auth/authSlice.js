import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getmyuserAPI,
  loginAPI,
  logoutAPI,
  signupAPI,
  updateuserAPI,
  sendOTPAPI,
} from "./authAPI";

export const Loginthunk = createAsyncThunk('/auth/login', async (data, thunkAPI) => {
  try {
    return await loginAPI(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Login failed');
  }
});

export const Signupthunk = createAsyncThunk('/auth/signup', async (data, thunkAPI) => {
  console.log("email",data);
  try {
    return await signupAPI(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Signup failed');
  }
});

export const Logoutthunk = createAsyncThunk('/auth/logout', async (_, thunkAPI) => {
  try {
    return await logoutAPI();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Logout failed');
  }
});

export const Getmyuserthunk = createAsyncThunk('/auth/getmyuser', async (_, thunkAPI) => {
  try {
    return await getmyuserAPI();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Unauthorized');
  }
});

export const Updateuserthunk = createAsyncThunk('/profile/updateuser', async (data, thunkAPI) => {
  try {
    return await updateuserAPI(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'Update failed');
  }
});

export const SendOTPThunk = createAsyncThunk('/auth/sendotp', async (data, thunkAPI) => {
  try {
    return await sendOTPAPI(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || 'OTP send failed');
  }
});
const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    initialized: false,
    otpSent: false,
    otpError: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearOTPStatus: (state) => {
      state.otpSent = false;
      state.otpError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Loginthunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Loginthunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(Loginthunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || 'Login failed';
      })

      .addCase(Signupthunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
      })
      .addCase(Signupthunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(Signupthunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || 'Signup failed';
      })

      .addCase(Getmyuserthunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Getmyuserthunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(Getmyuserthunk.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || 'Unauthorized';
        state.initialized = true;
      })

      .addCase(Updateuserthunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Updateuserthunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
        state.initialized = true;
      })
      .addCase(Updateuserthunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Update failed';
        state.initialized = true;
      })

      .addCase(Logoutthunk.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })

      .addCase(SendOTPThunk.pending, (state) => {
        state.loading = true;
        state.otpSent = false;
        state.otpError = null;
      })
      .addCase(SendOTPThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.otpError = null;
      })
      .addCase(SendOTPThunk.rejected, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        state.otpError = action.payload || 'OTP sending failed';
      });
  },
});

export const { setUser, clearOTPStatus } = AuthSlice.actions;
export default AuthSlice.reducer;
