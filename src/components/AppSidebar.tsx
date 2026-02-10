import { Shield, LayoutDashboard, Mail, KeyRound, Link2, MessageSquare } from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";

const AppSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">CyberGuard</h1>
            <p className="text-xs text-muted-foreground font-mono">AI Security Suite</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <SidebarNavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <SidebarNavItem to="/phishing" icon={Mail} label="Phishing Detector" />
        <SidebarNavItem to="/password" icon={KeyRound} label="Password Checker" />
        <SidebarNavItem to="/scanner" icon={Link2} label="Link & Text Scanner" />
        <SidebarNavItem to="/assistant" icon={MessageSquare} label="AI Assistant" />
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-secondary rounded-lg p-3">
          <p className="text-xs text-muted-foreground font-mono">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse-glow" />
            <span className="text-xs text-safe font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
