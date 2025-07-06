import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SendOTPThunk } from '@/Features/auth/authSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '../components/ui/input';
import Otp from '../Pages/Otp';

const Signup = ({ settype }) => {
  const dispatch = useDispatch();
  const [otpStage, setOtpStage] = useState(false);
  const [formData, setFormData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleSendOtp = async (data) => {
    try {
      const res = await dispatch(SendOTPThunk({ email: data.email })).unwrap();
      toast.success('OTP sent to email');
      setFormData(data);
      setOtpStage(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    }
  };

  if (otpStage) {
    return <Otp userData={formData} settype={settype} />;
  }

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(handleSendOtp)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              placeholder="Enter username"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
        </div>
        <Button type="submit" className="w-full bg-[#D3500C] text-white">Sign Up</Button>
      </form>
      <div className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <span onClick={() => settype('login')} className="text-[#D3500C] cursor-pointer font-medium">Login</span>
      </div>
    </div>
  );
};

export default Signup;
