import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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
