import { useState } from "react";
import { Shield, LayoutDashboard, Mail, KeyRound, Link2, MessageSquare, Menu, X } from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/phishing", icon: Mail, label: "Phishing Detector" },
  { to: "/password", icon: KeyRound, label: "Password Checker" },
  { to: "/scanner", icon: Link2, label: "Link & Text Scanner" },
  { to: "/assistant", icon: MessageSquare, label: "AI Assistant" },
];

const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
  <>
    <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground tracking-tight">CyberGuard</h1>
          <p className="text-xs text-muted-foreground font-mono">AI Security Suite</p>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors md:hidden">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

    <nav className="flex-1 p-4 space-y-1" onClick={onClose}>
      {NAV_ITEMS.map((item) => (
        <SidebarNavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
      ))}
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
  </>
);

const AppSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex-col z-50 hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-sidebar border-b border-sidebar-border flex items-center px-4 z-50 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors mr-3"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground tracking-tight">CyberGuard</span>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col z-[60] transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>
    </>
  );
};

export default AppSidebar;
