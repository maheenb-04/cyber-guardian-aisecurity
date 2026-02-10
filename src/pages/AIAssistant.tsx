import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Shield, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import CyberCard from "@/components/CyberCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cyber-chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Message[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed (${resp.status})`);
  }

  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hello! I'm your **CyberGuard AI Assistant** — powered by real AI.\n\nI can analyze suspicious emails, links, or messages and assign a **cyber risk score** with a detailed explanation.\n\nPaste any suspicious content, or ask me anything about cybersecurity!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg].filter(m => m.role === "user" || m.role === "assistant");

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && assistantSoFar.startsWith(chunk.length > 0 ? assistantSoFar.slice(0, -chunk.length) || chunk : chunk)) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        if (last?.role === "assistant" && assistantSoFar.length > chunk.length) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant" as const, content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to get response",
        variant: "destructive",
      });
    }
  };

  const suggestions = [
    "Analyze this email: 'Dear Customer, verify your account immediately or it will be suspended. Click here: bit.ly/xyz123'",
    "What is phishing and how do I avoid it?",
    "How do I create a strong password?",
    "Is this link safe: http://paypa1-secure.tk/login",
  ];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Security Assistant</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered cyber defense — paste suspicious content for instant risk analysis</p>
      </div>

      <CyberCard title="CyberGuard Chat" subtitle="AI-powered security advisor" icon={<MessageSquare className="w-5 h-5" />} className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-0 max-h-[calc(100vh-22rem)]">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant" ? "bg-primary/10 border border-primary/30" : "bg-secondary border border-border"
              }`}>
                {msg.role === "assistant" ? <Shield className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-foreground" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-xl text-sm ${
                msg.role === "assistant"
                  ? "bg-secondary/50 border border-border text-foreground"
                  : "bg-primary/10 border border-primary/20 text-foreground"
              }`}>
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Analyzing...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors text-left"
              >
                {s.length > 60 ? s.slice(0, 57) + "..." : s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Paste suspicious content or ask a security question..."
            className="bg-secondary border-border text-sm"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CyberCard>
    </div>
  );
};

export default AIAssistant;
