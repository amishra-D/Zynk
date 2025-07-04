import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '@/Socket/socketContext';
import { useSelector } from 'react-redux';
import Chat from '../layouts/Chat';
import { useWebRTC } from '../hooks/useWebRTC';
import { useMediaStream } from '../hooks/useMediaStream';
import { useCallTimer } from '../hooks/useCallTimer';
import { RemoteVideoDisplay, LocalVideoDisplay } from '../layouts/VideoDisplay';
import { CallControls } from '../layouts/CallControls';
import { CallHeader } from '../layouts/CallHeader';

const Call = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomId = location.state?.roomId;
  const user = useSelector((state) => state.auth.user);
  const username = user?.username || "Z";
  const socket = useContext(SocketContext);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [letter, setLetter] = useState('Z');

  const {
    connectionStatus,
    callStarted,
    setupWebRTC,
    createOffer,
    createAnswer,
    handleAnswer,
    handleIceCandidate,
    replaceSenderTrack,
    cleanupResources: cleanupWebRTC
  } = useWebRTC(socket, roomId);

  const {
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    setRemoteStream,
    getMediaStream,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    cleanupStreams
  } = useMediaStream();

  const { duration, formatTime } = useCallTimer(callStarted);

  const handleTrackReceived = (incomingStream) => {
    console.log('Setting remote stream');
    setRemoteStream(incomingStream);
  };

  const handleToggleScreenShare = async () => {
    try {
      const newStream = await toggleScreenShare(replaceSenderTrack);
      // Stream is already set in the hook
    } catch (error) {
      console.error('Screen share toggle failed:', error);
    }
  };

  const endCall = () => {
    cleanupWebRTC();
    cleanupStreams();
    navigate('/');
  };

  useEffect(() => {
    if (!roomId || !socket) {
      console.warn('Missing roomId or socket');
      return;
    }

    const initializeCall = async () => {
      try {
        console.log('Initializing call for room:', roomId);
        const stream = await getMediaStream();
        
        await setupWebRTC(stream, handleTrackReceived);

        socket.emit('join-call', { roomId });

        socket.on('user-joined', async ({ socketId }) => {
          console.log('User joined, creating offer to:', socketId);
          await createOffer(socketId);
        });

        socket.on('offer', async ({ offer, from }) => {
          console.log('Received offer from', from);
          await createAnswer(offer, from);
        });

        socket.on('answer', async ({ answer }) => {
          console.log('Received answer');
          await handleAnswer(answer);
        });

        socket.on('ice-candidate', async ({ candidate }) => {
          console.log('Received ICE candidate');
          await handleIceCandidate(candidate);
        });

      } catch (error) {
        console.error('Error initializing call:', error);
        if (error.name === 'NotAllowedError') {
          alert('Please allow camera and microphone access to use this feature');
        } else if (error.name === 'NotFoundError') {
          alert('Camera or microphone not found. Please check your devices.');
        } else {
          alert('Failed to initialize call. Please try again.');
        }
      }
    };

    initializeCall();

    return () => {
      cleanupWebRTC();
      cleanupStreams();
    };
  }, [roomId, socket]);

  useEffect(() => {
    if (username) {
      setLetter(username.charAt(0).toUpperCase());
    }
  }, [username]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      cleanupWebRTC();
      cleanupStreams();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-between w-full relative h-screen bg-background text-white p-4 font-plus">
      <CallHeader 
        roomId={roomId}
        connectionStatus={connectionStatus}
        remoteStream={remoteStream}
        duration={duration}
        formatTime={formatTime}
      />

      {isChatOpen && (
        <div className='absolute left-2 top-2 z-50 flex items-center py-2'>
          <Chat roomId={roomId} isChatOpen={isChatOpen} />
        </div>
      )}

      <div className="relative w-full h-full max-w-6xl mx-auto">
        <RemoteVideoDisplay 
          remoteStream={remoteStream}
          connectionStatus={connectionStatus}
        />
        
        <LocalVideoDisplay 
          localStream={localStream}
          isVideoOff={isVideoOff}
          letter={letter}
        />
      </div>

      <CallControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        isChatOpen={isChatOpen}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onEndCall={endCall}
      />
    </div>
  );
};

export default Call;