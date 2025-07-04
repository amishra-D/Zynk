import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '@/Socket/socketContext';
import { useDispatch, useSelector } from 'react-redux';
import { Getmyuserthunk } from '@/Features/auth/authSlice';
import { customAlphabet } from 'nanoid';

const Details = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const [roomId, setRoomId] = useState('');
  
  const generateSegment = customAlphabet(
    '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    3
  );

  const generateCode = () => {
    return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
  };

  useEffect(() => {
    dispatch(Getmyuserthunk());
  }, [dispatch]);

  const handleCreateRoom = () => {
    const newRoomId = generateCode();
    setRoomId(newRoomId);
    
    if (!user?.username) {
      console.log("User not loaded");
      return;
    }

    try {
      socket.emit('join-room', {
        roomId: newRoomId,
        username: user.username,
        userId: user._id,
      });
      navigate('/call', { state: { roomId: newRoomId } });
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = () => {
    if (!roomId.trim() || !user?.username) {
      console.log("User not loaded or Room ID missing");
      return;
    }

    try {
      socket.emit('join-room', {
        roomId,
        username: user.username,
        userId: user._id,
      });
      navigate('/call', { state: { roomId } });
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = (newUser) => {
      console.log('User joined:', newUser);
    };

    socket.on('user-joined', handleUserJoined);

    return () => {
      socket.off('user-joined', handleUserJoined);
    };
  }, [socket]);

  if (loading || !user) {
    return <div className="w-full flex justify-center mt-12">Loading user...</div>;
  }

  return (
    <div className="w-full flex justify-center mt-12">
      <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl w-full px-4">
        <Input
          className="placeholder:text-zinc-600 text-lg sm:text-2xl font-semibold px-4 py-3 w-full"
          maxLength="11"
          type="text"
          value={roomId}
          placeholder="dre-t4v-8ev"
          onChange={(e) => setRoomId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
        />
        <Button
          onClick={handleJoinRoom}
          disabled={!roomId.trim() || loading || !user?.username}
          className="w-full sm:w-auto py-3 px-6 text-md transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          Join Call
        </Button>
        <Button
          onClick={handleCreateRoom}
          disabled={loading || !user?.username}
          className="w-full sm:w-auto py-3 px-6 text-md transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          Create Call
        </Button>
      </div>
    </div>
  );
};

export default Details;