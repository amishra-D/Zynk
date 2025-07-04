import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CallControls = ({
  isMuted,
  isVideoOff,
  isScreenSharing,
  isChatOpen,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onEndCall
}) => {
  return (
    <div className="flex justify-center space-x-6 py-4">
      <Button
        onClick={onToggleMute}
        className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} hover:bg-opacity-80 transition-all`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>

      <Button
        onClick={onToggleVideo}
        className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'} hover:bg-opacity-80 transition-all`}
        title={isVideoOff ? "Turn on camera" : "Turn off camera"}
      >
        {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
      </Button>

      <Button
        onClick={onToggleScreenShare}
        className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-opacity-80 transition-all`}
        title={isScreenSharing ? "Stop screen share" : "Share screen"}
      >
        <ScreenShare className="h-6 w-6" />
      </Button>

      <Button
        onClick={onToggleChat}
        className={`p-3 rounded-full ${isChatOpen ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-opacity-80 transition-all`}
        title="Toggle chat"
      >
        <MessageSquareText className="h-6 w-6" />
      </Button>

      <Button
        onClick={onEndCall}
        className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all"
        title="End call"
      >
        <PhoneOff className="h-6 w-6" />
      </Button>
    </div>
  );
};
