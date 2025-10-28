import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target, Award, Activity } from "lucide-react";

interface MetricsProps {
  totalPnL?: number;
  todayPnL?: number;
  winRate?: number;
  totalTrades?: number;
  activeTrades?: number;
  profitFactor?: number;
}

export default function PerformanceMetrics({
  totalPnL = 2450.75,
  todayPnL = 125.50,
  winRate = 68.5,
  totalTrades = 47,
  activeTrades = 3,
  profitFactor = 2.3,
}: MetricsProps) {
  const metrics = [
    {
      title: "Total P&L",
      value: `$${totalPnL.toFixed(2)}`,
      change: totalPnL >= 0 ? "positive" : "negative",
      icon: DollarSign,
      color: totalPnL >= 0 ? "green" : "red",
      bgColor: totalPnL >= 0 ? "from-green-50 to-emerald-100" : "from-red-50 to-rose-100",
      borderColor: totalPnL >= 0 ? "border-green-200" : "border-red-200",
    },
    {
      title: "Today's P&L",
      value: `$${todayPnL.toFixed(2)}`,
      change: todayPnL >= 0 ? "positive" : "negative",
      icon: todayPnL >= 0 ? TrendingUp : TrendingDown,
      color: todayPnL >= 0 ? "blue" : "amber",
      bgColor: todayPnL >= 0 ? "from-blue-50 to-cyan-100" : "from-amber-50 to-orange-100",
      borderColor: todayPnL >= 0 ? "border-blue-200" : "border-amber-200",
    },
    {
      title: "Win Rate",
      value: `${winRate.toFixed(1)}%`,
      change: "neutral",
      icon: Target,
      color: "purple",
      bgColor: "from-purple-50 to-violet-100",
      borderColor: "border-purple-200",
    },
    {
      title: "Total Trades",
      value: totalTrades.toString(),
      change: "neutral",
      icon: Activity,
      color: "indigo",
      bgColor: "from-indigo-50 to-blue-100",
      borderColor: "border-indigo-200",
    },
    {
      title: "Active Trades",
      value: activeTrades.toString(),
      change: "neutral",
      icon: Activity,
      color: "teal",
      bgColor: "from-teal-50 to-cyan-100",
      borderColor: "border-teal-200",
    },
    {
      title: "Profit Factor",
      value: profitFactor.toFixed(2),
      change: profitFactor >= 1.5 ? "positive" : "neutral",
      icon: Award,
      color: "emerald",
      bgColor: "from-emerald-50 to-green-100",
      borderColor: "border-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={index}
            className={`shadow-md bg-gradient-to-br ${metric.bgColor} border-2 ${metric.borderColor} hover:shadow-lg transition-shadow`}
          >
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className={`text-xs sm:text-sm font-medium text-${metric.color}-700`}>
                  {metric.title}
                </CardDescription>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${metric.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-xl sm:text-2xl font-bold text-${metric.color}-900`}>
                {metric.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}