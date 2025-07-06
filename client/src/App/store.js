import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Features/auth/authSlice';
import callReducer from '../Features/call/callSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    call:callReducer
  }
});

export default store;
