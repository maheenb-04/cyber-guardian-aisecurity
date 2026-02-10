import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ThreatIndicatorProps {
  icon: LucideIcon;
  label: string;
  value: string;
  status: "safe" | "warning" | "danger";
  index?: number;
}

const ThreatIndicator = ({ icon: Icon, label, value, status, index = 0 }: ThreatIndicatorProps) => {
  const statusStyles = {
    safe: "border-safe/30 bg-safe/5",
    warning: "border-warning/30 bg-warning/5",
    danger: "border-destructive/30 bg-destructive/5",
  };

  const dotStyles = {
    safe: "bg-safe",
    warning: "bg-warning",
    danger: "bg-destructive",
  };

  const textStyles = {
    safe: "text-safe",
    warning: "text-warning",
    danger: "text-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`flex items-center justify-between p-4 rounded-lg border ${statusStyles[status]}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${textStyles[status]}`} />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-mono font-semibold ${textStyles[status]}`}>{value}</span>
        <div className={`w-2 h-2 rounded-full ${dotStyles[status]} animate-pulse-glow`} />
      </div>
    </motion.div>
  );
};

export default ThreatIndicator;
