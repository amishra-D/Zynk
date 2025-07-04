import api from '@/utils/axios';

export const signupAPI = async (data) => {
  try {
    const response = await api.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const loginAPI = async (data) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logoutAPI = async () => {
  try {
    const response = await api.get('/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};

export const getmyuserAPI = async () => {
  try {
    const response = await api.get('/profile/getmyuser');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Unauthorized' };
  }
};
