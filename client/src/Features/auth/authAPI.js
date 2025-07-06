import api from '@/utils/axios';

export const signupAPI = async (data) => {
  try {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const loginAPI = async (data) => {
  try {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logoutAPI = async () => {
  try {
    const response = await api.get('/api/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};

export const getmyuserAPI = async () => {
  try {
    const response = await api.get('/api/profile/getmyuser');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Unauthorized' };
  }
};
export const updateuserAPI = async (data) => {
  try {
    const response = await api.put('/api/profile/updateuser', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Update failed' };
  }
};
export const sendOTPAPI = async (data) => {
  try {
    const response = await api.post('/api/auth/sendotp', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'OTP sending failed' };
  }
};

