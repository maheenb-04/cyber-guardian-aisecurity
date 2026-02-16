import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { SecurityProvider } from "@/contexts/SecurityContext";
import Dashboard from "./pages/Dashboard";
import PhishingDetector from "./pages/PhishingDetector";
import PasswordChecker from "./pages/PasswordChecker";
import LinkScanner from "./pages/LinkScanner";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SecurityProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/phishing" element={<PhishingDetector />} />
              <Route path="/password" element={<PasswordChecker />} />
              <Route path="/scanner" element={<LinkScanner />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </SecurityProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
