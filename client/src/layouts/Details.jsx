import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '@/Socket/socketContext';
import { useDispatch, useSelector } from 'react-redux';
import { Getmyuserthunk } from '@/Features/auth/authSlice';
import { customAlphabet } from 'nanoid';
import { createroomthunk, validateroomthunk } from '@/Features/call/callSlice';
import { toast } from 'sonner';
import { motion } from "framer-motion";

const Details = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: {
      scale: 0.98
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 2px rgba(234, 88, 12, 0.5)"
    }
  };

  const { roomvalid } = useSelector((state) => state.call);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const generateSegment = customAlphabet(
    '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz',
    3
  );

  const generateCode = () => {
    return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
  };

  useEffect(() => {
    dispatch(Getmyuserthunk());
  }, [dispatch]);

  const createRoomInDB = async (newRoomId, user) => {
    try {
      const response = await dispatch(
        createroomthunk({
          roomId: newRoomId,
          host: user._id,
          participants: [user._id],
          duration: 0
        })
      ).unwrap();
      return response;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  };

  const handleCreateRoom = async () => {
    if (!user?.username) {
      toast.error("Please sign in to create a room");
      return;
    }

    setIsCreating(true);
    const newRoomId = generateCode();
    
    try {
      await createRoomInDB(newRoomId, user);
      
      socket.emit('join-room', {
        roomId: newRoomId,
        username: user.username,
        userId: user._id,
        isHost: true
      });

      navigate('/call', { state: { roomId: newRoomId, isHost: true } });
    } catch (error) {
      toast.error("Failed to create room. Please try again.");
      console.error('Error in room creation process:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }

    if (!user?.username) {
      toast.error("Please sign in to join a room");
      return;
    }

    setIsJoining(true);
    
    try {
      await dispatch(validateroomthunk({ roomId })).unwrap();
      
      if (!roomvalid) {
        toast.error("Room does not exist. Check the ID and try again.");
        return;
      }

      socket.emit('join-room', {
        roomId,
        username: user.username,
        userId: user._id,
        isHost: false
      });

      navigate('/call', { state: { roomId } });
    } catch (error) {
      toast.error("Failed to join room. Please try again.");
      console.error('Error joining room:', error);
    } finally {
      setIsJoining(false);
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
  }, [socket, user]);

  if (loading || !user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex justify-center items-center gap-2 mt-12"
      >
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-orange-500"></span>
        </span>
        <motion.p 
          animate={{
            opacity: [0.6, 1, 0.6],
            transition: { duration: 1.5, repeat: Infinity }
          }}
          className='text-xl font-bold font-plus text-zinc-600'
        >
          Sign up/Login to Join rooms/Create rooms
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex justify-center mt-12">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl w-full px-4"
      >
        <motion.div variants={itemVariants} className="w-full">
          <motion.div whileFocus="focus" variants={inputVariants}>
            <Input
              className="placeholder:text-zinc-600 text-lg sm:text-2xl font-semibold px-4 py-3 w-full"
              maxLength="11"
              type="text"
              value={roomId}
              placeholder="dre-t4v-8ev"
              onChange={(e) => {
                const value = e.target.value;
                setRoomId(value.replace(/[^a-zA-Z0-9-]/g, ''));
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full sm:w-auto">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={handleJoinRoom}
              disabled={!roomId.trim() || isJoining}
              className="w-full py-3 px-6 text-md"
            >
              {isJoining ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ↻
                  </motion.span>
                  Joining...
                </span>
              ) : (
                'Join Call'
              )}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full sm:w-auto">
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="w-full py-3 px-6 text-md bg-orange-600 hover:bg-orange-700"
            >
              {isCreating ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ↻
                  </motion.span>
                  Creating...
                </span>
              ) : (
                'Create Call'
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Details;