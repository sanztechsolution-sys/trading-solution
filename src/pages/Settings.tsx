import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  Settings as SettingsIcon, 
  Key, 
  Shield, 
  Bell, 
  Zap,
  Copy,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // API Settings
  const [apiKey, setApiKey] = useState("sk_live_abc123xyz456789");
  const [showApiKey, setShowApiKey] = useState(false);
  const [mt5Url, setMt5Url] = useState("http://localhost:3001/api/mt5/signals");
  
  // Risk Settings
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState("2");
  const [maxDailyLoss, setMaxDailyLoss] = useState("5");
  const [maxOpenTrades, setMaxOpenTrades] = useState("5");
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [errorAlerts, setErrorAlerts] = useState(true);
  const [dailyReport, setDailyReport] = useState(false);
  
  // Advanced Settings
  const [autoTrading, setAutoTrading] = useState(true);
  const [trailingStop, setTrailingStop] = useState(true);
  const [breakeven, setBreakeven] = useState(true);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };

  const handleRegenerateApiKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).substr(2, 20)}`;
    setApiKey(newKey);
    toast({
      title: "API Key regenerated",
      description: "Your new API key is ready. Update it in MT5 EA.",
      variant: "default",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Configure your trading automation preferences
            </p>
          </div>
          <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-blue-600 to-indigo-600">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* API Configuration */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg sm:text-xl">API Configuration</CardTitle>
            </div>
            <CardDescription>Manage your API keys and endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Keep your API key secure. Never share it publicly or commit it to version control.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    readOnly
                    className="pr-10 font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button variant="outline" size="icon" onClick={handleCopyApiKey}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Use this key in your MT5 Expert Advisor configuration
              </p>
            </div>

            <Button variant="destructive" onClick={handleRegenerateApiKey}>
              Regenerate API Key
            </Button>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="mt5Url">MT5 API Endpoint</Label>
              <Input
                id="mt5Url"
                type="url"
                value={mt5Url}
                onChange={(e) => setMt5Url(e.target.value)}
                placeholder="http://localhost:3001/api/mt5/signals"
              />
              <p className="text-xs text-slate-500">
                Backend API URL for MT5 Expert Advisor
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg sm:text-xl">Risk Management</CardTitle>
            </div>
            <CardDescription>Set your risk limits and trading rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxRisk">Max Risk Per Trade (%)</Label>
                <Input
                  id="maxRisk"
                  type="number"
                  value={maxRiskPerTrade}
                  onChange={(e) => setMaxRiskPerTrade(e.target.value)}
                  step="0.1"
                  min="0.1"
                  max="10"
                />
                <p className="text-xs text-slate-500">
                  Maximum percentage of account to risk per trade
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDailyLoss">Max Daily Loss (%)</Label>
                <Input
                  id="maxDailyLoss"
                  type="number"
                  value={maxDailyLoss}
                  onChange={(e) => setMaxDailyLoss(e.target.value)}
                  step="0.5"
                  min="1"
                  max="20"
                />
                <p className="text-xs text-slate-500">
                  Stop trading if daily loss exceeds this percentage
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTrades">Max Open Trades</Label>
                <Input
                  id="maxTrades"
                  type="number"
                  value={maxOpenTrades}
                  onChange={(e) => setMaxOpenTrades(e.target.value)}
                  min="1"
                  max="20"
                />
                <p className="text-xs text-slate-500">
                  Maximum number of concurrent open positions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg sm:text-xl">Notifications</CardTitle>
            </div>
            <CardDescription>Configure your alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-slate-500">
                  Receive email updates about your trades
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Trade Alerts</Label>
                <p className="text-xs text-slate-500">
                  Get notified when trades are opened or closed
                </p>
              </div>
              <Switch
                checked={tradeAlerts}
                onCheckedChange={setTradeAlerts}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Error Alerts</Label>
                <p className="text-xs text-slate-500">
                  Receive notifications about system errors
                </p>
              </div>
              <Switch
                checked={errorAlerts}
                onCheckedChange={setErrorAlerts}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Report</Label>
                <p className="text-xs text-slate-500">
                  Get a daily summary of your trading performance
                </p>
              </div>
              <Switch
                checked={dailyReport}
                onCheckedChange={setDailyReport}
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg sm:text-xl">Advanced Settings</CardTitle>
            </div>
            <CardDescription>Configure advanced trading features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Trading</Label>
                <p className="text-xs text-slate-500">
                  Automatically execute signals from TradingView
                </p>
              </div>
              <Switch
                checked={autoTrading}
                onCheckedChange={setAutoTrading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Trailing Stop</Label>
                <p className="text-xs text-slate-500">
                  Enable trailing stop loss for open positions
                </p>
              </div>
              <Switch
                checked={trailingStop}
                onCheckedChange={setTrailingStop}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Breakeven Protection</Label>
                <p className="text-xs text-slate-500">
                  Move stop loss to breakeven after profit threshold
                </p>
              </div>
              <Switch
                checked={breakeven}
                onCheckedChange={setBreakeven}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg sm:text-xl text-green-900">System Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-700 mb-1">API Status</p>
                <p className="text-sm font-semibold text-green-900">Connected</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-700 mb-1">MT5 Connection</p>
                <p className="text-sm font-semibold text-green-900">Active</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-700 mb-1">Webhooks</p>
                <p className="text-sm font-semibold text-green-900">3 Active</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-700 mb-1">Last Signal</p>
                <p className="text-sm font-semibold text-green-900">2 min ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}