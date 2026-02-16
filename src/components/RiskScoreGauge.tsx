import { motion } from "framer-motion";

interface RiskScoreGaugeProps {
  score: number; // 0-100
}

const RiskScoreGauge = ({ score }: RiskScoreGaugeProps) => {
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score <= 30) return { color: "hsl(145, 70%, 45%)", label: "Low Risk", textClass: "text-safe" };
    if (score <= 60) return { color: "hsl(40, 95%, 55%)", label: "Medium Risk", textClass: "text-warning" };
    return { color: "hsl(0, 80%, 55%)", label: "High Risk", textClass: "text-destructive" };
  };

  const { color, label, textClass } = getColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-52">
        <svg className="w-52 h-52 -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(210, 15%, 90%)" strokeWidth="12" />
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-5xl font-bold font-mono ${textClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground mt-1 font-mono">/ 100</span>
        </div>
      </div>
      <motion.p
        className={`text-sm font-semibold mt-3 ${textClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {label}
      </motion.p>
    </div>
  );
};

export default RiskScoreGauge;
