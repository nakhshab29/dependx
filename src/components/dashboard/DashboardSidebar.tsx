import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Network, 
  Users, 
  Box, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Network, label: "Dependency Graph", path: "/dashboard/graph" },
  { icon: Users, label: "People", path: "/dashboard/people" },
  { icon: Box, label: "Modules", path: "/dashboard/modules" },
  { icon: Bell, label: "Alerts", path: "/dashboard/alerts" },
  { icon: FlaskConical, label: "What-If Simulator", path: "/dashboard/simulator" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 bottom-0 z-50 bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">DX</span>
          </div>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-heading font-semibold text-sidebar-foreground"
            >
              DependX
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive && "text-sidebar-primary"
              )} />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-sidebar-foreground hover:text-sidebar-accent-foreground"
        >
          {isOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="ml-2 text-xs">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
