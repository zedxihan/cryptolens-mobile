import { create } from 'zustand';

interface PriceData {
  price: number;
  change: number;
}

interface PriceState {
  prices: Record<string, PriceData>;
  actions: {
    setLivePrice: (symbol: string, price: number, change: number) => void;
  };
}

const usePriceStore = create<PriceState>((set) => ({
  prices: {},
  actions: {
    setLivePrice: (symbol, price, change) =>
      set((state) => ({
        prices: {
          ...state.prices,
          [symbol]: { price, change },
        },
      })),
  },
}));

// actions selector
export const usePriceActions = () => usePriceStore((state) => state.actions);

// ticker selector
export const useTickerPrice = (symbol: string) => {
  const ticker = symbol.toUpperCase().endsWith('USDT')
    ? symbol.toUpperCase()
    : `${symbol.toUpperCase()}USDT`;

  return usePriceStore((state) => state.prices[ticker]);
};

// ws push helper
export const priceActions = usePriceStore.getState().actions;
