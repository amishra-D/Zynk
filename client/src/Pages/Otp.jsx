import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Signupthunk } from '@/Features/auth/authSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

const Otp = ({ userData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      return toast.error('Please enter a valid 6-digit OTP');
    }

    try {
      setLoading(true);
      await dispatch(Signupthunk({ ...userData, otp, role: 'user' })).unwrap();
      toast.success('Signup successful!');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-center">Verify OTP</h2>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        onClick={handleVerify}
        className="w-full bg-[#D3500C] hover:bg-orange-700 text-white"
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify & Sign Up'}
      </Button>
    </div>
  );
};

export default Otp;
