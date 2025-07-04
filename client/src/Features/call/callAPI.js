import api from '@/utils/axios';

export const createroomAPI = async (data) => {
  try {
    const response = await api.post('/api/room/createroom', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Room creation failed' };
  }
};
export const adduserroomAPI = async (data) => {
  try {
    const response = await api.put('/api/room/addparticipant', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'participant adding failed' };
  }
};