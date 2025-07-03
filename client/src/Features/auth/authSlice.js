import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getmyuserAPI, loginAPI, logoutAPI, signupAPI } from "./authAPI";

export const Loginthunk=createAsyncThunk('/auth/login',loginAPI)
export const Signupthunk=createAsyncThunk('/auth/signup',signupAPI)
export const Logoutthunk=createAsyncThunk('/auth/logout',logoutAPI)
export const Getmyuserthunk=createAsyncThunk('/auth/getmyuser',getmyuserAPI)
const AuthSlice=createSlice({
    name:'auth',
    initialState:{
        user:null,
        loading:false,
        error:null
        },
        reducers:{},
          extraReducers: (builder) => {
        builder.addCase(Loginthunk.pending,(state,action)=>{
         state.user=null;
         state.loading=true;
         state.error=null;
        }) 
        .addCase(Loginthunk.fulfilled,(state,action)=>{
         state.user=action.payload.user;
         state.loading=false;
         state.error=null;
        })
         .addCase(Loginthunk.rejected,(state,action)=>{
         state.user=null;
         state.loading=false;
         state.error=action.payload.message;
        })
        .addCase(Signupthunk.pending,(state,action)=>{
         state.user=null;
         state.loading=true;
         state.error=null;
        }) 
        .addCase(Signupthunk.fulfilled,(state,action)=>{
         state.user=action.payload;
         state.loading=false;
         state.error=null;
        })
         .addCase(Signupthunk.rejected,(state,action)=>{
         state.user=null;
         state.loading=false;
         state.error=action.payload.message;
        })
         .addCase(Getmyuserthunk.pending,(state,action)=>{
         state.user=null;
         state.loading=true;
         state.error=null;
        }) 
        .addCase(Getmyuserthunk.fulfilled,(state,action)=>{
         state.user=action.payload.user;
         state.loading=false;
         state.error=null;
        })
         .addCase(Getmyuserthunk.rejected,(state,action)=>{
         state.user=null;
         state.loading=false;
         state.error=action.payload.message;
        })
        }
});
export default AuthSlice.reducer;