import { WebSocketServer, WebSocket } from 'ws';

const clients = new Set<WebSocket>();

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket) => {
    console.log('📡 New WebSocket client connected');
    clients.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'WebSocket connection established'
    }));

    // Handle messages from client
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle ping/pong
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      console.log('📡 WebSocket client disconnected');
      clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Heartbeat to keep connections alive
  setInterval(() => {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'heartbeat' }));
      }
    });
  }, 30000); // Every 30 seconds
}

// Broadcast message to all connected clients
export function broadcastToClients(data: any) {
  const message = JSON.stringify(data);
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Send message to specific client
export function sendToClient(client: WebSocket, data: any) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}
