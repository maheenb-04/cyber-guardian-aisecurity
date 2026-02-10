import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Shield, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import CyberCard from "@/components/CyberCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickResponses: Record<string, string> = {
  "what is phishing": "**Phishing** is a cyberattack where criminals impersonate legitimate organizations through emails, texts, or websites to trick you into revealing sensitive information like passwords, credit card numbers, or social security numbers.\n\n### How to protect yourself:\n- **Verify sender addresses** carefully — look for subtle misspellings\n- **Don't click suspicious links** — hover to preview the URL first\n- **Enable 2FA** on all important accounts\n- **Never share passwords** via email or messages\n- Use our **Phishing Detector** tool to scan suspicious messages!",
  "how to create a strong password": "### Creating a Strong Password\n\nA strong password should be:\n\n1. **At least 12-16 characters long**\n2. **Mix of character types**: uppercase, lowercase, numbers, symbols\n3. **Not based on personal info** (birthdays, pet names, etc.)\n4. **Unique for each account**\n\n### Best Practices:\n- Use a **passphrase**: `Correct-Horse-Battery-Staple!42`\n- Use a **password manager** like 1Password or Bitwarden\n- Enable **two-factor authentication** everywhere\n- **Never reuse** passwords across sites\n\nTry our **Password Checker** to test your password strength!",
  "what is malware": "**Malware** (malicious software) is any program designed to harm your device or steal data.\n\n### Common Types:\n| Type | What it does |\n|------|-------------|\n| **Virus** | Attaches to files and spreads |\n| **Ransomware** | Encrypts files, demands payment |\n| **Trojan** | Disguises as legitimate software |\n| **Spyware** | Secretly monitors your activity |\n| **Worm** | Self-replicates across networks |\n\n### Protection Tips:\n- Keep your OS and software **updated**\n- Use reputable **antivirus** software\n- **Don't download** from untrusted sources\n- **Scan attachments** before opening",
  "what is a vpn": "A **VPN (Virtual Private Network)** creates an encrypted tunnel between your device and the internet.\n\n### Benefits:\n- 🔒 **Encrypts your traffic** — protects on public Wi-Fi\n- 🌍 **Hides your IP address** — adds anonymity\n- 🛡️ **Bypasses restrictions** — access content securely\n\n### When to use a VPN:\n- On **public Wi-Fi** (cafes, airports)\n- When accessing **sensitive accounts**\n- For **remote work** connections\n\n### Choosing a VPN:\n- Look for **no-log policies**\n- Choose providers with **strong encryption** (AES-256)\n- Avoid free VPNs — they may sell your data",
};

const getResponse = (input: string): string => {
  const lower = input.toLowerCase().trim();
  
  for (const [key, response] of Object.entries(quickResponses)) {
    if (lower.includes(key) || key.includes(lower)) return response;
  }

  if (/password/i.test(lower)) return quickResponses["how to create a strong password"];
  if (/phish/i.test(lower)) return quickResponses["what is phishing"];
  if (/malware|virus|ransomware/i.test(lower)) return quickResponses["what is malware"];
  if (/vpn/i.test(lower)) return quickResponses["what is a vpn"];

  if (/two.?factor|2fa|mfa/i.test(lower)) {
    return "**Two-Factor Authentication (2FA)** adds an extra layer of security by requiring two forms of verification.\n\n### Types:\n- 📱 **Authenticator apps** (Google Authenticator, Authy) — Recommended!\n- 📧 **Email codes** — Better than nothing\n- 🔑 **Hardware keys** (YubiKey) — Most secure\n- 📲 **SMS codes** — Least secure (SIM-swapping risk)\n\n**Always enable 2FA** on email, banking, and social media accounts.";
  }

  if (/safe|secure|protect/i.test(lower)) {
    return "### General Cybersecurity Tips\n\n1. 🔐 Use **strong, unique passwords** for each account\n2. 🛡️ Enable **two-factor authentication**\n3. 🔄 Keep **software updated** regularly\n4. ⚠️ Be **cautious with links** and attachments\n5. 📡 Use a **VPN** on public networks\n6. 💾 **Back up data** regularly\n7. 🔍 Monitor your accounts for **unusual activity**\n\nUse our tools to check your security posture!";
  }

  return "I'm your CyberGuard AI assistant. I can help with questions about:\n\n- 🎣 **Phishing** — how to identify and avoid it\n- 🔐 **Passwords** — creating and managing strong ones\n- 🦠 **Malware** — types and protection\n- 🌐 **VPNs** — how they work and when to use them\n- 🔒 **2FA** — setting up two-factor authentication\n- 🛡️ **General security** — best practices\n\nAsk me anything about cybersecurity!";
};

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hello! I'm your **CyberGuard AI Assistant**. I can answer questions about cybersecurity, help you understand threats, and teach you how to stay safe online.\n\nTry asking me about **phishing**, **passwords**, **malware**, or **VPNs**!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const suggestions = ["What is phishing?", "How to create a strong password?", "What is malware?", "What is a VPN?"];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Security Assistant</h1>
        <p className="text-sm text-muted-foreground mt-1">Ask any cybersecurity question — get expert answers instantly</p>
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

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
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
                onClick={() => { setInput(s); }}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
              >
                {s}
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
            placeholder="Ask a security question..."
            className="bg-secondary border-border text-sm"
            disabled={isTyping}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping} size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CyberCard>
    </div>
  );
};

export default AIAssistant;
