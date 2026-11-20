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
} from "lucide-react";
import {
  sendChatMessageApi,
  type ChatHistoryItem,
  type GenerativeUIAction,
} from "../../services/api/ai-chat-ep";
import { useNavigate } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  generativeUI?: GenerativeUIAction | null;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "🎬 What movies are playing today?",
  "⭐ Recommend top-rated movies",
  "📍 Which theaters are in my city?",
  "🎟️ How does booking work?",
];

export const AgentChatModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-greeting",
      role: "assistant",
      content:
        "Hello! I am your CineMate AI Assistant powered by Groq & LangGraph. How can I help you discover movies, pick showtimes, or book seats today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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

    try {
      const data = await sendChatMessageApi(
        textToSend,
        historyPayload,
        "cinemate-user-session",
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

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold rounded-full shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-amber-300"
          title="Open CineMate AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          </div>
          <span className="text-sm font-black tracking-wide">Ask CineMate AI</span>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh] bg-[#101014]/95 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold shadow-md shadow-amber-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  CineMate AI
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                    Groq Fast
                  </span>
                </h3>
                <p className="text-[11px] text-gray-400">Intelligent Ticketing Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

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
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                    msg.role === "user"
                      ? "bg-amber-500 text-black font-semibold rounded-br-xs shadow-md"
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
                    <div className="mt-2.5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Seats Reserved
                        </span>
                        <span className="text-[10px]">10 Mins Hold</span>
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
                          className="w-full mt-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg flex items-center justify-center gap-1.5 transition text-xs cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" /> Proceed to Checkout
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-gray-400 text-xs">
                <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar (when only greeting is shown or idle) */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto border-t border-white/5 scrollbar-none">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-2.5 py-1 rounded-full transition cursor-pointer"
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
            className="p-3 border-t border-white/10 bg-white/5 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about movies, showtimes, seats..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400 transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold rounded-2xl transition cursor-pointer shadow-md"
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
