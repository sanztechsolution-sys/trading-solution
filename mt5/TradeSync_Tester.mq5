//+------------------------------------------------------------------+
//|                                    TradeSync_Tester.mq5          |
//|                        Test script for TradeSync EA              |
//+------------------------------------------------------------------+
#property copyright "TradeSync"
#property version   "1.00"
#property script_show_inputs

//--- Input parameters
input string   TEST_SYMBOL = "EURUSD";        // Symbol to test
input double   TEST_LOT_SIZE = 0.01;          // Test lot size
input int      TEST_MAGIC = 123456;           // Magic number

//+------------------------------------------------------------------+
//| Script program start function                                    |
//+------------------------------------------------------------------+
void OnStart()
{
   Print("=== TradeSync EA Test Script ===");
   
   //--- Test 1: Symbol information
   TestSymbolInfo();
   
   //--- Test 2: Account information
   TestAccountInfo();
   
   //--- Test 3: Order execution (demo)
   TestOrderExecution();
   
   //--- Test 4: Position management
   TestPositionManagement();
   
   Print("=== Test Complete ===");
}

//+------------------------------------------------------------------+
//| Test symbol information                                          |
//+------------------------------------------------------------------+
void TestSymbolInfo()
{
   Print("\n--- Symbol Information Test ---");
   
   if(!SymbolSelect(TEST_SYMBOL, true))
   {
      Print("ERROR: Symbol not found: ", TEST_SYMBOL);
      return;
   }
   
   Print("Symbol: ", TEST_SYMBOL);
   Print("Digits: ", SymbolInfoInteger(TEST_SYMBOL, SYMBOL_DIGITS));
   Print("Point: ", SymbolInfoDouble(TEST_SYMBOL, SYMBOL_POINT));
   Print("Bid: ", SymbolInfoDouble(TEST_SYMBOL, SYMBOL_BID));
   Print("Ask: ", SymbolInfoDouble(TEST_SYMBOL, SYMBOL_ASK));
   Print("Spread: ", SymbolInfoInteger(TEST_SYMBOL, SYMBOL_SPREAD));
   Print("Min Lot: ", SymbolInfoDouble(TEST_SYMBOL, SYMBOL_VOLUME_MIN));
   Print("Max Lot: ", SymbolInfoDouble(TEST_SYMBOL, SYMBOL_VOLUME_MAX));
   Print("Lot Step: ", SymbolInfoDouble(TEST_SYMBOL, SYMBOL_VOLUME_STEP));
}

//+------------------------------------------------------------------+
//| Test account information                                         |
//+------------------------------------------------------------------+
void TestAccountInfo()
{
   Print("\n--- Account Information Test ---");
   
   Print("Account Number: ", AccountInfoInteger(ACCOUNT_LOGIN));
   Print("Account Name: ", AccountInfoString(ACCOUNT_NAME));
   Print("Account Server: ", AccountInfoString(ACCOUNT_SERVER));
   Print("Account Currency: ", AccountInfoString(ACCOUNT_CURRENCY));
   Print("Account Balance: ", AccountInfoDouble(ACCOUNT_BALANCE));
   Print("Account Equity: ", AccountInfoDouble(ACCOUNT_EQUITY));
   Print("Account Margin: ", AccountInfoDouble(ACCOUNT_MARGIN));
   Print("Account Free Margin: ", AccountInfoDouble(ACCOUNT_MARGIN_FREE));
   Print("Account Leverage: 1:", AccountInfoInteger(ACCOUNT_LEVERAGE));
}

//+------------------------------------------------------------------+
//| Test order execution                                             |
//+------------------------------------------------------------------+
void TestOrderExecution()
{
   Print("\n--- Order Execution Test (Simulation) ---");
   
   double ask = SymbolInfoDouble(TEST_SYMBOL, SYMBOL_ASK);
   double bid = SymbolInfoDouble(TEST_SYMBOL, SYMBOL_BID);
   int digits = (int)SymbolInfoInteger(TEST_SYMBOL, SYMBOL_DIGITS);
   double point = SymbolInfoDouble(TEST_SYMBOL, SYMBOL_POINT);
   
   //--- Calculate SL and TP
   double slDistance = 50 * point;
   double tpDistance = 100 * point;
   
   double buySL = NormalizeDouble(ask - slDistance, digits);
   double buyTP = NormalizeDouble(ask + tpDistance, digits);
   
   double sellSL = NormalizeDouble(bid + slDistance, digits);
   double sellTP = NormalizeDouble(bid - tpDistance, digits);
   
   Print("BUY Order Simulation:");
   Print("  Entry: ", DoubleToString(ask, digits));
   Print("  SL: ", DoubleToString(buySL, digits));
   Print("  TP: ", DoubleToString(buyTP, digits));
   Print("  Lot: ", DoubleToString(TEST_LOT_SIZE, 2));
   
   Print("\nSELL Order Simulation:");
   Print("  Entry: ", DoubleToString(bid, digits));
   Print("  SL: ", DoubleToString(sellSL, digits));
   Print("  TP: ", DoubleToString(sellTP, digits));
   Print("  Lot: ", DoubleToString(TEST_LOT_SIZE, 2));
   
   //--- Calculate required margin
   double margin = 0;
   if(OrderCalcMargin(ORDER_TYPE_BUY, TEST_SYMBOL, TEST_LOT_SIZE, ask, margin))
   {
      Print("\nRequired Margin: ", DoubleToString(margin, 2));
      Print("Available Margin: ", DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN_FREE), 2));
      
      if(margin <= AccountInfoDouble(ACCOUNT_MARGIN_FREE))
         Print("✓ Sufficient margin available");
      else
         Print("✗ Insufficient margin!");
   }
}

//+------------------------------------------------------------------+
//| Test position management                                         |
//+------------------------------------------------------------------+
void TestPositionManagement()
{
   Print("\n--- Position Management Test ---");
   
   int totalPositions = PositionsTotal();
   Print("Total Open Positions: ", totalPositions);
   
   if(totalPositions == 0)
   {
      Print("No open positions to test");
      return;
   }
   
   CPositionInfo posInfo;
   
   for(int i = 0; i < totalPositions; i++)
   {
      if(posInfo.SelectByIndex(i))
      {
         Print("\nPosition #", i + 1);
         Print("  Ticket: ", posInfo.Ticket());
         Print("  Symbol: ", posInfo.Symbol());
         Print("  Type: ", posInfo.TypeDescription());
         Print("  Volume: ", posInfo.Volume());
         Print("  Open Price: ", posInfo.PriceOpen());
         Print("  Current Price: ", posInfo.PriceCurrent());
         Print("  SL: ", posInfo.StopLoss());
         Print("  TP: ", posInfo.TakeProfit());
         Print("  Profit: ", posInfo.Profit());
         Print("  Magic: ", posInfo.Magic());
         
         if(posInfo.Magic() == TEST_MAGIC)
            Print("  ✓ Managed by TradeSync EA");
      }
   }
}
//+------------------------------------------------------------------+
