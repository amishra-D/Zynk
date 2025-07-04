import { useRef, useEffect, useState, useCallback } from 'react';

export const useWebRTC = (socket, roomId) => {
  const peerRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [callStarted, setCallStarted] = useState(false);
  const cleanupComplete = useRef(false);

  const cleanupResources = useCallback(() => {
    if (cleanupComplete.current) return;
    cleanupComplete.current = true;

    console.log('Cleaning up WebRTC resources...');
    
    if (peerRef.current) {
      peerRef.current.onicecandidate = null;
      peerRef.current.ontrack = null;
      peerRef.current.oniceconnectionstatechange = null;
      peerRef.current.onicecandidateerror = null;
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
  }, [socket, roomId]);

  const setupWebRTC = useCallback(async (stream, onTrackReceived) => {
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
          setCallStarted(true);
        } else if (state === 'disconnected' || state === 'failed') {
          console.log('Connection failed or disconnected');
          if (state === 'failed') {
            peerConnection.restartIce();
          }
          setCallStarted(false);
        }
      };

      peerConnection.onicecandidateerror = (event) => {
        console.error('ICE candidate error:', event);
      };

      peerConnection.ontrack = (event) => {
        console.log('Received track event');
        const [incomingStream] = event.streams;
        if (incomingStream && onTrackReceived) {
          onTrackReceived(incomingStream);
        }
      };

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            roomId,
          });
        }
      };

      console.log('WebRTC setup complete');
    } catch (error) {
      console.error('Error setting up WebRTC:', error);
      throw error;
    }
  }, [socket, roomId]);

  const createOffer = useCallback(async (targetSocketId) => {
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
      
      socket.emit('offer', {
        offer,
        to: targetSocketId,
        roomId,
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [socket, roomId]);

  const createAnswer = useCallback(async (offer, from) => {
    try {
      if (!peerRef.current) {
        console.warn('PeerConnection not initialized');
        return;
      }

      console.log('Creating answer for offer from:', from);
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      socket.emit('answer', {
        answer,
        to: from,
        roomId,
      });
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  }, [socket, roomId]);

  const handleAnswer = useCallback(async (answer) => {
    try {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error setting remote description:', error);
    }
  }, []);

  const handleIceCandidate = useCallback(async (candidate) => {
    try {
      if (!peerRef.current) return;
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }, []);

  const replaceSenderTrack = useCallback(async (newTrack, trackKind) => {
    if (!peerRef.current) return;
    
    const sender = peerRef.current.getSenders().find(s => 
      s.track && s.track.kind === trackKind
    );
    
    if (sender) {
      await sender.replaceTrack(newTrack);
    }
  }, []);

  return {
    peerRef,
    connectionStatus,
    callStarted,
    setupWebRTC,
    createOffer,
    createAnswer,
    handleAnswer,
    handleIceCandidate,
    replaceSenderTrack,
    cleanupResources
  };
};