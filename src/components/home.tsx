import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight, Shield, Zap, BarChart3, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TradeSync
            </span>
          </div>
          <Button onClick={() => navigate("/dashboard")} size="sm" className="shadow-md hover:shadow-lg transition-shadow">
            <span className="hidden sm:inline">Go to Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-in fade-in duration-700">
          <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-4">
            Automated Trading Made Simple
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Connect TradingView to
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}MetaTrader 5
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
            Execute trades automatically with webhook signals, manage multiple take profits, 
            and monitor your performance in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 px-4">
            <Button size="lg" onClick={() => navigate("/dashboard")} className="text-base sm:text-lg px-6 sm:px-8 shadow-lg hover:shadow-xl transition-all">
              Get Started
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/settings")} className="text-base sm:text-lg px-6 sm:px-8 shadow-md hover:shadow-lg transition-all">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 shadow-md">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Instant Execution</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Receive TradingView alerts and execute trades on MT5 in milliseconds with webhook integration
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 shadow-md">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Secure & Reliable</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                API key authentication ensures only authorized signals are processed and executed
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 shadow-md">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Performance Tracking</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Monitor active trades, track P&L, and analyze your trading performance with detailed metrics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features List */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-white to-blue-50 border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Everything You Need</CardTitle>
            <CardDescription className="text-sm sm:text-base">Comprehensive trading automation features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                "Multiple take profit levels",
                "Trailing stop loss support",
                "Risk-based position sizing",
                "Real-time trade monitoring",
                "Webhook signal validation",
                "Performance analytics",
                "Trade history tracking",
                "MT5 Expert Advisor integration"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-12 sm:mt-16 lg:mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-slate-600">
          <p className="text-xs sm:text-sm">© 2024 TradeSync. Automated trading platform for TradingView & MetaTrader 5.</p>
        </div>
      </footer>
    </div>
  );
}