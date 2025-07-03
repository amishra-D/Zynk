import api from '@/utils/axios';

const config = {
  withCredentials: true,
};

export const signupAPI = async (data) => {
  try {
    const response = await api.post('http://localhost:3000/api/auth/signup', data, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const loginAPI = async (data) => {
  try {
    const response = await api.post('http://localhost:3000/api/auth/login', data, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logoutAPI = async () => {
  try {
    const response = await api.get('http://localhost:3000/api/auth/logout', config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};

export const getmyuserAPI = async () => {
  try {
    const response = await api.get('http://localhost:3000/api/profile/getmyuser', config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Unauthorized' };
  }
};
