import { ReactNode } from "react";
import AppSidebar from "@/components/AppSidebar";
import { Info } from "lucide-react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      {/* Desktop: offset by sidebar width. Mobile: offset by top header height */}
      <main className="md:ml-64 pt-14 md:pt-0 p-4 sm:p-6 md:p-8">
        {/* Disclaimer banner */}
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-foreground">Advisory Notice: </span>
            CyberGuard is an AI-powered guidance platform intended for informational and educational purposes only. All analysis results, risk scores, and recommendations are advisory in nature and should not replace professional cybersecurity tools, software, or expert consultation. Use the information provided at your own discretion and judgment.
          </p>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

