import HeroSection from "@/components/HeroSection";
import ThreatGlossary from "@/components/ThreatGlossary";
import AboutSection from "@/components/AboutSection";
import LinkScanner from "@/pages/LinkScanner";
import { Info } from "lucide-react";

const Index = () => {
  return (
    <div>
      <HeroSection />

      {/* Disclaimer banner */}
      <div className="max-w-3xl mx-auto px-4 mb-6">
        <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-foreground">Advisory Notice: </span>
            CyberGuard is an AI-powered guidance platform intended for informational and educational purposes only. All analysis results, risk scores, and recommendations are advisory in nature and should not replace professional cybersecurity tools, software, or expert consultation. Use the information provided at your own discretion and judgment.
          </p>
        </div>
      </div>

      {/* Analyzer */}
      <div id="analyzer" className="max-w-3xl mx-auto px-4">
        <LinkScanner />
      </div>

      <ThreatGlossary />
      <AboutSection />
    </div>
  );
};

export default Index;
