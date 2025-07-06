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
export const validateroomAPI = async (data) => {
  try {
    console.log(data);
    const response = await api.get(`/api/room/validateroom/${data.roomId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'participant adding failed' };
  }
};
export const endcallAPI = async (data) => {
  try {
    const response = await api.put('/api/room/endcall', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'call ended failed' };
  }
}