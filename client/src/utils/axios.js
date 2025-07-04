import axios from 'axios';
const BASE_URL=import.meta.env.VITE_BASE_URL

const api = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});
api.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
api.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
if (error.response?.status === 401){
  window.href='/auth'
}  });

export default api;
