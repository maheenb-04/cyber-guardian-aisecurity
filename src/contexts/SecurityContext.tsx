import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ScanEvent {
  type: "phishing" | "password" | "link" | "text";
  score: number; // 0-100 threat/weakness score
  timestamp: Date;
}

interface SecurityContextType {
  scanEvents: ScanEvent[];
  addScanEvent: (event: Omit<ScanEvent, "timestamp">) => void;
  riskScore: number;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const computeRiskScore = (events: ScanEvent[]): number => {
  if (events.length === 0) return 0;

  // Take last 20 events max
  const recent = events.slice(-20);

  // Weighted average: more recent events matter more
  let weightedSum = 0;
  let weightTotal = 0;
  recent.forEach((e, i) => {
    const weight = i + 1; // later = heavier
    weightedSum += e.score * weight;
    weightTotal += weight;
  });

  return Math.round(weightedSum / weightTotal);
};

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([]);

  const addScanEvent = useCallback((event: Omit<ScanEvent, "timestamp">) => {
    setScanEvents((prev) => [...prev, { ...event, timestamp: new Date() }]);
  }, []);

  const riskScore = computeRiskScore(scanEvents);

  return (
    <SecurityContext.Provider value={{ scanEvents, addScanEvent, riskScore }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const ctx = useContext(SecurityContext);
  if (!ctx) throw new Error("useSecurity must be used within SecurityProvider");
  return ctx;
};
