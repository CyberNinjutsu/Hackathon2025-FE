"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIInvestmentChatbotProps {
  className?: string;
}

export default function AIInvestmentChatbot({
  className = "",
}: AIInvestmentChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I am DAMS's AI Investment Advisor. I can help you analyze the crypto market, give personalized investment advice, and answer questions about digital assets. What would you like to learn?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasAIResponse, setHasAIResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);
    setIsStreaming(true);
    setHasAIResponse(false);

    // AI message will be created when first content arrives
    const aiMessageId = (Date.now() + 1).toString();
    let aiMessageCreated = false;

    try {
      const response = await fetch("/api/ai-investment-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          context: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              setIsLoading(false);
              setIsStreaming(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                throw new Error(parsed.error);
              }

              if (parsed.content) {
                accumulatedContent += parsed.content;

                // Create AI message on first content if not created yet
                if (!aiMessageCreated) {
                  const aiMessage: Message = {
                    id: aiMessageId,
                    content: accumulatedContent,
                    sender: "ai",
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, aiMessage]);
                  aiMessageCreated = true;
                  setHasAIResponse(true);
                } else {
                  // Update existing AI message with accumulated content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  );
                }
              }
            } catch (parseError) {
              console.error("Error parsing streaming data:", parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Create or update AI message with error content
      const errorContent =
        "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";

      if (!aiMessageCreated) {
        const errorMessage: Message = {
          id: aiMessageId,
          content: errorContent,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setHasAIResponse(true);
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: errorContent } : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chat Toggle Button - Always visible, completely separate */}
      <div className={`fixed bottom-6 right-8 z-50 ${className}`}>
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-300 group hover:from-teal-400 hover:to-cyan-400 hover:scale-110"
              >
                <div className="relative">
                  <MessageCircle className="h-6 w-6 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window - Completely separate fixed positioning */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`fixed bottom-14 right-4 w-96 h-[600px] bg-slate-900/95 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm ring-1 ring-teal-500/20 z-40 ${className}`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="h-6 w-6" />
                    </div>
                    <motion.div
                      className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      AI Investment Advisor
                    </h3>
                    <p className="text-sm text-white/90 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-cyan-300" />
                      Powered by Google Gemini AI
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 h-[440px] p-4 bg-slate-900 [&>div>div]:!pr-0">
              <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                  width: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                  background: #475569;
                  border-radius: 2px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                  background: #14b8a6;
                  border-radius: 2px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                  background: #0d9488;
                }
              `}</style>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white ml-4 shadow-lg shadow-teal-500/25"
                          : "bg-slate-800 text-slate-100 mr-4 border border-slate-700/50 shadow-lg shadow-slate-900/50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === "ai" && (
                          <Bot className="h-4 w-4 mt-0.5 text-teal-400 flex-shrink-0" />
                        )}
                        {message.sender === "user" && (
                          <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === "user"
                                ? "text-white/70"
                                : "text-slate-400"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isStreaming && !hasAIResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-800 text-slate-100 rounded-2xl px-4 py-3 mr-4 border border-slate-700">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-teal-400" />
                        <motion.div
                          className="flex gap-1"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <div className="w-2 h-2 bg-teal-400 rounded-full" />
                          <div className="w-2 h-2 bg-teal-400 rounded-full" />
                          <div className="w-2 h-2 bg-teal-400 rounded-full" />
                        </motion.div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-900/90 backdrop-blur-sm">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about financial analysis..."
                  className="flex-1 rounded-xl border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-400 focus:border-teal-400 focus:ring-teal-400/20"
                  disabled={isLoading || isStreaming}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading || isStreaming}
                  className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 px-4 text-white"
                >
                  {isLoading || isStreaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
