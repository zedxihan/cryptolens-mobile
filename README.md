<h1 align="center">CryptoLens</h1>
<h3 align="center">A clean, modern, and distraction-free cryptocurrency monitoring dashboard — now on mobile</h3>

<h1 align="center">
<a href="https://github.com/zedxihan/cryptolens">
<img src="https://img.shields.io/github/stars/zedxihan/cryptolens?style=for-the-badge&logo=github&labelColor=11140F&color=BBE9AA">
</a>
<a href="https://github.com/zedxihan/cryptolens/blob/main/LICENSE">
<img src="https://img.shields.io/github/license/zedxihan/cryptolens?style=for-the-badge&logo=agplv3&labelColor=11140F&color=BBE9AA">
</a>
<a href="https://github.com/zedxihan/cryptolens/commits">
<img src="https://img.shields.io/github/last-commit/zedxihan/cryptolens?style=for-the-badge&logo=git&labelColor=11140F&color=BBE9AA">
</a>
<br>
<img src="https://skillicons.dev/icons?i=react,ts,tailwind,babel,bun">
</h1>

> [!WARNING]  
> **Not Financial Advice:** CryptoLens is strictly a cryptocurrency monitoring dashboard. It does not facilitate trading, host blockchain data, or provide financial advice.
>
> **No Liability:** Users are solely responsible for their financial decisions. The developer assumes no liability for data inaccuracies, financial losses, or misuse of the application.
>
> **Regional Restrictions:** The app relies on the Binance API for live data. Users in restricted regions (such as the US) may experience connection errors and are responsible for complying with their local regulations.

## 💖 Support Us

[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/zedxihan)

> [!TIP]
> ⭐ **Star This Repository To Support The Developer And Encourage The Development Of CryptoLens!**

## Description

**CryptoLens** is the React Native rewrite of the popular CryptoLens web dashboard. It brings the same elegant, terminal-inspired experience to your phone with real-time market data, beautiful charts, and a premium dark-green UI optimized for mobile.

Track live prices, discover trending coins, analyze market sentiment, and monitor global metrics — all in a fast, native mobile app.

## Preview

**Live Web Version:** [https://cryptolens.link](https://cryptolens.link)

## Features

- **Live Prices:** Real-time updates via Binance WebSockets.
- **Market Insights:** Trending, Gainers, and Global metrics.
- **Interactive Charts:** Sparklines and Global Market history.
- **Top 100 Assets:** Fluid, sortable market tracking.
- **Native Performance:** 60fps UI with NativeWind v5 & FlashList.

## Tech Stack

- **React Native** (Expo 55)
- **TypeScript**
- **NativeWind v5** (Tailwind CSS v4)
- **Zustand** (Global state management)
- **Bun** (Package manager)
- Real-time data from **Binance (WebSockets + REST)** & **CoinGecko**

## Quick Start

1. **Clone & Install**

   ```bash
   git clone https://github.com/zedxihan/cryptolens.git
   cd cryptolens
   bun install
   ```

2. **Environment Setup** (Optional)
   Create a `.env` file in the root if you need to point to a custom API proxy:

   ```env
   EXPO_PUBLIC_API_URL=https://your-api-proxy.com
   ```

3. **Start the App**
   ```bash
   npx expo start
   ```

Scan the QR code with the **Expo Go** app on your iOS or Android device.

## 🗺 Roadmap

- [ ] **Coin Details:** Charts, history, and project info.
- [ ] **Portfolio Tracker:** Securely monitor your holdings.
- [ ] **Global Search:** Full-text search for 10k+ assets.
- [ ] **Market Sentiment:** Fear & Greed Index integration.
- [ ] **Price Alerts:** Instant custom push notifications.
- [ ] **Crypto Calendar:** Track ICOs and major events.
- [ ] **App Store Release:** Optimized iOS & Android builds.

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

This repository is licensed under AGPL-3.0.

---

Made with ❤️ by zedxihan
