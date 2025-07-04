import React, { useEffect, useRef } from 'react';
import { VideoOff, User } from 'lucide-react';

export const RemoteVideoDisplay = ({ remoteStream, connectionStatus }) => {
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      
      const videoElement = remoteVideoRef.current;
      
      const handleLoadedMetadata = () => {
        console.log('Remote video metadata loaded');
      };
      
      const handleError = (e) => {
        console.error('Remote video error:', e);
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('error', handleError);
      
      videoElement.play().catch(console.error);
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [remoteStream]);

  if (remoteStream) {
    return (
      <div className="relative w-full h-full">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded-lg bg-black"
        />
        {remoteVideoRef.current && remoteVideoRef.current.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
            <div className="text-white text-center">
              <p>Loading video...</p>
              <p className="text-sm">Connection: {connectionStatus}</p>
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

export const LocalVideoDisplay = ({ localStream, isVideoOff, letter }) => {
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(e => console.error('Local video play error:', e));
    }
  }, [localStream]);

  return (
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
  );
};
