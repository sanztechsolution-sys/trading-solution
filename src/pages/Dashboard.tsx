import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import ActiveTradesTable from "@/components/dashboard/ActiveTradesTable";
import RecentSignals from "@/components/dashboard/RecentSignals";
import RiskCalculator from "@/components/dashboard/RiskCalculator";
import ConnectionStatus from "@/components/dashboard/ConnectionStatus";
import { Button } from "@/components/ui/button";
import { History, Settings } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Monitor your automated trading performance</p>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionStatus />
            <Button variant="outline" size="sm" onClick={() => navigate("/history")} className="flex-1 sm:flex-none">
              <History className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">History</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/settings")} className="flex-1 sm:flex-none">
              <Settings className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics />

        {/* Risk Calculator */}
        <RiskCalculator />

        {/* Active Trades & Recent Signals */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <ActiveTradesTable />
          <RecentSignals />
        </div>
      </div>
    </DashboardLayout>
  );
}