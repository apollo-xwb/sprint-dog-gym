/* ============================================================
   SPRINT — Chatbot Component
   Design: Floating widget with glassmorphism
   Features: LLM-powered responses, FAQ knowledge base
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGE = "Hi! I'm SPRINT's AI assistant. Ask me about our packages, the Kinetik Deficit Score, or how SPRINT can help your dog. How can I help?";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: INITIAL_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock LLM call - in production, this would call a tRPC procedure
  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate LLM response delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock responses based on keywords
      let assistantResponse = "";

      if (
        userMessage.toLowerCase().includes("price") ||
        userMessage.toLowerCase().includes("package") ||
        userMessage.toLowerCase().includes("cost")
      ) {
        assistantResponse =
          "SPRINT offers flexible packages: Single Session (R550), 5-Session (R2,500), 10-Session (R4,800), or Monthly Unlimited (R1,950/mo). We also offer a yearly subscription at R23,400 for a 10% savings. Would you like to know more about any package?";
      } else if (
        userMessage.toLowerCase().includes("deficit") ||
        userMessage.toLowerCase().includes("score")
      ) {
        assistantResponse =
          "The Kinetik Deficit Score measures the gap between your dog's energy requirement and their current daily output. Most high-drive dogs operate at a 60–80% deficit. Only 32% of dogs reach their required daily energy output. You can calculate your dog's score using our interactive quiz!";
      } else if (
        userMessage.toLowerCase().includes("book") ||
        userMessage.toLowerCase().includes("session") ||
        userMessage.toLowerCase().includes("schedule")
      ) {
        assistantResponse =
          "You can book SPRINT sessions directly through our website. We recommend 1–2 sessions per week for optimal results. Our Buddy System offers 15% off the second dog. Ready to book? Click 'Book Now' or scroll to our Packages section!";
      } else if (
        userMessage.toLowerCase().includes("dog") &&
        userMessage.toLowerCase().includes("size")
      ) {
        assistantResponse =
          "SPRINT works with all dog sizes! From small breeds to extra-large working dogs, we customize each session based on your dog's energy level and fitness. Our assessment quiz helps identify the perfect fit for your pup.";
      } else if (
        userMessage.toLowerCase().includes("behavior") ||
        userMessage.toLowerCase().includes("issue") ||
        userMessage.toLowerCase().includes("problem")
      ) {
        assistantResponse =
          "Many behavioral issues stem from unmet energy needs. Destructive chewing, excessive barking, aggression, and anxiety often improve dramatically after just 3 days of SPRINT sessions. Check out our Behavioral Issues section to learn more!";
      } else if (
        userMessage.toLowerCase().includes("safe") ||
        userMessage.toLowerCase().includes("injury") ||
        userMessage.toLowerCase().includes("health")
      ) {
        assistantResponse =
          "SPRINT is designed with safety as our top priority. All sessions are supervised by trained professionals. We monitor heart rate, form, and recovery. If your dog has any health concerns, please let us know during booking!";
      } else {
        assistantResponse =
          "Great question! I'm here to help. Feel free to ask about our packages, the Kinetik Deficit Score, booking sessions, behavioral improvements, or anything else about SPRINT. What would you like to know?";
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please try again or contact us directly at support@sprint.gym",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-cyan-400 text-zinc-950 shadow-lg hover:bg-cyan-300 flex items-center justify-center transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: "0 0 30px rgba(34,211,238,0.4)",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[600px] flex flex-col border border-cyan-400/30 bg-zinc-950 rounded-lg overflow-hidden"
            style={{
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 40px rgba(34,211,238,0.2)",
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-amber-500/5">
              <h3
                className="font-display text-lg text-cyan-400 tracking-tight"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                SPRINT Assistant
              </h3>
              <p className="text-zinc-500 text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Ask about packages, bookings, or your dog's energy needs
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-cyan-400/20 border border-cyan-400/30 text-cyan-100"
                        : "bg-zinc-800 border border-zinc-700 text-zinc-300"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Loader2 size={16} className="text-cyan-400 animate-spin" />
                    <span className="text-zinc-400 text-sm">Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-cyan-400/20 bg-zinc-900/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      sendMessage(input);
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded focus:outline-none focus:border-cyan-400/50 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="px-3 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  <Send size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
