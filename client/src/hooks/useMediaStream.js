import { useState, useRef, useCallback } from 'react';

export const useMediaStream = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const originalStreamRef = useRef(null);

  const getMediaStream = useCallback(async () => {
    try {
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
      
      setLocalStream(stream);
      originalStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error getting media stream:', error);
      throw error;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  }, [localStream, isVideoOff]);

  const toggleScreenShare = useCallback(async (replaceSenderTrack) => {
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
        if (replaceSenderTrack) {
          await replaceSenderTrack(videoTrack, 'video');
        }
        
        setLocalStream(screenStream);
        setIsScreenSharing(true);
        
        videoTrack.onended = () => {
          toggleScreenShare(replaceSenderTrack);
        };
        
        return screenStream;
      } else {
        if (originalStreamRef.current) {
          const videoTrack = originalStreamRef.current.getVideoTracks()[0];
          if (replaceSenderTrack) {
            await replaceSenderTrack(videoTrack, 'video');
          }
          
          setLocalStream(originalStreamRef.current);
          setIsScreenSharing(false);
          return originalStreamRef.current;
        }
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      if (error.name === 'NotAllowedError') {
        alert('Screen sharing permission denied');
      }
      throw error;
    }
  }, [isScreenSharing]);

  const cleanupStreams = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      setLocalStream(null);
    }

    if (originalStreamRef.current) {
      originalStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      originalStreamRef.current = null;
    }

    setRemoteStream(null);
  }, [localStream]);

  return {
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
  };
};