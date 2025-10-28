//+------------------------------------------------------------------+
//|                                              TradeSync_EA.mq5    |
//|                        TradingView to MT5 Automation Platform    |
//|                                                                  |
//+------------------------------------------------------------------+
#property copyright "TradeSync"
#property link      "https://tradesync.com"
#property version   "1.00"
#property strict

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>
#include <Trade\OrderInfo.mqh>

//--- Input parameters
input string   API_URL = "http://localhost:3001/api/mt5/signals";  // Backend API URL
input string   API_KEY = "your_api_key_here";                      // Your API Key
input int      POLL_INTERVAL = 1000;                               // Polling interval (ms)
input int      MAGIC_NUMBER = 123456;                              // Magic number
input double   MAX_SLIPPAGE = 10;                                  // Max slippage in points
input bool     ENABLE_TRAILING = true;                             // Enable trailing stop
input bool     ENABLE_BREAKEVEN = true;                            // Enable breakeven
input int      LOG_LEVEL = 2;                                      // Log level (0=None, 1=Error, 2=Info, 3=Debug)

//--- Global variables
CTrade trade;
CPositionInfo positionInfo;
COrderInfo orderInfo;
datetime lastPollTime = 0;
int totalSignalsProcessed = 0;
int totalTradesOpened = 0;
int totalTradesClosed = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   //--- Set magic number
   trade.SetExpertMagicNumber(MAGIC_NUMBER);
   trade.SetDeviationInPoints((int)MAX_SLIPPAGE);
   trade.SetTypeFilling(ORDER_FILLING_FOK);
   
   //--- Check API configuration
   if(API_KEY == "your_api_key_here")
   {
      LogError("Please configure your API_KEY in EA settings");
      return(INIT_FAILED);
   }
   
   LogInfo("TradeSync EA initialized successfully");
   LogInfo("API URL: " + API_URL);
   LogInfo("Magic Number: " + IntegerToString(MAGIC_NUMBER));
   LogInfo("Polling Interval: " + IntegerToString(POLL_INTERVAL) + "ms");
   
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   LogInfo("TradeSync EA stopped");
   LogInfo("Total signals processed: " + IntegerToString(totalSignalsProcessed));
   LogInfo("Total trades opened: " + IntegerToString(totalTradesOpened));
   LogInfo("Total trades closed: " + IntegerToString(totalTradesClosed));
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   //--- Check if it's time to poll for new signals
   if(GetTickCount() - lastPollTime < POLL_INTERVAL)
      return;
   
   lastPollTime = GetTickCount();
   
   //--- Poll for new signals
   PollForSignals();
   
   //--- Update existing positions
   UpdatePositions();
}

//+------------------------------------------------------------------+
//| Poll backend API for new signals                                 |
//+------------------------------------------------------------------+
void PollForSignals()
{
   string url = API_URL + "?apiKey=" + API_KEY;
   string headers = "Content-Type: application/json\r\n";
   headers += "X-API-Key: " + API_KEY + "\r\n";
   
   char post[];
   char result[];
   string resultHeaders;
   
   //--- Send HTTP GET request
   int timeout = 5000;
   int res = WebRequest("GET", url, headers, timeout, post, result, resultHeaders);
   
   if(res == -1)
   {
      LogError("WebRequest error: " + IntegerToString(GetLastError()));
      return;
   }
   
   if(res != 200)
   {
      LogError("HTTP error: " + IntegerToString(res));
      return;
   }
   
   //--- Parse response
   string response = CharArrayToString(result);
   
   if(StringLen(response) == 0)
      return;
   
   LogDebug("Received response: " + response);
   
   //--- Process signals
   ProcessSignals(response);
}

//+------------------------------------------------------------------+
//| Process signals from API response                                |
//+------------------------------------------------------------------+
void ProcessSignals(string jsonResponse)
{
   //--- Simple JSON parsing (in production, use proper JSON library)
   //--- Expected format: {"signals":[{...},{...}]}
   
   if(StringFind(jsonResponse, "\"signals\":[]") >= 0)
      return; // No signals
   
   //--- For demo purposes, we'll handle a simple signal format
   //--- In production, implement proper JSON parsing
   
   totalSignalsProcessed++;
   
   //--- Extract signal data (simplified)
   string action = ExtractJsonValue(jsonResponse, "action");
   string symbol = ExtractJsonValue(jsonResponse, "symbol");
   double price = StringToDouble(ExtractJsonValue(jsonResponse, "price"));
   double sl = StringToDouble(ExtractJsonValue(jsonResponse, "sl"));
   string tpStr = ExtractJsonValue(jsonResponse, "tp");
   double risk = StringToDouble(ExtractJsonValue(jsonResponse, "risk"));
   double lotSize = StringToDouble(ExtractJsonValue(jsonResponse, "lotSize"));
   
   LogInfo("Processing signal: " + action + " " + symbol);
   
   //--- Execute signal
   if(action == "buy")
      ExecuteBuyOrder(symbol, lotSize, price, sl, tpStr);
   else if(action == "sell")
      ExecuteSellOrder(symbol, lotSize, price, sl, tpStr);
   else if(action == "close")
      ClosePositionBySymbol(symbol);
}

//+------------------------------------------------------------------+
//| Execute buy order                                                |
//+------------------------------------------------------------------+
void ExecuteBuyOrder(string symbol, double lotSize, double price, double sl, string tpLevels)
{
   //--- Normalize prices
   double ask = SymbolInfoDouble(symbol, SYMBOL_ASK);
   double stopLoss = NormalizeDouble(sl, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS));
   
   //--- Parse first TP level
   double takeProfit = ParseFirstTP(tpLevels);
   takeProfit = NormalizeDouble(takeProfit, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS));
   
   //--- Validate lot size
   double minLot = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MIN);
   double maxLot = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MAX);
   lotSize = MathMax(minLot, MathMin(maxLot, lotSize));
   
   LogInfo("Opening BUY: " + symbol + " Lot: " + DoubleToString(lotSize, 2) + 
           " SL: " + DoubleToString(stopLoss, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)) +
           " TP: " + DoubleToString(takeProfit, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)));
   
   //--- Execute order
   if(trade.Buy(lotSize, symbol, 0, stopLoss, takeProfit, "TradeSync"))
   {
      LogInfo("BUY order executed successfully. Ticket: " + IntegerToString(trade.ResultOrder()));
      totalTradesOpened++;
      
      //--- Send confirmation to backend
      SendTradeConfirmation(trade.ResultOrder(), "buy", symbol, lotSize, ask, stopLoss, takeProfit);
   }
   else
   {
      LogError("Failed to execute BUY order: " + IntegerToString(GetLastError()));
   }
}

//+------------------------------------------------------------------+
//| Execute sell order                                               |
//+------------------------------------------------------------------+
void ExecuteSellOrder(string symbol, double lotSize, double price, double sl, string tpLevels)
{
   //--- Normalize prices
   double bid = SymbolInfoDouble(symbol, SYMBOL_BID);
   double stopLoss = NormalizeDouble(sl, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS));
   
   //--- Parse first TP level
   double takeProfit = ParseFirstTP(tpLevels);
   takeProfit = NormalizeDouble(takeProfit, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS));
   
   //--- Validate lot size
   double minLot = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MIN);
   double maxLot = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MAX);
   lotSize = MathMax(minLot, MathMin(maxLot, lotSize));
   
   LogInfo("Opening SELL: " + symbol + " Lot: " + DoubleToString(lotSize, 2) + 
           " SL: " + DoubleToString(stopLoss, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)) +
           " TP: " + DoubleToString(takeProfit, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)));
   
   //--- Execute order
   if(trade.Sell(lotSize, symbol, 0, stopLoss, takeProfit, "TradeSync"))
   {
      LogInfo("SELL order executed successfully. Ticket: " + IntegerToString(trade.ResultOrder()));
      totalTradesOpened++;
      
      //--- Send confirmation to backend
      SendTradeConfirmation(trade.ResultOrder(), "sell", symbol, lotSize, bid, stopLoss, takeProfit);
   }
   else
   {
      LogError("Failed to execute SELL order: " + IntegerToString(GetLastError()));
   }
}

//+------------------------------------------------------------------+
//| Close position by symbol                                         |
//+------------------------------------------------------------------+
void ClosePositionBySymbol(string symbol)
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(positionInfo.SelectByIndex(i))
      {
         if(positionInfo.Symbol() == symbol && positionInfo.Magic() == MAGIC_NUMBER)
         {
            LogInfo("Closing position: " + symbol + " Ticket: " + IntegerToString(positionInfo.Ticket()));
            
            if(trade.PositionClose(positionInfo.Ticket()))
            {
               LogInfo("Position closed successfully");
               totalTradesClosed++;
            }
            else
            {
               LogError("Failed to close position: " + IntegerToString(GetLastError()));
            }
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Update existing positions (trailing stop, breakeven)             |
//+------------------------------------------------------------------+
void UpdatePositions()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(positionInfo.SelectByIndex(i))
      {
         if(positionInfo.Magic() != MAGIC_NUMBER)
            continue;
         
         string symbol = positionInfo.Symbol();
         double currentPrice = positionInfo.PriceCurrent();
         double openPrice = positionInfo.PriceOpen();
         double sl = positionInfo.StopLoss();
         double tp = positionInfo.TakeProfit();
         
         //--- Breakeven logic
         if(ENABLE_BREAKEVEN)
         {
            UpdateBreakeven(symbol, openPrice, currentPrice, sl);
         }
         
         //--- Trailing stop logic
         if(ENABLE_TRAILING)
         {
            UpdateTrailingStop(symbol, openPrice, currentPrice, sl);
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Update breakeven stop loss                                       |
//+------------------------------------------------------------------+
void UpdateBreakeven(string symbol, double openPrice, double currentPrice, double currentSL)
{
   int digits = (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS);
   double point = SymbolInfoDouble(symbol, SYMBOL_POINT);
   double breakEvenDistance = 20 * point; // 20 points profit to activate
   
   if(positionInfo.PositionType() == POSITION_TYPE_BUY)
   {
      if(currentPrice >= openPrice + breakEvenDistance && currentSL < openPrice)
      {
         double newSL = NormalizeDouble(openPrice + 5 * point, digits);
         trade.PositionModify(positionInfo.Ticket(), newSL, positionInfo.TakeProfit());
         LogInfo("Breakeven activated for BUY position: " + symbol);
      }
   }
   else if(positionInfo.PositionType() == POSITION_TYPE_SELL)
   {
      if(currentPrice <= openPrice - breakEvenDistance && currentSL > openPrice)
      {
         double newSL = NormalizeDouble(openPrice - 5 * point, digits);
         trade.PositionModify(positionInfo.Ticket(), newSL, positionInfo.TakeProfit());
         LogInfo("Breakeven activated for SELL position: " + symbol);
      }
   }
}

//+------------------------------------------------------------------+
//| Update trailing stop loss                                        |
//+------------------------------------------------------------------+
void UpdateTrailingStop(string symbol, double openPrice, double currentPrice, double currentSL)
{
   int digits = (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS);
   double point = SymbolInfoDouble(symbol, SYMBOL_POINT);
   double trailingDistance = 30 * point; // 30 points trailing distance
   
   if(positionInfo.PositionType() == POSITION_TYPE_BUY)
   {
      double newSL = NormalizeDouble(currentPrice - trailingDistance, digits);
      if(newSL > currentSL && newSL < currentPrice)
      {
         trade.PositionModify(positionInfo.Ticket(), newSL, positionInfo.TakeProfit());
         LogDebug("Trailing stop updated for BUY: " + symbol);
      }
   }
   else if(positionInfo.PositionType() == POSITION_TYPE_SELL)
   {
      double newSL = NormalizeDouble(currentPrice + trailingDistance, digits);
      if(newSL < currentSL && newSL > currentPrice)
      {
         trade.PositionModify(positionInfo.Ticket(), newSL, positionInfo.TakeProfit());
         LogDebug("Trailing stop updated for SELL: " + symbol);
      }
   }
}

//+------------------------------------------------------------------+
//| Send trade confirmation to backend                               |
//+------------------------------------------------------------------+
void SendTradeConfirmation(ulong ticket, string action, string symbol, double lotSize, 
                          double price, double sl, double tp)
{
   string url = API_URL + "/confirm";
   string headers = "Content-Type: application/json\r\n";
   headers += "X-API-Key: " + API_KEY + "\r\n";
   
   //--- Build JSON payload
   string json = "{";
   json += "\"ticket\":" + IntegerToString(ticket) + ",";
   json += "\"action\":\"" + action + "\",";
   json += "\"symbol\":\"" + symbol + "\",";
   json += "\"lotSize\":" + DoubleToString(lotSize, 2) + ",";
   json += "\"price\":" + DoubleToString(price, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)) + ",";
   json += "\"sl\":" + DoubleToString(sl, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS)) + ",";
   json += "\"tp\":" + DoubleToString(tp, (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS));
   json += "}";
   
   char post[];
   StringToCharArray(json, post, 0, StringLen(json));
   
   char result[];
   string resultHeaders;
   
   int res = WebRequest("POST", url, headers, 5000, post, result, resultHeaders);
   
   if(res == 200)
      LogDebug("Trade confirmation sent successfully");
   else
      LogError("Failed to send trade confirmation: " + IntegerToString(res));
}

//+------------------------------------------------------------------+
//| Helper: Extract JSON value (simplified)                          |
//+------------------------------------------------------------------+
string ExtractJsonValue(string json, string key)
{
   string searchKey = "\"" + key + "\":";
   int startPos = StringFind(json, searchKey);
   
   if(startPos < 0)
      return "";
   
   startPos += StringLen(searchKey);
   
   //--- Skip whitespace and quotes
   while(startPos < StringLen(json) && (StringGetCharacter(json, startPos) == ' ' || 
         StringGetCharacter(json, startPos) == '\"'))
      startPos++;
   
   int endPos = startPos;
   
   //--- Find end of value
   while(endPos < StringLen(json))
   {
      ushort ch = StringGetCharacter(json, endPos);
      if(ch == ',' || ch == '}' || ch == '\"' || ch == ']')
         break;
      endPos++;
   }
   
   return StringSubstr(json, startPos, endPos - startPos);
}

//+------------------------------------------------------------------+
//| Helper: Parse first TP level from array                          |
//+------------------------------------------------------------------+
double ParseFirstTP(string tpArray)
{
   //--- Expected format: [2055.00,2060.00,2065.00]
   int startPos = StringFind(tpArray, "[");
   int endPos = StringFind(tpArray, ",");
   
   if(startPos < 0 || endPos < 0)
      return 0;
   
   string firstTP = StringSubstr(tpArray, startPos + 1, endPos - startPos - 1);
   return StringToDouble(firstTP);
}

//+------------------------------------------------------------------+
//| Logging functions                                                |
//+------------------------------------------------------------------+
void LogInfo(string message)
{
   if(LOG_LEVEL >= 2)
      Print("[INFO] ", message);
}

void LogError(string message)
{
   if(LOG_LEVEL >= 1)
      Print("[ERROR] ", message);
}

void LogDebug(string message)
{
   if(LOG_LEVEL >= 3)
      Print("[DEBUG] ", message);
}
//+------------------------------------------------------------------+
