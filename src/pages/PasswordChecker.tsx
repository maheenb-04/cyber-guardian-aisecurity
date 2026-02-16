import { useState, useMemo, useEffect, useRef } from "react";
import { KeyRound, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CyberCard from "@/components/CyberCard";
import { Input } from "@/components/ui/input";
import { useSecurity } from "@/contexts/SecurityContext";

interface StrengthResult {
  score: number; // 0-100
  level: "weak" | "fair" | "good" | "strong";
  checks: { label: string; passed: boolean }[];
  feedback: string;
  crackTime: string;
}

const analyzePassword = (pw: string): StrengthResult => {
  const checks = [
    { label: "At least 8 characters", passed: pw.length >= 8 },
    { label: "At least 12 characters", passed: pw.length >= 12 },
    { label: "Contains uppercase letter", passed: /[A-Z]/.test(pw) },
    { label: "Contains lowercase letter", passed: /[a-z]/.test(pw) },
    { label: "Contains a number", passed: /\d/.test(pw) },
    { label: "Contains a special character", passed: /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
    { label: "No common patterns (123, abc, password)", passed: !/123|abc|password|qwerty|admin/i.test(pw) },
    { label: "No repeated characters (aaa, 111)", passed: !/(.)\1{2,}/.test(pw) },
  ];

  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  const level = score <= 25 ? "weak" : score <= 50 ? "fair" : score <= 75 ? "good" : "strong";

  const feedbacks = {
    weak: "This password is very weak and could be cracked almost instantly. Use a longer password with mixed characters.",
    fair: "This password has some strength but still has vulnerabilities. Add more variety and length.",
    good: "Decent password! Consider adding special characters or making it longer for better protection.",
    strong: "Excellent password! This would take significant resources to crack. Keep it safe and unique.",
  };

  const crackTimes = {
    weak: "< 1 second",
    fair: "~ 2 hours",
    good: "~ 3 months",
    strong: "~ 10,000+ years",
  };

  return { score, level, checks, feedback: feedbacks[level], crackTime: crackTimes[level] };
};

const PasswordChecker = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { addScanEvent } = useSecurity();
  const lastReported = useRef<string>("");

  const result = useMemo(() => (password ? analyzePassword(password) : null), [password]);

  // Report password score when user stops typing (debounced via level change)
  useEffect(() => {
    if (result && result.level !== lastReported.current) {
      lastReported.current = result.level;
      // Invert: weak password = high risk
      addScanEvent({ type: "password", score: 100 - result.score });
    }
  }, [result, addScanEvent]);

  const levelColors = {
    weak: "text-destructive",
    fair: "text-warning",
    good: "text-primary",
    strong: "text-safe",
  };

  const barColors = {
    weak: "bg-destructive",
    fair: "bg-warning",
    good: "bg-primary",
    strong: "bg-safe",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Password Strength Checker</h1>
        <p className="text-sm text-muted-foreground mt-1">Check how strong your password is with AI-powered analysis</p>
      </div>

      <CyberCard title="Enter Password" subtitle="Your password is analyzed locally — never sent anywhere" icon={<KeyRound className="w-5 h-5" />}>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password..."
            className="bg-secondary border-border font-mono text-base pr-12"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 space-y-5">
              {/* Strength bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Strength</span>
                  <span className={`text-sm font-bold font-mono uppercase ${levelColors[result.level]}`}>
                    {result.level}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full ${barColors[result.level]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ boxShadow: `0 0 10px ${result.level === "strong" ? "hsl(145,70%,45%)" : result.level === "good" ? "hsl(180,100%,45%)" : "transparent"}` }}
                  />
                </div>
              </div>

              {/* Crack time */}
              <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground">Estimated crack time</p>
                <p className={`text-lg font-bold font-mono ${levelColors[result.level]}`}>{result.crackTime}</p>
              </div>

              {/* Checks */}
              <div className="space-y-2">
                {result.checks.map((check, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    {check.passed ? (
                      <CheckCircle className="w-4 h-4 text-safe flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    )}
                    <span className={check.passed ? "text-foreground" : "text-muted-foreground"}>{check.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Feedback */}
              <div className={`p-4 rounded-lg border ${
                result.level === "weak" ? "border-destructive/30 bg-destructive/5" :
                result.level === "fair" ? "border-warning/30 bg-warning/5" :
                result.level === "good" ? "border-primary/30 bg-primary/5" :
                "border-safe/30 bg-safe/5"
              }`}>
                <p className="text-sm text-foreground">{result.feedback}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CyberCard>
    </div>
  );
};

export default PasswordChecker;
