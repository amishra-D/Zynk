import { useState, useEffect } from 'react';

export const useCallTimer = (callStarted) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!callStarted) return;

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    duration,
    formatTime
  };
};