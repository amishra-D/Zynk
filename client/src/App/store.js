// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Features/auth/authSlice'; // Adjust path if needed
import callReducer from '../Features/call/callSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    call:callReducer
  }
});

export default store;
