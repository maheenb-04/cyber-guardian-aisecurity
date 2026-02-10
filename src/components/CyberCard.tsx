import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CyberCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "accent" | "destructive";
}

const CyberCard = ({ title, subtitle, icon, children, className = "", glowColor }: CyberCardProps) => {
  const glowClass = glowColor === "primary" ? "glow-primary" : glowColor === "accent" ? "glow-accent" : glowColor === "destructive" ? "glow-destructive" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-card border border-border rounded-xl p-6 relative overflow-hidden ${glowClass} ${className}`}
    >
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
};

export default CyberCard;
