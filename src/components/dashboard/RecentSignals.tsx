import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, TrendingUp, TrendingDown, CheckCircle2, XCircle, Clock } from "lucide-react";

interface Signal {
  id: string;
  symbol: string;
  action: "buy" | "sell" | "close";
  price: number;
  status: "pending" | "executed" | "failed";
  timestamp: string;
  webhook: string;
}

export default function RecentSignals() {
  const [signals] = useState<Signal[]>([
    {
      id: "1",
      symbol: "XAUUSD",
      action: "buy",
      price: 2050.50,
      status: "executed",
      timestamp: "2024-01-28 14:30:15",
      webhook: "Gold Scalping",
    },
    {
      id: "2",
      symbol: "EURUSD",
      action: "sell",
      price: 1.0850,
      status: "executed",
      timestamp: "2024-01-28 13:15:42",
      webhook: "EUR/USD Swing",
    },
    {
      id: "3",
      symbol: "GBPUSD",
      action: "buy",
      price: 1.2700,
      status: "executed",
      timestamp: "2024-01-28 12:00:33",
      webhook: "GBP Strategy",
    },
    {
      id: "4",
      symbol: "USDJPY",
      action: "close",
      price: 148.50,
      status: "executed",
      timestamp: "2024-01-28 11:45:20",
      webhook: "JPY Pairs",
    },
    {
      id: "5",
      symbol: "XAUUSD",
      action: "sell",
      price: 2048.00,
      status: "failed",
      timestamp: "2024-01-28 10:30:10",
      webhook: "Gold Scalping",
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "executed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "buy":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "sell":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-lg sm:text-xl">Recent Signals</CardTitle>
        </div>
        <CardDescription>Latest TradingView alerts received</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
                    {getActionIcon(signal.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{signal.symbol}</span>
                      <Badge
                        variant={
                          signal.action === "buy"
                            ? "default"
                            : signal.action === "sell"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {signal.action.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-mono">{signal.price.toFixed(5)}</span>
                      <span>•</span>
                      <span>{signal.webhook}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{signal.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(signal.status)}
                  <Badge
                    variant={
                      signal.status === "executed"
                        ? "default"
                        : signal.status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {signal.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}