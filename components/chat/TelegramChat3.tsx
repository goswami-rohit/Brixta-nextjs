"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

interface BotReplyData {
  sessionId: string;
  message: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function TelegramChat() {
  const [messages, setMessages] = useState<{ text: string; from: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const socketRef = useRef<any>(null);

  // Setup socket connection and session
  useEffect(() => {
    // Generate unique session ID for each web user
    const id = uuidv4();
    setSessionId(id);

    // Create socket connection
    socketRef.current = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    const socket = socketRef.current;

    // Connection event listeners
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
      socket.emit("join-session", id);
    });

    socket.on('connect_error', (error: any) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
    });

    socket.on('disconnect', (reason: any) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on("bot-reply", (data: BotReplyData) => {
      console.log('🤖 Bot reply received:', data);
      setIsTyping(false);
      setMessages((prev) => [...prev, { text: data.message, from: "bot" }]);
    });

    // Add typing indicator
    socket.on("bot-typing", () => {
      setIsTyping(true);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("bot-reply");
      socket.off("bot-typing");
      socket.disconnect();
    };
  }, []);

  const handleStartChat = () => {
    setChatStarted(true);
    setMessages([{ text: "/start", from: "user" }]);
    
    // Send /start message to backend
    if (socketRef.current && isConnected) {
      setIsTyping(true);
      socketRef.current.emit("message", {
        sessionId,
        message: "/start",
      });
    }
  };

  const handleSend = () => {
    if (!input.trim() || !isConnected) return;

    const userMessage = input.trim();

    // Add to UI immediately
    setMessages((prev) => [...prev, { text: userMessage, from: "user" }]);
    setInput("");
    setIsTyping(true);

    // Send to backend via socket
    socketRef.current.emit("message", {
      sessionId,
      message: userMessage,
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] md:h-[600px] sm:h-[400px] mb-10 sm:mb-8 flex flex-col border rounded-lg shadow-lg bg-gray-800 shadow-cyan-400/10">
      {/* Top Bar */}
      <div className="flex items-center p-3 sm:p-4 border-b border-gray-600 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
        <Image
          src="/CemTemBot.webp"
          alt="telegram bot"
          width={48}
          height={48}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 border-2 border-white/20"
        />
        <div className="flex-grow">
          <div className="font-bold text-lg sm:text-xl">CemTemBot</div>
          <div className="text-xs sm:text-sm text-gray-200 opacity-90">
            {isTyping ? "Bot is typing..." : "by My Coco"}
          </div>
        </div>
        {/* Connection Status */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} 
               title={isConnected ? 'Connected' : 'Disconnected'}>
          </div>
          <span className="text-xs text-gray-200">
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-grow p-2 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4 bg-gray-700 min-h-0">
        {!chatStarted && (
          <div className="text-center py-4 sm:py-8 px-2">
            <div className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              Welcome to CemTemBot! Get real-time pricing for Cement and TMT bars.
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              Click "Start Chat" to begin your inquiry.
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 rounded-2xl shadow-sm ${
                msg.from === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-gray-500 text-white border border-gray-200 rounded-bl-md"
              }`}
            >
              <small className={`block mb-1 text-xs font-medium ${
                msg.from === "user" ? "text-blue-100" : "text-gray-300"
              }`}>
                {msg.from === "user" ? "You" : "CemTemBot"}
              </small>
              <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{msg.text}</div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md p-2 sm:p-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {chatStarted ? (
        <div className="p-3 sm:p-4 border-t border-cyan-600 bg-gray-700">
          <div className="flex space-x-2 sm:space-x-3">
            <textarea
              className="flex-grow border border-gray-300 bg-white text-gray-900 rounded-xl p-2 sm:p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              disabled={!isConnected}
              style={{ minHeight: '40px', maxHeight: '100px' }}
            />
            <button
              onClick={handleSend}
              disabled={!isConnected || !input.trim()}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[50px] sm:min-w-[60px]"
            >
              <FaArrowRight className="text-sm sm:text-base" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 border-t border-cyan-600 bg-gray-700 rounded-b-lg">
          <div className="flex justify-center">
            <button
              onClick={handleStartChat}
              disabled={!isConnected}
              className="px-6 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center space-x-2 sm:space-x-3"
            >
              <FaArrowRight className="text-lg sm:text-xl" /> 
              <span className="text-sm sm:text-base">{isConnected ? "Start Chat with CemTemBot" : "Connecting..."}</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-blue-300 p-2 border-t bg-gray-700 rounded-b-lg">
          Session: {sessionId.substring(0, 8)}... | Connected: {isConnected ? '✅' : '❌'} | Backend: {BACKEND_URL}
        </div>
      )}
    </div>
  );
}