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
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const peerRef = useRef(null);
  const cleanupComplete = useRef(false);
  const originalStreamRef = useRef(null);

  const debugConnection = () => {
    if (!peerRef.current) {
      console.log('No active peer connection');
      return;
    }
    
    console.log('=== Connection Debug Info ===');
    console.log('ICE Connection State:', peerRef.current.iceConnectionState);
    console.log('Signaling State:', peerRef.current.signalingState);
    console.log('Connection State:', peerRef.current.connectionState);
    
    console.log('Transceivers:');
    peerRef.current.getTransceivers().forEach((transceiver, index) => {
      console.log(`Transceiver ${index}:`, {
        direction: transceiver.direction,
        currentDirection: transceiver.currentDirection,
        sender: transceiver.sender?.track ? {
          kind: transceiver.sender.track.kind,
          enabled: transceiver.sender.track.enabled,
          readyState: transceiver.sender.track.readyState
        } : null,
        receiver: transceiver.receiver?.track ? {
          kind: transceiver.receiver.track.kind,
          enabled: transceiver.receiver.track.enabled,
          readyState: transceiver.receiver.track.readyState
        } : null
      });
    });
    
    console.log('Remote Stream:', remoteStream?.id);
    console.log('Remote Stream Tracks:', remoteStream?.getTracks().map(t => `${t.kind} (${t.readyState})`));
    
    if (remoteVideoRef.current) {
      console.log('Video Element:', {
        readyState: remoteVideoRef.current.readyState,
        videoWidth: remoteVideoRef.current.videoWidth,
        videoHeight: remoteVideoRef.current.videoHeight,
        paused: remoteVideoRef.current.paused,
        error: remoteVideoRef.current.error,
        srcObject: remoteVideoRef.current.srcObject?.id
      });
    }
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

    if (originalStreamRef.current) {
      console.log('Stopping original stream tracks');
      originalStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      originalStreamRef.current = null;
    }

    if (peerRef.current) {
      console.log('Closing peer connection');
      peerRef.current.onicecandidate = null;
      peerRef.current.ontrack = null;
      peerRef.current.oniceconnectionstatechange = null;
      peerRef.current.onicecandidateerror = null;
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

    setRemoteStream(null);
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
        const state = peerConnection.iceConnectionState;
        console.log('ICE connection state:', state);
        setConnectionStatus(state);
        
        if (state === 'connected' || state === 'completed') {
          console.log('WebRTC connection established successfully');
        } else if (state === 'disconnected' || state === 'failed') {
          console.log('Connection failed or disconnected');
          if (state === 'failed') {
            console.log('Connection failed, attempting to restart ICE');
            peerConnection.restartIce();
          }
        }
      };

      peerConnection.onicecandidateerror = (event) => {
        console.error('ICE candidate error:', event);
      };

      peerConnection.ontrack = (event) => {
        console.log('Received track event:', event);
        console.log('Event streams:', event.streams);
        console.log('Event track:', event.track);
        
        const [incomingStream] = event.streams;
        
        if (incomingStream) {
          console.log('Setting remote stream:', incomingStream.id);
          console.log('Remote stream tracks:', incomingStream.getTracks().map(t => `${t.kind} (${t.readyState})`));
          
          setRemoteStream(incomingStream);
          
          if (remoteVideoRef.current) {
            console.log('Updating remote video element');
            remoteVideoRef.current.srcObject = incomingStream;
            
            remoteVideoRef.current.play()
              .then(() => {
                console.log('Remote video playback started successfully');
                console.log('Video dimensions:', {
                  width: remoteVideoRef.current.videoWidth,
                  height: remoteVideoRef.current.videoHeight
                });
              })
              .catch(error => {
                console.error('Remote video play error:', error);
              });
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
      debugConnection();
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
      const offer = await peerRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
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
    if (remoteStream && remoteVideoRef.current) {
      console.log('Updating video element with remote stream');
      remoteVideoRef.current.srcObject = remoteStream;
      
      const videoElement = remoteVideoRef.current;
      
      const handleLoadedMetadata = () => {
        console.log('Remote video metadata loaded:', {
          videoWidth: videoElement.videoWidth,
          videoHeight: videoElement.videoHeight,
          duration: videoElement.duration
        });
      };
      
      const handleCanPlay = () => {
        console.log('Remote video can play');
      };
      
      const handlePlaying = () => {
        console.log('Remote video started playing');
      };
      
      const handleError = (e) => {
        console.error('Remote video error:', e);
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('playing', handlePlaying);
      videoElement.addEventListener('error', handleError);
      
      videoElement.play().catch(console.error);
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('playing', handlePlaying);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [remoteStream]);

  useEffect(() => {
    if (!roomId || !socket) {
      console.warn('Missing roomId or socket');
      return;
    }

    const initializeCall = async () => {
      try {
        console.log('Initializing call for room:', roomId);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }, 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        console.log('Got local media stream');
        setLocalStream(stream);
        originalStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(e => console.error('Local video play error:', e));
        }

        await setupWebRTC(stream);

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
          try {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            console.log('Remote description set successfully');
            debugConnection();
          } catch (error) {
            console.error('Error setting remote description:', error);
          }
        });

        socket.on('ice-candidate', async ({ candidate }) => {
          console.log('Received ICE candidate');
          try {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            debugConnection();
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
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
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: true 
        });
        
        const videoTrack = screenStream.getVideoTracks()[0];
        if (peerRef.current) {
          const sender = peerRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        }
        
        setLocalStream(screenStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        
        videoTrack.onended = () => {
          toggleScreenShare();
        };
        
      } else {
        if (originalStreamRef.current) {
          const videoTrack = originalStreamRef.current.getVideoTracks()[0];
          if (peerRef.current) {
            const sender = peerRef.current.getSenders().find(s => 
              s.track && s.track.kind === 'video'
            );
            if (sender) {
              await sender.replaceTrack(videoTrack);
            }
          }
          
          setLocalStream(originalStreamRef.current);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = originalStreamRef.current;
          }
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      if (error.name === 'NotAllowedError') {
        alert('Screen sharing permission denied');
      }
    }
  };

  const forceVideoRefresh = () => {
    if (remoteStream && remoteVideoRef.current) {
      console.log('Forcing video refresh');
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(console.error);
    }
    debugConnection();
  };

  const renderRemoteVideo = () => {
    const hasVideoTrack = peerRef.current?.getTransceivers().some(
      t => t.receiver?.track?.kind === 'video' && t.receiver.track.readyState === 'live'
    );
    
    if (hasVideoTrack || remoteStream) {
      return (
        <div className="relative w-full h-full">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg bg-black"
            onLoadedMetadata={() => console.log('Remote video metadata loaded')}
            onCanPlay={() => console.log('Remote video can play')}
            onPlaying={() => console.log('Remote video started playing')}
            onError={(e) => console.error('Remote video error:', e)}
          />
          {(!remoteStream || (remoteVideoRef.current && remoteVideoRef.current.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA)) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
              <div className="text-white text-center">
                <p>Waiting for video data...</p>
                <p className="text-sm">Connection: {connectionStatus}</p>
                <button 
                  onClick={forceVideoRefresh}
                  className="mt-2 px-4 py-2 bg-blue-500 rounded text-sm hover:bg-blue-600"
                >
                  Refresh Video
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="w-full h-full bg-neutral-800 rounded-lg flex items-center justify-center">
        <div className="text-2xl text-gray-400 flex items-center gap-2">
          <VideoOff className="w-8 h-8" />
          <span>No remote video available</span>
        </div>
      </div>
    );
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
        {renderRemoteVideo()}
        
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
          className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-opacity-80 transition-all`}
          title={isScreenSharing ? "Stop screen share" : "Share screen"}
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
          onClick={debugConnection}
          className="p-3 rounded-full bg-yellow-500 hover:bg-opacity-80 transition-all"
          title="Debug Connection"
        >
          Debug
        </Button>

        <Button
          onClick={forceVideoRefresh}
          className="p-3 rounded-full bg-green-500 hover:bg-opacity-80 transition-all"
          title="Force Video Refresh"
        >
          Refresh
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