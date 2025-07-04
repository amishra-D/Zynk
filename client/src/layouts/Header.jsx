import React from 'react';
import { Microwave } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Profile } from './Profile';
import { useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const currentDate = new Date().toString().split(' ').slice(0, 5).join(' ');

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-background text-foreground font-plus gap-2 sm:gap-0">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <Microwave className="w-10 h-10 sm:w-14 sm:h-14 text-[#D3500C]" />
        <h1 className="font-bold text-3xl sm:text-5xl text-white">Zynk</h1>
      </div>

      {/* Right Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <h2 className="text-sm sm:text-lg font-semibold text-[#D3500C]">{currentDate}</h2>
        {!user ? (
          <div className="flex gap-2">
            <Button onClick={() => navigate('/auth')} size="sm">
              Login
            </Button>
            <Button onClick={() => navigate('/auth')} size="sm">
              Sign Up
            </Button>
          </div>
        ) : (
          <Profile />
        )}
      </div>
    </div>
  );
};

export default Header;
