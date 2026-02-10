import { Shield, Mail, KeyRound, Link2, Wifi, AlertTriangle } from "lucide-react";
import CyberCard from "@/components/CyberCard";
import RiskScoreGauge from "@/components/RiskScoreGauge";
import ThreatIndicator from "@/components/ThreatIndicator";
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Security Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time overview of your cyber safety posture</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Score */}
        <CyberCard
          title="Cyber Risk Score"
          subtitle="Based on your activity analysis"
          icon={<Shield className="w-5 h-5" />}
          glowColor="primary"
        >
          <div className="flex justify-center py-4">
            <RiskScoreGauge score={35} />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2 font-mono">
            Last scanned: {new Date().toLocaleString()}
          </p>
        </CyberCard>

        {/* Threat Overview */}
        <CyberCard
          title="Threat Overview"
          subtitle="Current threat landscape"
          icon={<AlertTriangle className="w-5 h-5" />}
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            <ThreatIndicator icon={Mail} label="Phishing Attempts Blocked" value="12" status="warning" index={0} />
            <ThreatIndicator icon={KeyRound} label="Weak Passwords Detected" value="3" status="danger" index={1} />
            <ThreatIndicator icon={Link2} label="Suspicious Links Flagged" value="7" status="warning" index={2} />
            <ThreatIndicator icon={Wifi} label="Network Security" value="Secure" status="safe" index={3} />
            <ThreatIndicator icon={Shield} label="Firewall Status" value="Active" status="safe" index={4} />
          </div>
        </CyberCard>
      </div>

      {/* Recent Activity */}
      <CyberCard
        title="Recent Activity"
        subtitle="Latest security events detected"
        icon={<Shield className="w-5 h-5" />}
      >
        <div className="space-y-3">
          {[
            { time: "2 min ago", event: "Phishing email detected and quarantined", type: "warning" as const },
            { time: "15 min ago", event: "Suspicious link blocked: malware-site.xyz", type: "danger" as const },
            { time: "1 hour ago", event: "Password strength check completed", type: "safe" as const },
            { time: "3 hours ago", event: "Full system scan completed — no threats found", type: "safe" as const },
            { time: "6 hours ago", event: "Unusual login attempt from unknown IP blocked", type: "danger" as const },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 border border-border"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  item.type === "safe" ? "bg-safe" : item.type === "warning" ? "bg-warning" : "bg-destructive"
                }`}
              />
              <span className="text-xs text-muted-foreground font-mono w-20 flex-shrink-0">{item.time}</span>
              <span className="text-sm text-foreground">{item.event}</span>
            </motion.div>
          ))}
        </div>
      </CyberCard>
    </div>
  );
};

export default Dashboard;
