import React, { useState } from 'react';
import Login from '@/layouts/Login';
import Signup from '@/layouts/Signup';

const Auth = () => {
  const [type,settype]=useState('login')
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#D3500C] to-[#FF8C42] flex items-center justify-center font-plus md:px-2 sm:p-8 lg:px-4 px-4">
      <div className="w-full h-[90%] max-w-5xl bg-background rounded-xl shadow-2xl flex overflow-hidden border border-white/10">

        <div className="w-1/2 h-full hidden md:flex relative">
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center p-8 text-white">
              <h1 className="text-5xl font-bold mb-4">Zynk</h1>
              <p className="text-md opacity-90">{type=='login' ? 'Say Hello, Without the Hassle.': 'Connect Instantly, Communicate Freely'}</p>
            </div>
          </div>
          <img
            src={type=='login' ? 'https://i.pinimg.com/736x/fe/a2/b7/fea2b754a8a511199374eda0257bc48a.jpg' :'https://i.pinimg.com/736x/29/f2/7b/29f27b8a624e07839025b5b9455aeb9c.jpg' }
            alt="auth"
            className="object-fit w-full h-full"
          />
        </div>

        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center px-10 py-12 bg-background">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl max-sm:text-2xl font-bold text-foreground mb-2">{type=='login' ? 'Welcome Back':'Welcome to Zynk'}</h2>
              <p className=" max-sm:text-xs text-foreground">{type=='login' ? 'Please enter your details to Login':'Please enter your details to Sign up'}</p>
            </div>
            {type=='login'
            ?<Login settype={settype}/>
            :<Signup settype={settype}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;