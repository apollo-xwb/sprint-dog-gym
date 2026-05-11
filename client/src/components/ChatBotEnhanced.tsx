/* ============================================================
   SPRINT — Enhanced Chatbot with FAQ & Pricing Knowledge
   Design: Floating widget with LLM integration
   ============================================================ */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SPRINT_KNOWLEDGE = `
You are a helpful SPRINT customer support chatbot. SPRINT is a mobile dog gym service in Cape Town, South Africa.

KEY INFORMATION:
- Service: Mobile dog gym with supervised non-motorized slatted treadmill sessions
- Location: Cape Town, South Africa
- Tagline: "Stop the digging. Start the sprint."
- Philosophy: High-drive dogs are athletes who need proper energy outlets

PACKAGES & PRICING (ZAR):
1. Single Session: R550 - Perfect for trying SPRINT
2. 5-Session Bundle: R2,500 - Weekly sessions for a month
3. 10-Session Bundle: R4,800 - Bi-weekly sessions for 5 months
4. Monthly Unlimited: R1,950/month - All sessions for one month
   - Yearly option: R23,400/year (save 10%)

BUDDY SYSTEM:
- Get 15% off the second dog on all packages
- Perfect for multi-dog households

THE RILEY METHOD (3-Step Process):
1. The Quiz: Calculate your dog's Energy Deficit using our assessment tool
2. The Arrival: Our mobile unit arrives at your driveway
3. The Session: Supervised non-motorized slatted treadmill run

COMMON QUESTIONS:
Q: What dog sizes do you work with?
A: We work with all dog sizes - small, medium, large, and extra-large breeds.

Q: How long are sessions?
A: Sessions are customized based on your dog's energy level and fitness. Typically 20-45 minutes.

Q: Is it safe for my dog?
A: Yes! All sessions are supervised by trained professionals. We use non-motorized treadmills which are safer and more natural.

Q: Can I book multiple dogs?
A: Absolutely! We offer the Buddy System with 15% off for the second dog.

Q: What if my dog has behavioral issues?
A: Many behavioral issues stem from unmet energy needs. Our service helps fulfill those biological needs.

BEHAVIORAL ISSUES WE ADDRESS:
- Excessive digging and destructive behavior
- Aggression and reactivity
- Hyperactivity and inability to settle
- Anxiety and stress-related behaviors
- Jumping and excessive barking

ENERGY DEFICIT STAT:
- Only 23% of high-drive dogs reach their required daily energy output
- Unmet needs lead to behavioral problems, anxiety, and health issues

BOOKING PROCESS:
1. Take the Kinetik Deficit Quiz to assess your dog's needs
2. Select your dog and preferred package
3. Choose monthly or yearly billing (if subscription)
4. Proceed to secure checkout
5. Receive confirmation and session scheduling details

Be friendly, helpful, and knowledgeable. Always encourage users to take the quiz or book a session.
`;

export default function ChatBotEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! 👋 I'm SPRINT's AI assistant. Ask me about our packages, the booking process, or anything about dog fitness. How can I help?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the LLM through the backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userMessage: input,
          systemPrompt: SPRINT_KNOWLEDGE,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 p-4 bg-cyan-400 text-zinc-950 rounded-full shadow-lg hover:bg-cyan-300 transition-colors"
        style={{
          boxShadow: "0 0 30px rgba(34,211,238,0.4)",
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] h-[500px] flex flex-col rounded-lg overflow-hidden"
            style={{
              backdropFilter: "blur(12px)",
              background: "rgba(24, 24, 27, 0.95)",
              border: "1px solid rgba(34, 211, 238, 0.3)",
              boxShadow: "0 0 40px rgba(34,211,238,0.2)",
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-cyan-400/20 bg-zinc-900/50">
              <h3 className="font-display text-lg text-cyan-400" style={{ fontFamily: "'Barlow', sans-serif" }}>
                SPRINT Assistant
              </h3>
              <p className="text-zinc-400 text-xs">Ask about bookings, packages & more</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-cyan-400/20 text-cyan-100 border border-cyan-400/30"
                        : "bg-zinc-800 text-zinc-100 border border-zinc-700"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700">
                    <Loader2 size={16} className="text-cyan-400 animate-spin" />
                  </div>
                </div>
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
                      sendMessage();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
