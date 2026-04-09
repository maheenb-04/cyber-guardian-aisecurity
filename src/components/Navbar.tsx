import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/scanner", label: "Analyzer" },
  { to: "/threats", label: "Threat Dictionary" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const scrollToAnalyzer = () => {
    if (location.pathname === "/") {
      document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/scanner";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* Left */}
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-semibold text-primary">Cyber Guard AI</span>
        </Link>

        {/* Center - desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:block">
          <Button onClick={scrollToAnalyzer} className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm">
            Analyze a Threat
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-muted-foreground hover:text-foreground">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-4 pb-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm ${
                location.pathname === link.to ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button onClick={() => { scrollToAnalyzer(); setOpen(false); }} className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm mt-2">
            Analyze a Threat
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
