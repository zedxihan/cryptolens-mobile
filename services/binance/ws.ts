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

      for (const { s, c, q, o } of ticks) {
        if (!s.endsWith('USDT')) continue;

        const currentPrice = +c,
          openPrice = +o,
          volume = +q;
        const cached = liveMarketCache.get(s);
        const ticker = cached ?? ({ id: s, symbol: s } as BinanceTicker);

        ticker.current_price = currentPrice;
        ticker.total_volume = volume;
        ticker.price_change_percentage_24h = openPrice
          ? ((currentPrice - openPrice) / openPrice) * 100
          : 0;

        if (!cached) liveMarketCache.set(s, ticker);
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
