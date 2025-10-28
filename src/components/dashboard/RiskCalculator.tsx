// Risk calculator component

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, TrendingUp, AlertCircle } from "lucide-react";
import { calculatePositionSize, validateRiskParameters, calculateRiskRewardRatio } from "@/lib/risk-calculator";

export default function RiskCalculator() {
  const [accountBalance, setAccountBalance] = useState("10000");
  const [riskPercentage, setRiskPercentage] = useState("2");
  const [symbol, setSymbol] = useState("EURUSD");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    setResult(null);

    const params = {
      accountBalance: parseFloat(accountBalance),
      riskPercentage: parseFloat(riskPercentage),
      entryPrice: parseFloat(entryPrice),
      stopLoss: parseFloat(stopLoss),
      symbol,
    };

    // Validate
    const validation = validateRiskParameters(params);
    if (!validation.valid) {
      setError(validation.errors.join(", "));
      return;
    }

    // Calculate
    const calculation = calculatePositionSize(params);
    
    // Calculate R:R if TP provided
    let rrRatio = 0;
    if (takeProfit) {
      rrRatio = calculateRiskRewardRatio(
        parseFloat(entryPrice),
        parseFloat(stopLoss),
        parseFloat(takeProfit)
      );
    }

    setResult({ ...calculation, rrRatio });
  };

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-lg sm:text-xl">Position Size Calculator</CardTitle>
        </div>
        <CardDescription>Calculate optimal lot size based on risk</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="balance">Account Balance ($)</Label>
            <Input
              id="balance"
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              placeholder="10000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk">Risk Per Trade (%)</Label>
            <Input
              id="risk"
              type="number"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(e.target.value)}
              placeholder="2"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EURUSD">EUR/USD</SelectItem>
                <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                <SelectItem value="USDJPY">USD/JPY</SelectItem>
                <SelectItem value="XAUUSD">XAU/USD (Gold)</SelectItem>
                <SelectItem value="BTCUSD">BTC/USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry">Entry Price</Label>
            <Input
              id="entry"
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="1.0850"
              step="0.00001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sl">Stop Loss</Label>
            <Input
              id="sl"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="1.0800"
              step="0.00001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tp">Take Profit (Optional)</Label>
            <Input
              id="tp"
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="1.0950"
              step="0.00001"
            />
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Position Size
        </Button>

        {result && (
          <div className="mt-6 space-y-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Recommended Lot Size</span>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-900">{result.lotSize.toFixed(2)}</p>
              <p className="text-xs text-blue-700 mt-1">Standard Lots</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 border">
                <p className="text-xs text-slate-600">Risk Amount</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${result.riskAmount.toFixed(2)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border">
                <p className="text-xs text-slate-600">SL Distance</p>
                <p className="text-lg font-semibold text-slate-900">
                  {result.stopLossPoints.toFixed(1)} pts
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border">
                <p className="text-xs text-slate-600">Position Value</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${result.positionValue.toFixed(2)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border">
                <p className="text-xs text-slate-600">Required Margin</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${result.requiredMargin.toFixed(2)}
                </p>
              </div>

              {result.rrRatio > 0 && (
                <div className="col-span-2 bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-700">Risk:Reward Ratio</p>
                  <p className="text-lg font-semibold text-green-900">
                    1:{result.rrRatio.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
