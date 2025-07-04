import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '../components/ui/input';
import { useDispatch } from 'react-redux';
import { Loginthunk } from '@/Features/auth/authSlice';
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';

const Login = ({ settype }) => {
  const navigate=useNavigate();
const dispatch=useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

 const onSubmit = (data) => {
  dispatch(Loginthunk(data))
    .unwrap()
    .then((res) => {
toast.success(res.message || "Login Successful")
navigate('/');
      // toast({
      //   title: "Login Successful",
      //   description: res.message,
      // });
    })
    .catch((err) => {
toast.error(err.message || "Login Failed")
      // toast({
      //   title: "Login Failed",
      //   description: err.message || "Something went wrong",
      // });
    });
};


  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              className="px-4 py-3 rounded-lg"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="px-4 py-3 rounded-lg"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-[#D3500C] hover:text-orange-700">
            Forgot password?
          </a>
        </div>
        <Button
          type="submit"
          className="w-full py-3 px-4 bg-[#D3500C] hover:bg-orange-700 text-white font-medium rounded-lg shadow-md transition duration-200"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-foreground">
          Don't have an account?{' '}
          <span
            onClick={() => settype('signup')}
            className="font-medium text-[#D3500C] hover:text-orange-700 cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
