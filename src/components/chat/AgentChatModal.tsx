import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  RotateCcw,
  CreditCard,
  Clock,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import {
  sendChatMessageApi,
  type ChatHistoryItem,
  type GenerativeUIAction,
} from "../../services/api/ai-chat-ep";
import { useNavigate } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";
import { useAuthStore } from "../../store/auth-store";
import { tokenManager } from "../../lib/token-manager";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  generativeUI?: GenerativeUIAction | null;
  timestamp: Date;
}

const GUEST_PROMPTS = [
  "🎬 What movies are playing today?",
  "⭐ Top-rated movies in CineMate",
  "📍 Theaters in Kolkata / Mumbai",
  "💰 Check seat layouts & prices",
];

const AUTH_PROMPTS = [
  "🎬 What movies are playing today?",
  "🎟️ Show my recent bookings",
  "📍 Find showtimes near me",
  "⭐ Top trending releases",
];

export const AgentChatModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const token = tokenManager.getToken();
  const isUserLoggedIn = isAuthenticated || !!token;
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-greeting",
      role: "assistant",
      content:
        "Hello! I am your CineMate AI Assistant. You can explore movie synopses, showtimes, theaters, and seat pricing. Log in anytime to hold seats and view your bookings!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputMessage("");
    setIsLoading(true);

    // Prepare history for multi-turn context
    const historyPayload: ChatHistoryItem[] = messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const sessionId = isUserLoggedIn && user?.id
      ? `cinemate-user-${user.id}`
      : "cinemate-session";

    try {
      const data = await sendChatMessageApi(
        textToSend,
        historyPayload,
        sessionId,
      );

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        generativeUI: data.generative_ui,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `Sorry, I encountered an issue connecting to the AI brain: ${err?.message || "Please make sure ai-service is running on port 8000"}.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        role: "assistant",
        content:
          "Conversation reset! What movie or theater would you like to explore?",
        timestamp: new Date(),
      },
    ]);
  };

  const quickPrompts = isUserLoggedIn ? AUTH_PROMPTS : GUEST_PROMPTS;

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 px-4 py-3 bg-primary hover:bg-primary-dull text-white font-extrabold rounded-full shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-primary/40"
          title="Open CineMate AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          </div>
          <span className="text-sm font-black tracking-wide">Ask CineMate AI</span>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh] bg-[#101014]/95 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 font-sans">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  CineMate AI
                  {isUserLoggedIn ? (
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {user?.name ? user.name.split(" ")[0] : "Logged In"}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-white/10 text-gray-300 font-semibold px-2 py-0.5 rounded-full border border-white/10">
                      Guest Mode
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <span>Intelligent Ticketing Concierge</span>
                  {!isUserLoggedIn && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/login");
                      }}
                      className="text-primary hover:underline font-bold text-[10px] ml-1 inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <LogIn className="w-2.5 h-2.5" /> Log in
                    </button>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Auth Banner: Subtle prompt if user is guest */}
          {!isUserLoggedIn && (
            <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center justify-between text-[11px]">
              <span className="text-gray-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Browsing publicly. Log in to book tickets.</span>
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="px-2 py-0.5 bg-primary text-white font-bold rounded text-[10px] hover:bg-primary-dull transition cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-gray-200">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                    msg.role === "user"
                      ? "bg-primary text-white font-medium rounded-br-xs shadow-md shadow-primary/20"
                      : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-xs shadow-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <MarkdownRenderer
                      content={msg.content}
                      onNavigate={(url) => {
                        setIsOpen(false);
                        navigate(url);
                      }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}

                  {/* Generative UI: Booking Hold Card */}
                  {msg.generativeUI?.type === "BOOKING_HOLD" && (
                    <div className="mt-2.5 p-3 bg-primary/10 border border-primary/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-primary font-black">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Seats Reserved
                        </span>
                        <span className="text-[10px] bg-primary/20 px-2 py-0.5 rounded-full border border-primary/30">
                          10 Mins Hold
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300">
                        Your selected seats are locked in the cinema database.
                      </p>
                      {msg.generativeUI.data?.checkout_url && (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            navigate(msg.generativeUI?.data?.checkout_url);
                          }}
                          className="w-full mt-1 py-2 px-3 bg-primary hover:bg-primary-dull text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition text-xs cursor-pointer shadow-md shadow-primary/30"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Proceed to Checkout
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-white/15 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-gray-400 text-xs">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          {messages.length <= 3 && (
            <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto border-t border-white/5 scrollbar-none">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 text-[11px] bg-white/5 hover:bg-white/10 hover:border-primary/40 hover:text-primary border border-white/10 text-gray-300 px-2.5 py-1 rounded-full transition cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                isAuthenticated
                  ? "Ask about movies, book seats, check your tickets..."
                  : "Ask about movies, showtimes, seats & pricing..."
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-primary hover:bg-primary-dull disabled:opacity-40 text-white font-bold rounded-2xl transition cursor-pointer shadow-md shadow-primary/30"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AgentChatModal;
