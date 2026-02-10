import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const SidebarNavItem = ({ to, icon: Icon, label }: SidebarNavItemProps) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20 glow-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </RouterNavLink>
);

export default SidebarNavItem;
