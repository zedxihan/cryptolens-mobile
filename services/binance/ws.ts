import type { BinanceTicker } from './types';

export const liveMarketCache = new Map<string, BinanceTicker>();

let ws: WebSocket | null = null;
let heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
let intentionalClose = false;

export const isWsConnected = () => ws?.readyState === WebSocket.OPEN;

// heartbeat
const resetHeartbeat = () => {
  if (heartbeatTimer) clearTimeout(heartbeatTimer);
  heartbeatTimer = setTimeout(() => ws?.close(), 5000);
};

export function connectWs() {
  if ((ws && ws?.readyState <= WebSocket.OPEN) || reconnectAttempts >= 5)
    return;

  intentionalClose = false;
  ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

  ws.onopen = () => {
    reconnectAttempts = 0;
    console.log('🟢 Binance WS Connected');
  };

  ws.onmessage = ({ data }) => {
    resetHeartbeat();

    try {
      const ticks = JSON.parse(data);
      if (!Array.isArray(ticks)) return;

      for (const { s, c, q } of ticks) {
        if (!s.endsWith('USDT')) continue;
        const cached = liveMarketCache.get(s);

        if (cached) {
          cached.current_price = +c;
          cached.total_volume = +q;
        } else {
          liveMarketCache.set(s, {
            id: s,
            symbol: s,
            current_price: +c,
            total_volume: +q,
            price_change_percentage_24h: 0,
          });
        }
      }
    } catch {} // ignore
  };

  ws.onclose = () => {
    if (heartbeatTimer) clearTimeout(heartbeatTimer);
    ws = null;

    if (!intentionalClose) {
      const delay = 5000 * Math.pow(2, reconnectAttempts++);
      console.log(
        `🛑 WS Closed. Reconnecting in ${delay / 1000}s (Attempt ${reconnectAttempts}/5)`,
      );
      setTimeout(connectWs, delay);
    }
  };
}

export const disconnectWs = () => {
  intentionalClose = true;
  if (heartbeatTimer) clearTimeout(heartbeatTimer);
  ws?.close();
};
