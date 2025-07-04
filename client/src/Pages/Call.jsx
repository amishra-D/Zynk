import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '@/Socket/socketContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, ScreenShare, MessageSquareText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import Chat from '../layouts/Chat';

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [letter, setLetter] = useState('Z');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const peerRef = useRef(null);
  const cleanupComplete = useRef(false);

  const logPeerConnectionState = () => {
    if (!peerRef.current) {
      console.log('No peer connection');
      return;
    }
    console.log('ICE Connection State:', peerRef.current.iceConnectionState);
    console.log('ICE Gathering State:', peerRef.current.iceGatheringState);
    console.log('Signaling State:', peerRef.current.signalingState);
    console.log('Connection State:', peerRef.current.connectionState);
  };

  const cleanupResources = () => {
    if (cleanupComplete.current) return;
    cleanupComplete.current = true;

    console.log('Cleaning up resources...');
    
    if (localStream) {
      console.log('Stopping local stream tracks');
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped track: ${track.kind}`);
      });
      setLocalStream(null);
    }

    if (peerRef.current) {
      console.log('Closing peer connection');
      peerRef.current.onicecandidate = null;
      peerRef.current.ontrack = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    if (socket) {
      console.log('Removing socket listeners');
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

  const setupWebRTC = async (stream) => {
    try {
      console.log('Setting up WebRTC connection');
      
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      });
      peerRef.current = peerConnection;

      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
        setConnectionStatus(peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === 'disconnected' || 
            peerConnection.iceConnectionState === 'failed') {
          console.log('Connection failed or disconnected');
        }
      };

      peerConnection.onicecandidateerror = (event) => {
        console.error('ICE candidate error:', event);
      };

      peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        if (event.streams && event.streams[0]) {
          console.log('Setting remote stream with tracks:', event.streams[0].getTracks());
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            remoteVideoRef.current.play().catch(e => console.error('Remote video play error:', e));
          }
        }
      };

      stream.getTracks().forEach((track) => {
        console.log(`Adding local ${track.kind} track to peer connection`);
        peerConnection.addTrack(track, stream);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate');
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            roomId,
          });
        } else {
          console.log('All ICE candidates sent');
        }
      };

      console.log('WebRTC setup complete');
      logPeerConnectionState();
    } catch (error) {
      console.error('Error setting up WebRTC:', error);
    }
  };

  const createOffer = async (targetSocketId) => {
    try {
      if (!peerRef.current) {
        console.warn('PeerConnection not initialized');
        return;
      }

      console.log('Creating offer for:', targetSocketId);
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      console.log('Local description set with offer');

      socket.emit('offer', {
        offer,
        to: targetSocketId,
        roomId,
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const createAnswer = async (offer, from) => {
    try {
      if (!peerRef.current) {
        console.warn('PeerConnection not initialized');
        return;
      }

      console.log('Creating answer for offer from:', from);
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      console.log('Local description set with answer');

      socket.emit('answer', {
        answer,
        to: from,
        roomId,
      });
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  useEffect(() => {
    if (!roomId || !socket) {
      console.warn('Missing roomId or socket');
      return;
    }

    const initializeCall = async () => {
      try {
        console.log('Initializing call for room:', roomId);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        console.log('Got local media stream');
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(e => console.error('Local video play error:', e));
        }

        await setupWebRTC(stream);

        // Set up socket listeners
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
          logPeerConnectionState();
        });

        socket.on('ice-candidate', async ({ candidate }) => {
          console.log('Received ICE candidate');
          try {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            logPeerConnectionState();
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        });

      } catch (error) {
        console.error('Error initializing call:', error);
        if (error.name === 'NotAllowedError') {
          alert('Please allow camera and microphone access to use this feature');
        }
      }
    };

    initializeCall();

    return () => {
      cleanupResources();
    };
  }, [roomId, socket]);

  useEffect(() => {
    if (username) {
      setLetter(username.charAt(0).toUpperCase());
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

  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
        console.log(`Audio track ${track.id} enabled: ${track.enabled}`);
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
        console.log(`Video track ${track.id} enabled: ${track.enabled}`);
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (localStream?.getVideoTracks()[0]?.readyState === 'live') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: true 
        });
        setLocalStream(screenStream);
        localVideoRef.current.srcObject = screenStream;
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full relative h-screen bg-background text-white p-4 font-plus">
      {isChatOpen && (
        <div className='absolute left-2 top-2 z-50 flex items-center py-2'>
          <Chat roomId={roomId} />
        </div>
      )}

      <div className="w-full text-center py-2">
        <h2 className="text-sm font-semibold">Room ID: {roomId}</h2>
        <p className="text-xs text-gray-400">Status: {connectionStatus}</p>
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
          onClick={toggleScreenShare}
          className="p-3 rounded-full bg-gray-700 hover:bg-opacity-80 transition-all"
          title="Share screen"
        >
          <ScreenShare className="h-6 w-6" />
        </Button>

        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-3 rounded-full ${isChatOpen ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-opacity-80 transition-all`}
          title="Toggle chat"
        >
          <MessageSquareText className="h-6 w-6" />
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