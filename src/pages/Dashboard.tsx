import { Shield, Mail, KeyRound, Link2, Wifi, AlertTriangle } from "lucide-react";
import CyberCard from "@/components/CyberCard";
import RiskScoreGauge from "@/components/RiskScoreGauge";
import ThreatIndicator from "@/components/ThreatIndicator";
import { motion } from "framer-motion";
import { useSecurity } from "@/contexts/SecurityContext";

const Dashboard = () => {
  const { riskScore, scanEvents } = useSecurity();

  const phishingScans = scanEvents.filter((e) => e.type === "phishing");
  const passwordScans = scanEvents.filter((e) => e.type === "password");
  const linkScans = scanEvents.filter((e) => e.type === "link" || e.type === "text");

  const lastPhishing = phishingScans.at(-1);
  const lastPassword = passwordScans.at(-1);
  const lastLink = linkScans.at(-1);

  const getStatus = (score: number | undefined): "safe" | "warning" | "danger" =>
    score === undefined ? "safe" : score <= 25 ? "safe" : score <= 55 ? "warning" : "danger";

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
          subtitle={scanEvents.length ? `Based on ${scanEvents.length} scan(s)` : "Run scans to generate your score"}
          icon={<Shield className="w-5 h-5" />}
          glowColor="primary"
        >
          <div className="flex justify-center py-4">
            <RiskScoreGauge score={riskScore} />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2 font-mono">
            {scanEvents.length === 0 ? "No scans performed yet" : `Last scanned: ${scanEvents.at(-1)!.timestamp.toLocaleString()}`}
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
            <ThreatIndicator icon={Mail} label="Phishing Scans" value={`${phishingScans.length} run`} status={getStatus(lastPhishing?.score)} index={0} />
            <ThreatIndicator icon={KeyRound} label="Password Checks" value={lastPassword ? `Score: ${100 - lastPassword.score}%` : "Not checked"} status={lastPassword ? getStatus(lastPassword.score) : "safe"} index={1} />
            <ThreatIndicator icon={Link2} label="Link/Text Scans" value={`${linkScans.length} run`} status={getStatus(lastLink?.score)} index={2} />
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
          {scanEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No scans performed yet. Use the tools in the sidebar to start analyzing threats.</p>
          ) : (
            [...scanEvents].reverse().slice(0, 10).map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 border border-border"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    event.score <= 25 ? "bg-safe" : event.score <= 55 ? "bg-warning" : "bg-destructive"
                  }`}
                />
                <span className="text-xs text-muted-foreground font-mono w-28 flex-shrink-0">{event.timestamp.toLocaleTimeString()}</span>
                <span className="text-sm text-foreground">
                  {event.type === "phishing" && `Phishing scan — risk: ${event.score}%`}
                  {event.type === "password" && `Password check — weakness: ${event.score}%`}
                  {event.type === "link" && `Link scan — threat: ${event.score}%`}
                  {event.type === "text" && `Text scan — threat: ${event.score}%`}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </CyberCard>
    </div>
  );
};

export default Dashboard;
