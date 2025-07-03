import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link} from 'react-router-dom';
import { Getmyuserthunk } from '@/Features/auth/authSlice';
import { Loader2, AlertCircle } from 'lucide-react';

const Protected = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading, error, initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(Getmyuserthunk());
    }
  }, [dispatch, initialized]);

  if (!initialized || loading) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Checking authentication status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-white p-4 font-plus">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h1 className="text-3xl font-bold text-[#D3500C]">Authentication Required</h1>
        <p className="text-center text-foreground max-w-md">
          {error || 'You need to be logged in to access this page'}
        </p>
        <Link
          to="/auth"
          className="mt-4 px-6 py-2 bg-primary rounded-lg hover:bg-primary/80 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return children;
};

export default Protected;
