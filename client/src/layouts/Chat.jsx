import { useState, useRef, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SocketContext } from "@/Socket/socketContext";
import { useSelector } from "react-redux";

export default function InCallChat({ roomId, setisChatOpen }) {
  const socket = useContext(SocketContext);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const messagesEndRef = useRef();
useEffect(() => {
  if (!socket) return;

  const handleHistory = (history) => {
    console.log("Received chat history:", history);
    setMessages(history);
  };
  socket.on("chat-history", handleHistory);
  return () => {
    socket.off("chat-history", handleHistory);
  };
}, [socket]);

  useEffect(() => {
    if (socket && user?.username && roomId) {
      socket.emit("join-room", {
        username: user.username,
        userId: user._id,
        roomId,
      });
      console.log("Joined room:", roomId);
    }
  }, [socket, user, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      console.log("Received from server:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat-message", handleMessage);

    return () => {
      socket.off("chat-message", handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      roomId,
      sender: user?.username,
      text: message,
      timestamp: new Date().toISOString(),
    };

    console.log("Sending message:", msgData);
    socket.emit("chat-message", msgData);
    setMessage("");
  };

  return (
    <div className="flex flex-col border-l bg-muted rounded-xl shadow-inner h-screen max-h-screen">
      <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-muted z-10">
        <div className="text-xl font-semibold">Chat</div>
        <button 
          className="text-2xl text-neutral-700 hover:text-neutral-900"
          onClick={() => setisChatOpen(false)}
        >
          ×
        </button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="flex flex-col gap-2 min-h-full">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg max-w-xs text-sm ${
                msg.sender === user?.username
                  ? "bg-orange-500 text-white self-end ml-auto"
                  : "bg-white text-black self-start"
              }`}
            >
              <p className="font-semibold">{msg.sender}</p>
              <p>{msg.text}</p>
              <p className="text-xs text-gray-300">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t sticky bottom-0 bg-muted">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}