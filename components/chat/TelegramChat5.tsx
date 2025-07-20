"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Image from "next/image";
import { FaArrowRight, FaCheckCircle, FaClock } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { User } from "@supabase/supabase-js";
//import { createClient } from "@supabase/supabase-js"; // <-- ADD THIS IMPORT

// Initialize Supabase client
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

interface BotReplyData {
  sessionId: string;
  message: string;
}

interface ChatMessage {
  text: string;
  from: "user" | "bot";
  timestamp?: Date;
  isQuote?: boolean;
}

interface TelegramChatProps {
  user: User | null; // Accept Supabase User object
}

// Add missing interfaces
interface City {
  id: string;
  name: string;
  localities: Locality[];
}

interface Locality {
  id: string;
  name: string;
}

interface LocationData {
  cities: City[];
  defaultCity: string;
  defaultLocality: string;
}

interface LocationState {
  selectedCity: string;
  selectedLocality: string;
  cities: City[];
  localities: Locality[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function TelegramChat({ user }: TelegramChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingInquiry, setPendingInquiry] = useState<string | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  //const [userEmail, setUserEmail] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [locationState, setLocationState] = useState<LocationState>({
    selectedCity: '',
    selectedLocality: '',
    cities: [],
    localities: []
  });

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch location data on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/locations`) // Fix: Add BACKEND_URL
      .then(res => res.json())
      .then((data: LocationData) => {
        setLocationState(prev => ({
          ...prev,
          cities: data.cities,
          selectedCity: data.defaultCity,
          selectedLocality: data.defaultLocality,
          localities: data.cities.find(c => c.id === data.defaultCity)?.localities || []
        }));
      })
      .catch(error => {
        console.error('Failed to fetch locations:', error);
      });
  }, []);

  // Handle city change
  const handleCityChange = (cityId: string) => {
    const city = locationState.cities.find(c => c.id === cityId);
    setLocationState(prev => ({
      ...prev,
      selectedCity: cityId,
      localities: city?.localities || [],
      selectedLocality: city?.localities[0]?.id || ''
    }));
  };

  // Add missing handleSendMessage function
  const handleSendMessage = (message: string) => {
    if (!isConnected || !message.trim()) return;

    // Add to UI immediately
    setMessages((prev) => [...prev, {
      text: message,
      from: "user",
      timestamp: new Date()
    }]);

    setIsTyping(true);
    setShowLocationDropdown(false);

    // Send to backend via socket
    if (socketRef.current) {
      socketRef.current.emit("web_message", {
        sessionId,
        text: message,
        //userEmail: user?.email,
      });
    }

  };

  // Setup socket connection and session
  useEffect(() => {
    const id = uuidv4();
    setSessionId(id);
    socketRef.current = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      timeout: 4000,
      forceNew: true
    });
    const socket = socketRef.current;
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
      // No need for join-session - backend doesn't use it
    });
    socket.on('connect_error', (error: Error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
    });
    socket.on('disconnect', (reason: string) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on("bot_response", (data: any) => {
      console.log('🤖 Bot reply received:', data);
      setIsTyping(false);
      // Backend sends { text: "message" }
      const messageText = data.text || data.message || '';
      if (!messageText) {
        console.error('❌ No message text received:', data);
        return;
      }
      // Check if bot is asking for location
      if (messageText.includes('Which city/location do you need these materials in?') ||
        messageText.includes('select your location')) {
        setShowLocationDropdown(true);
      }
      // Check if this is a vendor quote
      const isQuote = messageText.includes('**New Quote Received!**') ||
        messageText.includes('📊') ||
        messageText.includes('💰 **Rate**');
      // Clear pending inquiry when quote received
      if (isQuote) {
        setPendingInquiry(null);
      }
      // Set pending inquiry when inquiry is created
      if (messageText.includes('Your inquiry has been created')) {
        const inquiryMatch = messageText.match(/ID:\s*([^\n\s]+)/);
        if (inquiryMatch) {
          setPendingInquiry(inquiryMatch[1]);
        }
      }
      setMessages((prev) => [...prev, {
        text: messageText,
        from: "bot",
        timestamp: new Date(),
        isQuote
      }]);
    });
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("bot_response");
      socket.disconnect();
    };
  }, [user]);

  const handleStartChat = () => {
    setChatStarted(true);
    setMessages([{ text: "/start", from: "user", timestamp: new Date() }]);

    if (socketRef.current && isConnected) {
      setIsTyping(true);
      socketRef.current.emit("web_message", {
        sessionId,
        text: "/start",
        //userEmail: user?.email,
      });
    }
  };

  const handleSend = () => {
    if (!input.trim() || !isConnected) return;

    const userMessage = input.trim();
    setInput("");
    handleSendMessage(userMessage);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col mb-0 border rounded-lg shadow-lg bg-gray-800 shadow-cyan-400/10">
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
            {isTyping ? "Bot is typing..." :
              pendingInquiry ? `Waiting for quotes (${pendingInquiry})` :
                "by My Coco"}
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
            title={isConnected ? 'Connected' : 'Disconnected'}>
          </div>
          <span className="text-xs text-gray-200">
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Location dropdown component */}
      {showLocationDropdown && (
        <div className="p-4 border-t bg-cyan-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">City:</label>
              <select
                value={locationState.selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
              >
                {locationState.cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Locality:</label>
              <select
                value={locationState.selectedLocality}
                onChange={(e) => setLocationState(prev => ({ ...prev, selectedLocality: e.target.value }))}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:border-blue-500"
              >
                {locationState.localities.map(locality => (
                  <option key={locality.id} value={locality.id}>{locality.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              const location = `${locationState.selectedCity}:${locationState.selectedLocality}`;
              handleSendMessage(location);
            }}
            className="mt-3 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Confirm Location
          </button>
        </div>
      )}

      {/* Message Area */}
      <div ref={messagesEndRef} className="flex-grow p-2 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4 bg-gray-700 min-h-0" >
        {!chatStarted && (
          <div className="text-center py-4 sm:py-8 px-2">
            <div className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              Welcome to CemTemBot!
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              Click Start Chat to begin your inquiry/order.
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`} >
            <div
              className={`max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 rounded-2xl shadow-sm ${msg.from === "user"
                ? "bg-blue-600 text-white rounded-br-md"
                : msg.isQuote
                  ? "bg-green-600 text-white border-2 border-green-400 rounded-bl-md shadow-lg"
                  : "bg-gray-500 text-white border border-gray-200 rounded-bl-md"
                }`}
            >
              <small className={`flex items-center gap-1 mb-1 text-xs font-medium ${msg.from === "user" ? "text-blue-100" :
                msg.isQuote ? "text-green-100" : "text-gray-300"
                }`}>
                {msg.from === "user" ? "You" : "CemTemBot"}
                {msg.isQuote && <FaCheckCircle className="text-green-200" />}
                {pendingInquiry && msg.text.includes(pendingInquiry) && <FaClock className="text-yellow-200" />}
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
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}


      </div>

      {/* Pending Inquiry Status */}
      {pendingInquiry && (
        <div className="px-3 sm:px-4 py-2 bg-yellow-100 border-t border-yellow-200 text-yellow-800 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <FaClock className="animate-spin" />
            <span>Waiting for vendor quotes for inquiry: {pendingInquiry}</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      {chatStarted ? (
        <div className="p-3 sm:p-4 border-t border-cyan-600 bg-gray-700 rounded-b-lg">
          <div className="flex flex-col space-y-2 sm:space-y-3">

            {/* Numeric Keypad */}
            <div className="grid grid-cols-10 gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <button
                  key={number}
                  onClick={() => setInput((prev) => prev + number)}
                  className="w-full py-1 sm:py-2 bg-cyan-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all text-xs sm:text-sm"
                >
                  {number}
                </button>
              ))}
            </div>

            {/* Text-Area Keypad */}
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
        </div>
      ) : (
        <div className="p-3 sm:p-4 border-t border-cyan-600 bg-gray-700 rounded-b-lg">
          <button
            onClick={handleStartChat}
            disabled={!isConnected}
            className="w-full justify-center px-6 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center space-x-2 sm:space-x-3"
          >
            <FaArrowRight className="text-lg sm:text-xl" />
            <span className="text-center  text-sm sm:text-base">{isConnected ? "Start Chat with CemTemBot" : "Connecting..."}</span>
          </button>
        </div>
      )}
    </div>
  );
}