// Real-time connection status indicator

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { wsClient } from "@/lib/websocket-client";
import { useAuth } from "@/contexts/AuthContext";

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.apiKey) return;

    // Connect to WebSocket
    wsClient.connect(user.apiKey);

    // Listen for connection status
    const handleConnected = (connected: boolean) => {
      setIsConnected(connected);
    };

    wsClient.on('connected', handleConnected);

    return () => {
      wsClient.off('connected', handleConnected);
    };
  }, [user?.apiKey]);

  return (
    <Badge
      variant={isConnected ? "default" : "secondary"}
      className={`${
        isConnected
          ? "bg-green-600 hover:bg-green-700"
          : "bg-slate-400 hover:bg-slate-500"
      } transition-colors`}
    >
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3 mr-1" />
          <span className="text-xs">Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 mr-1" />
          <span className="text-xs">Disconnected</span>
        </>
      )}
    </Badge>
  );
}
