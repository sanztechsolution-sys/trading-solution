import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  History, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon,
  Search,
  X
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Trade {
  id: string;
  ticket: string;
  symbol: string;
  action: "buy" | "sell";
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  sl: number;
  tp: number;
  pnl: number;
  openTime: string;
  closeTime: string;
  duration: string;
  webhook: string;
  status: "closed" | "cancelled";
}

export default function TradeHistory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSymbol, setFilterSymbol] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const [trades] = useState<Trade[]>([
    {
      id: "1",
      ticket: "123456789",
      symbol: "XAUUSD",
      action: "buy",
      entryPrice: 2050.50,
      exitPrice: 2055.00,
      lotSize: 0.10,
      sl: 2045.00,
      tp: 2055.00,
      pnl: 450.00,
      openTime: "2024-01-28 14:30:15",
      closeTime: "2024-01-28 15:45:20",
      duration: "1h 15m",
      webhook: "Gold Scalping",
      status: "closed",
    },
    {
      id: "2",
      ticket: "123456788",
      symbol: "EURUSD",
      action: "sell",
      entryPrice: 1.0850,
      exitPrice: 1.0830,
      lotSize: 0.50,
      sl: 1.0870,
      tp: 1.0830,
      pnl: 1000.00,
      openTime: "2024-01-28 13:15:42",
      closeTime: "2024-01-28 14:20:10",
      duration: "1h 4m",
      webhook: "EUR/USD Swing",
      status: "closed",
    },
    {
      id: "3",
      ticket: "123456787",
      symbol: "GBPUSD",
      action: "buy",
      entryPrice: 1.2700,
      exitPrice: 1.2680,
      lotSize: 0.30,
      sl: 1.2680,
      tp: 1.2750,
      pnl: -600.00,
      openTime: "2024-01-28 12:00:33",
      closeTime: "2024-01-28 12:45:15",
      duration: "44m",
      webhook: "GBP Strategy",
      status: "closed",
    },
    {
      id: "4",
      ticket: "123456786",
      symbol: "USDJPY",
      action: "sell",
      entryPrice: 148.50,
      exitPrice: 148.20,
      lotSize: 0.20,
      sl: 148.80,
      tp: 148.20,
      pnl: 600.00,
      openTime: "2024-01-28 11:45:20",
      closeTime: "2024-01-28 13:10:05",
      duration: "1h 24m",
      webhook: "JPY Pairs",
      status: "closed",
    },
    {
      id: "5",
      ticket: "123456785",
      symbol: "XAUUSD",
      action: "buy",
      entryPrice: 2048.00,
      exitPrice: 2045.00,
      lotSize: 0.15,
      sl: 2045.00,
      tp: 2060.00,
      pnl: -450.00,
      openTime: "2024-01-28 10:30:10",
      closeTime: "2024-01-28 11:15:30",
      duration: "45m",
      webhook: "Gold Scalping",
      status: "closed",
    },
  ]);

  // Calculate statistics
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.pnl > 0).length;
  const losingTrades = trades.filter(t => t.pnl < 0).length;
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const avgWin = winningTrades > 0 
    ? trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / winningTrades 
    : 0;
  const avgLoss = losingTrades > 0 
    ? Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / losingTrades)
    : 0;

  // Filter trades
  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.ticket.includes(searchTerm);
    const matchesSymbol = filterSymbol === "all" || trade.symbol === filterSymbol;
    const matchesAction = filterAction === "all" || trade.action === filterAction;
    const matchesStatus = filterStatus === "all" || trade.status === filterStatus;
    
    return matchesSearch && matchesSymbol && matchesAction && matchesStatus;
  });

  const handleExport = () => {
    // Export to CSV
    const csv = [
      ["Ticket", "Symbol", "Action", "Entry", "Exit", "Lot Size", "SL", "TP", "P&L", "Open Time", "Close Time", "Duration", "Webhook"],
      ...filteredTrades.map(t => [
        t.ticket, t.symbol, t.action, t.entryPrice, t.exitPrice, t.lotSize, 
        t.sl, t.tp, t.pnl, t.openTime, t.closeTime, t.duration, t.webhook
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trade-history-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterSymbol("all");
    setFilterAction("all");
    setFilterStatus("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Trade History</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              View and analyze your past trades
            </p>
          </div>
          <Button onClick={handleExport} className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDescription className="text-xs sm:text-sm text-blue-700">
                Total Trades
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl text-blue-900">
                {totalTrades}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDescription className="text-xs sm:text-sm text-green-700">
                Win Rate
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl text-green-900">
                {winRate.toFixed(1)}%
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className={cn(
            "bg-gradient-to-br border-2",
            totalPnL >= 0 
              ? "from-emerald-50 to-emerald-100 border-emerald-200" 
              : "from-red-50 to-red-100 border-red-200"
          )}>
            <CardHeader className="pb-2 sm:pb-3">
              <CardDescription className={cn(
                "text-xs sm:text-sm",
                totalPnL >= 0 ? "text-emerald-700" : "text-red-700"
              )}>
                Total P&L
              </CardDescription>
              <CardTitle className={cn(
                "text-2xl sm:text-3xl",
                totalPnL >= 0 ? "text-emerald-900" : "text-red-900"
              )}>
                ${totalPnL.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2 sm:pb-3">
              <CardDescription className="text-xs sm:text-sm text-purple-700">
                Avg Win/Loss
              </CardDescription>
              <CardTitle className="text-xl sm:text-2xl text-purple-900">
                ${avgWin.toFixed(0)}/${avgLoss.toFixed(0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg sm:text-xl">Filters</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search symbol or ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Symbol Filter */}
              <Select value={filterSymbol} onValueChange={setFilterSymbol}>
                <SelectTrigger>
                  <SelectValue placeholder="All Symbols" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Symbols</SelectItem>
                  <SelectItem value="XAUUSD">XAUUSD</SelectItem>
                  <SelectItem value="EURUSD">EURUSD</SelectItem>
                  <SelectItem value="GBPUSD">GBPUSD</SelectItem>
                  <SelectItem value="USDJPY">USDJPY</SelectItem>
                </SelectContent>
              </Select>

              {/* Action Filter */}
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Trade History Table */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg sm:text-xl">
                Trade History ({filteredTrades.length})
              </CardTitle>
            </div>
            <CardDescription>Complete history of all executed trades</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile View */}
            <div className="lg:hidden space-y-3">
              <ScrollArea className="h-[600px]">
                {filteredTrades.map((trade) => (
                  <div key={trade.id} className="border rounded-lg p-3 mb-3 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">{trade.symbol}</span>
                        <Badge variant={trade.action === "buy" ? "default" : "secondary"}>
                          {trade.action.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge
                        variant={trade.pnl >= 0 ? "default" : "destructive"}
                        className="font-semibold"
                      >
                        ${trade.pnl.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>Ticket: <span className="font-mono">{trade.ticket}</span></p>
                      <p>Entry: {trade.entryPrice.toFixed(5)} → Exit: {trade.exitPrice.toFixed(5)}</p>
                      <p>Lot: {trade.lotSize.toFixed(2)} | SL: {trade.sl.toFixed(5)} | TP: {trade.tp.toFixed(5)}</p>
                      <p>Duration: {trade.duration}</p>
                      <p>Webhook: {trade.webhook}</p>
                      <p className="text-slate-500">{trade.openTime} - {trade.closeTime}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block rounded-md border overflow-x-auto">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Exit</TableHead>
                      <TableHead>Lot</TableHead>
                      <TableHead>SL</TableHead>
                      <TableHead>TP</TableHead>
                      <TableHead>P&L</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Webhook</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrades.map((trade) => (
                      <TableRow key={trade.id} className="hover:bg-slate-50">
                        <TableCell className="font-mono text-xs">{trade.ticket}</TableCell>
                        <TableCell className="font-semibold">{trade.symbol}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {trade.action === "buy" ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <Badge variant={trade.action === "buy" ? "default" : "secondary"}>
                              {trade.action.toUpperCase()}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {trade.entryPrice.toFixed(5)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {trade.exitPrice.toFixed(5)}
                        </TableCell>
                        <TableCell>{trade.lotSize.toFixed(2)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {trade.sl.toFixed(5)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {trade.tp.toFixed(5)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={trade.pnl >= 0 ? "default" : "destructive"}
                            className="font-semibold"
                          >
                            ${trade.pnl.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{trade.duration}</TableCell>
                        <TableCell className="text-xs">{trade.webhook}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}