import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Settings, 
  History, 
  Home,
  Zap,
  Menu,
  X,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Webhook } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/webhooks", icon: Webhook, label: "Webhooks" },
    { path: "/history", icon: History, label: "History" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TradeSync
                </span>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-900">{user?.email}</p>
                <p className="text-xs text-slate-500">API Key: {user?.apiKey?.slice(0, 12)}...</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:block fixed left-0 top-[65px] sm:top-[73px] h-[calc(100vh-65px)] sm:h-[calc(100vh-73px)] bg-white/80 backdrop-blur-md border-r transition-all duration-300 z-40 shadow-lg",
            sidebarOpen ? "w-64" : "w-20"
          )}
        >
          <nav className="p-3 sm:p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200",
                    isActive && "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md",
                    !isActive && "hover:bg-slate-100",
                    !sidebarOpen && "justify-center px-2"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className={cn("w-5 h-5", sidebarOpen && "mr-3")} />
                  {sidebarOpen && <span className="text-sm sm:text-base">{item.label}</span>}
                </Button>
              );
            })}
          </nav>

          {/* Collapse Button */}
          <div className="absolute bottom-4 left-0 right-0 px-3 sm:px-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full hover:bg-slate-100 transition-colors",
                !sidebarOpen && "justify-center px-2"
              )}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
              {sidebarOpen && <span className="ml-2 text-sm">Collapse</span>}
            </Button>
          </div>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 top-[65px] sm:top-[73px] bg-black/50 z-40 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <aside 
              className="w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out" 
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start transition-all",
                        isActive && "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md",
                        !isActive && "hover:bg-slate-100"
                      )}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 p-3 sm:p-4 lg:p-8 min-h-[calc(100vh-65px)] sm:min-h-[calc(100vh-73px)]",
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          )}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}