import { useChatHistory, useSendMessage } from "@/hooks/use-aqi-data";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AIAssistant() {
  const { data: messages } = useChatHistory();
  const sendMessage = useSendMessage();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage.mutate(input);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 max-w-4xl mx-auto">
      <div className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden border border-white/10">
        {/* Header */}
        <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">AQI Zero Intelligence</h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online - Neural Engine v2.4
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background" ref={scrollRef}>
          {messages?.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-primary/20 text-primary'
                }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className={`rounded-2xl p-4 max-w-[80%] text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-blue-500/10 text-white border border-blue-500/20'
                  : 'bg-slate-800 text-gray-200 border border-white/5'
                }`}>
                {msg.content}
                <div className="mt-2 text-[10px] opacity-40 font-mono">
                  {new Date(msg.timestamp!).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}

          {sendMessage.isPending && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-800 rounded-2xl p-4 border border-white/5">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-secondary/30">
          <form onSubmit={handleSend} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about air quality, drone status, or risk analysis..."
              className="bg-slate-950 border-white/10 focus-visible:ring-primary font-mono text-sm"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-primary text-black hover:bg-primary/90"
              disabled={sendMessage.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
