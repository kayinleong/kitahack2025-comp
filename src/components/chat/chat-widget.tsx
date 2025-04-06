"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  MessageCircle,
  Loader2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/lib/domains/chat.domain";
import { chatFlow } from "@/lib/actions/chat.action";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullWindow, setIsFullWindow] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "system",
      timestamp: new Date(Date.now()),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    } else if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(messages.length > 0 ? "smooth" : "auto");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const scrollTimeout = setTimeout(() => {
        scrollToBottom();
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isFullWindow) setIsFullWindow(false);
  };

  const toggleFullWindow = () => {
    setIsFullWindow(!isFullWindow);
    setTimeout(() => scrollToBottom("auto"), 100);
  };

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      const newId = messages.length
        ? Math.max(...messages.map((m) => m.id)) + 1
        : 1;
      const newMessage: Message = {
        id: newId,
        text: message,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setIsLoading(true);
      setError(null);

      setTimeout(() => scrollToBottom(), 50);

      try {
        const serializedMessages = messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        }));

        const serializedNewMessage = {
          ...newMessage,
          timestamp: newMessage.timestamp.toISOString(),
        };

        const aiResponse = await chatFlow({
          existingMessages: serializedMessages,
          newMessage: serializedNewMessage,
        });

        const responseId = newId + 1;
        const systemResponse: Message = {
          id: responseId,
          text: aiResponse,
          sender: "system",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, systemResponse]);

        setTimeout(() => scrollToBottom(), 50);
      } catch (err) {
        console.error("Error in chat:", err);
        setError("Failed to get a response. Please try again.");

        const errorId = newId + 1;
        const errorMessage: Message = {
          id: errorId,
          text: "Sorry, I'm having trouble responding right now. Please try again later.",
          sender: "system",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`${
        isFullWindow
          ? "fixed inset-0 z-50"
          : "fixed bottom-0 right-0 z-50 md:bottom-6 md:right-6"
      }`}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-box"
            initial={{
              opacity: 0,
              scale: isFullWindow ? 0.95 : 0.8,
              y: isFullWindow ? 0 : 20,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: isFullWindow ? 0.95 : 0.8,
              y: isFullWindow ? 0 : 20,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex flex-col ${
              isFullWindow
                ? "w-full h-full rounded-none"
                : "w-full h-[85vh] sm:h-[70vh] md:h-96 md:w-80 rounded-t-lg md:rounded-lg"
            } bg-white shadow-lg border border-gray-200 overflow-hidden origin-bottom-right`}
          >
            <div className="flex justify-between items-center p-3 bg-blue-600 text-white">
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="font-medium flex items-center"
              >
                Chat Support
              </motion.h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullWindow}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                  aria-label={isFullWindow ? "Exit full window" : "Full window"}
                  title={isFullWindow ? "Exit full window" : "Full window"}
                >
                  {isFullWindow ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </button>
                <button
                  onClick={toggleChat}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <motion.div
              ref={messageContainerRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`flex-1 p-3 overflow-y-auto bg-gray-50 scroll-smooth ${
                isFullWindow ? "px-4 md:px-6 lg:px-8" : ""
              }`}
              onAnimationComplete={() => scrollToBottom("auto")}
            >
              <div className={`${isFullWindow ? "max-w-3xl mx-auto" : ""}`}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * Math.min(index % 3, 1) + 0.1,
                      duration: 0.2,
                    }}
                    className={`mb-3 ${
                      msg.sender === "user"
                        ? "flex flex-col items-end"
                        : "flex flex-col items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      } ${isFullWindow ? "md:max-w-[70%] lg:max-w-[60%]" : ""}`}
                    >
                      {msg.sender === "system" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            p: ({ ...props }) => (
                              <p
                                className={`m-0 ${
                                  msg.sender === "user"
                                    ? "text-white"
                                    : "text-gray-800"
                                }`}
                                {...props}
                              />
                            ),
                            a: ({ ...props }) => (
                              <a
                                className={`font-medium underline ${
                                  msg.sender === "user"
                                    ? "text-blue-100"
                                    : "text-blue-600"
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                              />
                            ),
                            ul: ({ ...props }) => (
                              <ul
                                className="list-disc pl-5 mt-1 mb-1"
                                {...props}
                              />
                            ),
                            ol: ({ ...props }) => (
                              <ol
                                className="list-decimal pl-5 mt-1 mb-1"
                                {...props}
                              />
                            ),
                            li: ({ ...props }) => (
                              <li className="mt-0.5" {...props} />
                            ),
                            code: ({
                              inline,
                              ...props
                            }: {
                              inline?: boolean;
                            } & React.HTMLAttributes<HTMLElement>) =>
                              inline ? (
                                <code
                                  className={`px-1 py-0.5 rounded ${
                                    msg.sender === "user"
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-300 text-gray-900"
                                  }`}
                                  {...props}
                                />
                              ) : (
                                <code
                                  className={`block p-2 mt-1 mb-1 overflow-x-auto rounded ${
                                    msg.sender === "user"
                                      ? "bg-blue-700 text-white"
                                      : "bg-gray-300 text-gray-900"
                                  }`}
                                  {...props}
                                />
                              ),
                            pre: ({ ...props }) => (
                              <pre
                                className="p-0 mt-1 mb-1 overflow-auto rounded bg-transparent"
                                {...props}
                              />
                            ),
                            h1: ({ ...props }) => (
                              <h1
                                className="text-lg font-semibold mt-1 mb-1"
                                {...props}
                              />
                            ),
                            h2: ({ ...props }) => (
                              <h2
                                className="text-base font-semibold mt-1 mb-1"
                                {...props}
                              />
                            ),
                            h3: ({ ...props }) => (
                              <h3
                                className="text-sm font-semibold mt-1 mb-1"
                                {...props}
                              />
                            ),
                            table: ({ ...props }) => (
                              <div className="overflow-x-auto my-2">
                                <table
                                  className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 table-bordered"
                                  {...props}
                                />
                              </div>
                            ),
                            thead: ({ ...props }) => (
                              <thead
                                className="bg-gray-100 dark:bg-gray-800"
                                {...props}
                              />
                            ),
                            tbody: ({ ...props }) => <tbody {...props} />,
                            tr: ({ ...props }) => (
                              <tr
                                className="border-b border-gray-300 dark:border-gray-700"
                                {...props}
                              />
                            ),
                            th: ({ ...props }) => (
                              <th
                                className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider border-r border-gray-300 dark:border-gray-700 last:border-r-0"
                                {...props}
                              />
                            ),
                            td: ({ ...props }) => (
                              <td
                                className="px-3 py-2 text-sm border-r border-gray-300 dark:border-gray-700 last:border-r-0"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  </motion.div>
                ))}

                {error && (
                  <div className="text-center my-2">
                    <p className="text-red-500 text-xs">{error}</p>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-0.5 w-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              className="p-3 border-t border-gray-200 bg-white"
            >
              <div
                className={`flex items-center ${
                  isFullWindow ? "max-w-3xl mx-auto" : ""
                }`}
              >
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  rows={isFullWindow ? 2 : 1}
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 resize-none"
                  aria-label="Message input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  className="p-2 h-full bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            onClick={toggleChat}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-12 h-12 md:w-14 md:h-14 m-4 md:m-0 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700"
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
