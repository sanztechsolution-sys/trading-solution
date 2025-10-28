import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, X, ExternalLink } from "lucide-react";

interface Trade {
  id: string;
  symbol: string;
  action: "buy" | "sell";
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  pnl: number;
  openTime: string;
  status: string;
}

export default function ActiveTradesTable() {
  const [trades] = useState<Trade[]>([
    {
      id: "1",
      symbol: "XAUUSD",
      action: "buy",
      entryPrice: 2050.50,
      currentPrice: 2055.25,
      stopLoss: 2045.00,
      takeProfit: 2065.00,
      lotSize: 0.10,
      pnl: 47.50,
      openTime: "2024-01-28 14:30",
      status: "active",
    },
    {
      id: "2",
      symbol: "EURUSD",
      action: "sell",
      entryPrice: 1.0850,
      currentPrice: 1.0845,
      stopLoss: 1.0870,
      takeProfit: 1.0820,
      lotSize: 0.50,
      pnl: 25.00,
      openTime: "2024-01-28 13:15",
      status: "active",
    },
    {
      id: "3",
      symbol: "GBPUSD",
      action: "buy",
      entryPrice: 1.2700,
      currentPrice: 1.2695,
      stopLoss: 1.2680,
      takeProfit: 1.2730,
      lotSize: 0.30,
      pnl: -15.00,
      openTime: "2024-01-28 12:00",
      status: "active",
    },
  ]);

  const handleCloseTrade = (id: string) => {
    console.log("Closing trade:", id);
    // API call to close trade
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl">Active Trades</CardTitle>
            <CardDescription className="text-sm">Monitor your open positions</CardDescription>
          </div>
          <Badge variant="default" className="bg-blue-600">
            {trades.length} Open
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="lg:hidden space-y-3">
          {trades.map((trade) => (
            <div key={trade.id} className="border rounded-lg p-3 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">{trade.symbol}</span>
                  <Badge variant={trade.action === "buy" ? "default" : "secondary"}>
                    {trade.action.toUpperCase()}
                  </Badge>
                </div>
                <div className={`flex items-center gap-1 ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {trade.pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="font-semibold">${Math.abs(trade.pnl).toFixed(2)}</span>
                </div>
              </div>
              <div className="text-xs text-slate-600 space-y-1 mb-3">
                <div className="flex justify-between">
                  <span>Entry:</span>
                  <span className="font-mono">{trade.entryPrice.toFixed(5)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current:</span>
                  <span className="font-mono">{trade.currentPrice.toFixed(5)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SL:</span>
                  <span className="font-mono text-red-600">{trade.stopLoss.toFixed(5)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TP:</span>
                  <span className="font-mono text-green-600">{trade.takeProfit.toFixed(5)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lot:</span>
                  <span className="font-semibold">{trade.lotSize.toFixed(2)}</span>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCloseTrade(trade.id)}
                className="w-full"
              >
                <X className="w-4 h-4 mr-1" />
                Close Trade
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>SL</TableHead>
                <TableHead>TP</TableHead>
                <TableHead>Lot</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={trade.action === "buy" ? "default" : "secondary"}>
                      {trade.action.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{trade.entryPrice.toFixed(5)}</TableCell>
                  <TableCell className="font-mono text-sm">{trade.currentPrice.toFixed(5)}</TableCell>
                  <TableCell className="font-mono text-sm text-red-600">{trade.stopLoss.toFixed(5)}</TableCell>
                  <TableCell className="font-mono text-sm text-green-600">{trade.takeProfit.toFixed(5)}</TableCell>
                  <TableCell>{trade.lotSize.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 font-semibold ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {trade.pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      ${Math.abs(trade.pnl).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{trade.openTime}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCloseTrade(trade.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {trades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No active trades</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}