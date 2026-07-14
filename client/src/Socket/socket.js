import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const socket = io(BASE_URL || undefined, { 
  withCredentials: true,
  transports: import.meta.env.DEV ? ['polling', 'websocket'] : ['polling'],
});
export default socket;