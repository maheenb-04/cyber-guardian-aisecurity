import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SecurityProvider } from "@/contexts/SecurityContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PhishingDetector from "./pages/PhishingDetector";
import PasswordChecker from "./pages/PasswordChecker";
import LinkScanner from "./pages/LinkScanner";
import AIAssistant from "./pages/AIAssistant";
import ThreatDictionary from "./pages/ThreatDictionary";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SecurityProvider>
          <Navbar />
          <main className="pt-14 min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/phishing" element={<PhishingDetector />} />
              <Route path="/password" element={<PasswordChecker />} />
              <Route path="/scanner" element={<LinkScanner />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/threats" element={<ThreatDictionary />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </SecurityProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
