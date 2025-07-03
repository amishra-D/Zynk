import axios from 'axios';
export const signupAPI=async(data)=>{
    try{
const response = await axios.post(
  'http://localhost:3000/api/auth/signup',
  data,
  {
    withCredentials: true
  }
);
return response.data;
    }
    catch(error){
        console.log(error)
        }
}

export const loginAPI=async(data)=>{
    try{
const response = await axios.post(
  'http://localhost:3000/api/auth/login',
  data,
  {
    withCredentials: true
  }
);
return response.data;
    }
    catch(error){
        console.log(error)
        }
}
export const logoutAPI=async()=>{
    try{
const response = await axios.get(
  'http://localhost:3000/api/auth/logout',
  {
    withCredentials: true
  }
);
return response.data;
    }
    catch(error){
        console.log(error)
        }
}
export const getmyuserAPI=async()=>{
    try{
const response = await axios.get(
  'http://localhost:3000/api/profile/getmyuser',
  {
    withCredentials: true
  }
);
return response.data;
    }
    catch(error){
        console.log(error)
        }
}
