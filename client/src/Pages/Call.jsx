import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '@/Socket/socketContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';

const Call = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomId = location.state?.roomId;
  const user = useSelector((state) => state.auth.user);
  const username = user?.username || "Z";

  const socket = useContext(SocketContext);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [letter, setletter] = useState('Z');
  const peerRef = useRef(null);
  const cleanupComplete = useRef(false);

  const cleanupResources = () => {
    if (cleanupComplete.current) return;
    cleanupComplete.current = true;

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (socket) {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.emit('leave-call', { roomId });
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const endCall = () => {
    cleanupResources();
    navigate('/');
  };

  useEffect(() => {
    if (!roomId || !socket) return;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setupWebRTC(stream);
      })
      .catch((err) => {
        console.error('Error accessing media devices.', err);
      });

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
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async ({ candidate }) => {
      console.log('Received ICE candidate');
      if (peerRef.current) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      cleanupResources();
    };
  }, [roomId, socket]);

  useEffect(() => {
    if (username) {
      setletter(username.charAt(0).toUpperCase());
    }
  }, [username]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      cleanupResources();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const setupWebRTC = (stream) => {
    peerRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    peerRef.current.ontrack = (event) => {
      console.log('Receiving remote stream');
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    stream.getTracks().forEach((track) => {
      peerRef.current.addTrack(track, stream);
    });

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          roomId,
        });
      }
    };
  };

  const createOffer = async (targetSocketId) => {
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    socket.emit('offer', { offer, to: targetSocketId, roomId });
  };

  const createAnswer = async (offer, from) => {
    if (!peerRef.current) {
      console.warn("PeerConnection not initialized. Cannot create answer.");
      return;
    }
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);
    socket.emit('answer', { answer, to: from, roomId });
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-screen bg-background text-white p-4 font-plus">
      <div className="w-full text-center py-2">
        <h2 className="text-sm font-semibold">Room ID: {roomId}</h2>
        {!remoteStream && (
          <div className="mt-4 text-gray-300 flex items-center justify-center gap-2">
            <User className="w-5 h-5" />
            <span>Waiting for participant to join...</span>
          </div>
        )}
      </div>

      <div className="relative w-full h-full max-w-6xl mx-auto">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 rounded-lg flex items-center justify-center">
            <div className="text-2xl text-gray-400 flex items-center gap-2">
              <VideoOff className="w-8 h-8" />
              <span>No remote video available</span>
            </div>
          </div>
        )}

        <div className={`absolute bottom-4 right-4 ${isVideoOff ? 'bg-gray-700' : ''}`}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-40 h-30 rounded-lg border-2 ${isVideoOff ? 'border-red-500' : 'border-green-500'} transition-all`}
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <div className='rounded-full w-12 h-12 flex items-center justify-center bg-orange-500 text-foreground p-4 font-bold'>
                <p>{letter}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center space-x-6 py-4">
        <Button
          onClick={toggleMute}
          className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} hover:bg-opacity-80 transition-all`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'} hover:bg-opacity-80 transition-all`}
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </Button>

        <Button
          onClick={endCall}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all"
          title="End call"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Call;