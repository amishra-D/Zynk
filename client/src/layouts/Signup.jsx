import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Signupthunk } from '@/Features/auth/authSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '../components/ui/input';

const Signup = ({ settype }) => {
  const dispatch = useDispatch();

  // RHF hook
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(Signupthunk(data)).unwrap();
      toast.success('Signup successful');
      console.log('Signup success', response);
    } catch (err) {
      toast.error('Signup failed');
      console.error('Signup error', err);
    }
  };

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
              Username
            </label>
            <Input
              id="username"
              placeholder="Enter username"
              {...register('username', { required: 'Username is required' })}
              className="px-4 py-3 rounded-lg"
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email', { required: 'Email is required' })}
              className="px-4 py-3 rounded-lg"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
              className="px-4 py-3 rounded-lg"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#D3500C] focus:ring-[#D3500C] border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
              Remember me
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-3 px-4 bg-[#D3500C] hover:bg-orange-700 text-white font-medium rounded-lg shadow-md transition duration-200"
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-foreground">
          Already have an account?{' '}
          <span onClick={() => settype('login')} className="font-medium text-[#D3500C] hover:text-orange-700 cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
