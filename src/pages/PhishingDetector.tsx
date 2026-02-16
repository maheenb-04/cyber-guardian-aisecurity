import { useState } from "react";
import { Mail, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CyberCard from "@/components/CyberCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSecurity } from "@/contexts/SecurityContext";

interface AnalysisResult {
  risk: "low" | "medium" | "high";
  score: number;
  indicators: string[];
  explanation: string;
}

const analyzeForPhishing = (text: string): AnalysisResult => {
  const lower = text.toLowerCase();
  const indicators: string[] = [];
  let score = 0;

  const checks = [
    { pattern: /urgent|immediately|act now|expires soon/i, label: "Urgency language detected", weight: 15 },
    { pattern: /click here|click below|click this link/i, label: "Suspicious call-to-action", weight: 15 },
    { pattern: /verify your account|confirm your identity|update your payment/i, label: "Account verification request", weight: 20 },
    { pattern: /password|credit card|ssn|social security/i, label: "Requests sensitive information", weight: 25 },
    { pattern: /dear customer|dear user|dear account holder/i, label: "Generic greeting (no personal name)", weight: 10 },
    { pattern: /http:\/\/|bit\.ly|tinyurl|shortened link/i, label: "Suspicious or shortened URL", weight: 15 },
    { pattern: /won|winner|congratulations|prize|lottery/i, label: "Too-good-to-be-true offer", weight: 20 },
    { pattern: /wire transfer|western union|bitcoin|crypto/i, label: "Unusual payment method referenced", weight: 20 },
    { pattern: /from:.*@.*\.ru|\.cn|\.tk|\.xyz/i, label: "Suspicious sender domain", weight: 15 },
    { pattern: /spelling|grammer|[a-z]{2,}\s{2,}[a-z]/i, label: "Poor grammar or formatting", weight: 10 },
  ];

  checks.forEach(({ pattern, label, weight }) => {
    if (pattern.test(lower)) {
      indicators.push(label);
      score += weight;
    }
  });

  score = Math.min(score, 100);

  const risk = score <= 25 ? "low" : score <= 55 ? "medium" : "high";

  const explanations = {
    low: "This message appears relatively safe. No major phishing indicators were found, but always remain cautious with links and attachments from unknown senders.",
    medium: "This message shows some phishing characteristics. Be cautious — verify the sender's identity before clicking any links or providing information.",
    high: "⚠️ HIGH RISK: This message displays multiple phishing indicators. Do NOT click any links, provide personal info, or reply. Report this to your IT department.",
  };

  return { risk, score, indicators, explanation: explanations[risk] };
};

const PhishingDetector = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const { addScanEvent } = useSecurity();

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const res = analyzeForPhishing(input);
      setResult(res);
      addScanEvent({ type: "phishing", score: res.score });
      setAnalyzing(false);
    }, 1500);
  };

  const riskColors = {
    low: "text-safe border-safe/30 bg-safe/5",
    medium: "text-warning border-warning/30 bg-warning/5",
    high: "text-destructive border-destructive/30 bg-destructive/5",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Phishing Detector</h1>
        <p className="text-sm text-muted-foreground mt-1">Paste an email or message to analyze for phishing indicators</p>
      </div>

      <CyberCard title="Analyze Message" subtitle="AI-powered phishing detection" icon={<Mail className="w-5 h-5" />}>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the suspicious email or message here..."
          className="min-h-[180px] bg-secondary border-border font-mono text-sm resize-none"
        />
        <Button
          onClick={handleAnalyze}
          disabled={!input.trim() || analyzing}
          className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Analyze for Phishing
            </>
          )}
        </Button>
      </CyberCard>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <CyberCard
              title="Analysis Results"
              subtitle={`Risk Level: ${result.risk.toUpperCase()}`}
              icon={result.risk === "low" ? <CheckCircle className="w-5 h-5 text-safe" /> : <AlertTriangle className="w-5 h-5 text-destructive" />}
              glowColor={result.risk === "high" ? "destructive" : result.risk === "medium" ? "primary" : "accent"}
            >
              {/* Score */}
              <div className={`p-4 rounded-lg border mb-4 ${riskColors[result.risk]}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Phishing Risk Score</span>
                  <span className="text-2xl font-bold font-mono">{result.score}/100</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <motion.div
                    className={`h-2 rounded-full ${result.risk === "low" ? "bg-safe" : result.risk === "medium" ? "bg-warning" : "bg-destructive"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Indicators */}
              {result.indicators.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Detected Indicators</h4>
                  <div className="space-y-2">
                    {result.indicators.map((ind, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0" />
                        <span className="text-muted-foreground">{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                <p className="text-sm text-foreground">{result.explanation}</p>
              </div>
            </CyberCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhishingDetector;
