import { useState } from "react";
import { Link2, AlertTriangle, CheckCircle, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CyberCard from "@/components/CyberCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useSecurity } from "@/contexts/SecurityContext";

interface ScanResult {
  risk: "safe" | "suspicious" | "dangerous";
  score: number;
  findings: string[];
  explanation: string;
}

const analyzeLink = (url: string): ScanResult => {
  const lower = url.toLowerCase();
  const findings: string[] = [];
  let score = 0;

  if (!/^https:\/\//.test(lower)) { findings.push("Not using HTTPS encryption"); score += 20; }
  if (/bit\.ly|tinyurl|t\.co|goo\.gl/.test(lower)) { findings.push("Uses URL shortener — destination unknown"); score += 25; }
  if (/\.(ru|cn|tk|xyz|top|pw|cc)\//.test(lower)) { findings.push("Suspicious top-level domain"); score += 20; }
  if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(lower)) { findings.push("Uses raw IP address instead of domain"); score += 30; }
  if (/@/.test(lower)) { findings.push("Contains @ symbol — possible redirect trick"); score += 25; }
  if (lower.length > 100) { findings.push("Unusually long URL"); score += 10; }
  if (/login|signin|verify|update|secure|account/.test(lower)) { findings.push("Contains credential-harvesting keywords"); score += 15; }

  score = Math.min(score, 100);
  if (findings.length === 0) findings.push("No suspicious indicators found");

  const risk = score <= 15 ? "safe" : score <= 45 ? "suspicious" : "dangerous";
  const explanations = {
    safe: "This URL appears safe. No major red flags were detected.",
    suspicious: "This URL has some concerning features. Proceed with caution and verify the source.",
    dangerous: "⚠️ This URL shows multiple danger signs. Do NOT visit this link.",
  };

  return { risk, score, findings, explanation: explanations[risk] };
};

const analyzeText = (text: string): ScanResult => {
  const lower = text.toLowerCase();
  const findings: string[] = [];
  let score = 0;

  if (/send money|wire transfer|bitcoin|crypto wallet/i.test(lower)) { findings.push("References financial transactions"); score += 25; }
  if (/you('ve)? won|congratulations|prize|lottery/i.test(lower)) { findings.push("Too-good-to-be-true claims"); score += 20; }
  if (/urgent|immediately|within 24 hours|account suspended/i.test(lower)) { findings.push("Creates false urgency"); score += 20; }
  if (/personal information|social security|date of birth/i.test(lower)) { findings.push("Requests personal identifying information"); score += 25; }
  if (/click here|click below|download now/i.test(lower)) { findings.push("Suspicious call-to-action language"); score += 15; }
  if (/https?:\/\/[^\s]+/.test(lower)) { findings.push("Contains embedded links"); score += 10; }
  if (/threat|legal action|arrest|lawsuit/i.test(lower)) { findings.push("Uses intimidation tactics"); score += 20; }

  score = Math.min(score, 100);
  if (findings.length === 0) findings.push("No suspicious patterns detected");

  const risk = score <= 15 ? "safe" : score <= 45 ? "suspicious" : "dangerous";
  const explanations = {
    safe: "This text appears benign. No social engineering or scam indicators found.",
    suspicious: "This text contains some patterns commonly used in scams. Be cautious.",
    dangerous: "⚠️ This text contains multiple red flags for social engineering or scams.",
  };

  return { risk, score, findings, explanation: explanations[risk] };
};

const LinkScanner = () => {
  const [linkInput, setLinkInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const { addScanEvent } = useSecurity();

  const handleScanLink = () => {
    if (!linkInput.trim()) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const res = analyzeLink(linkInput);
      setResult(res);
      addScanEvent({ type: "link", score: res.score });
      setScanning(false);
    }, 1200);
  };

  const handleScanText = () => {
    if (!textInput.trim()) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const res = analyzeText(textInput);
      setResult(res);
      addScanEvent({ type: "text", score: res.score });
      setScanning(false);
    }, 1200);
  };

  const riskStyles = {
    safe: { border: "border-safe/30", bg: "bg-safe/5", text: "text-safe", bar: "bg-safe" },
    suspicious: { border: "border-warning/30", bg: "bg-warning/5", text: "text-warning", bar: "bg-warning" },
    dangerous: { border: "border-destructive/30", bg: "bg-destructive/5", text: "text-destructive", bar: "bg-destructive" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Link & Text Scanner</h1>
        <p className="text-sm text-muted-foreground mt-1">Analyze URLs and text for suspicious or malicious content</p>
      </div>

      <CyberCard title="Scan Content" subtitle="Check links or text for threats" icon={<Link2 className="w-5 h-5" />}>
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="link" className="flex-1">URL / Link</TabsTrigger>
            <TabsTrigger value="text" className="flex-1">Text / Message</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-4 space-y-3">
            <Input
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="https://example.com/suspicious-page"
              className="bg-secondary border-border font-mono text-sm"
            />
            <Button onClick={handleScanLink} disabled={!linkInput.trim() || scanning} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {scanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              {scanning ? "Scanning..." : "Scan URL"}
            </Button>
          </TabsContent>

          <TabsContent value="text" className="mt-4 space-y-3">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste text content to analyze..."
              className="min-h-[120px] bg-secondary border-border font-mono text-sm resize-none"
            />
            <Button onClick={handleScanText} disabled={!textInput.trim() || scanning} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {scanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              {scanning ? "Analyzing..." : "Analyze Text"}
            </Button>
          </TabsContent>
        </Tabs>
      </CyberCard>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <CyberCard
              title="Scan Results"
              subtitle={`Verdict: ${result.risk.toUpperCase()}`}
              icon={result.risk === "safe" ? <CheckCircle className="w-5 h-5 text-safe" /> : <AlertTriangle className="w-5 h-5 text-destructive" />}
              glowColor={result.risk === "dangerous" ? "destructive" : result.risk === "suspicious" ? "primary" : "accent"}
            >
              <div className={`p-4 rounded-lg border mb-4 ${riskStyles[result.risk].border} ${riskStyles[result.risk].bg}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Threat Score</span>
                  <span className={`text-2xl font-bold font-mono ${riskStyles[result.risk].text}`}>{result.score}/100</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <motion.div
                    className={`h-2 rounded-full ${riskStyles[result.risk].bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Findings</h4>
                <div className="space-y-2">
                  {result.findings.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {result.risk === "safe" ? <CheckCircle className="w-3 h-3 text-safe" /> : <AlertTriangle className="w-3 h-3 text-warning" />}
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

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

export default LinkScanner;
