import React from 'react';
import { User } from 'lucide-react';

export const CallHeader = ({ roomId, connectionStatus, remoteStream, duration, formatTime }) => {
  return (
    <div className="w-full text-center py-2">
      <div className="text-sm text-muted-foreground mb-2">
        Duration: {formatTime(duration)}
      </div>
      <h2 className="text-sm font-semibold">Room ID: {roomId}</h2>
      <p className="text-xs text-gray-400">Status: {connectionStatus}</p>
      {!remoteStream && (
        <div className="mt-4 text-gray-300 flex items-center justify-center gap-2">
          <User className="w-5 h-5" />
          <span>Waiting for participant to join...</span>
        </div>
      )}
    </div>
  );
};