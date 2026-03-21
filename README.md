# Nebula Casino - High Stakes Entertainment

Nebula Casino is a premium, immersive digital casino application built with React, TypeScript, and Tailwind CSS. It features a sophisticated "Neon Nebula" aesthetic with glassmorphism, hyper-rounded corners, and vibrant luminous accents.

## 🚀 Features

- **Immersive Lobby:** Dynamic hero banners, live winners ticker, and trending game grids.
- **Game Previews:** Detailed bottom-sheet modals with game stats (RTP, Volatility) and interactive play options.
- **Wallet Management:** Real-time balance tracking and transaction history.
- **Promotions Hub:** Dedicated view for daily rewards and VIP club status.
- **Responsive Design:** Optimized for both desktop (sidebar) and mobile (bottom navigation) experiences.
- **Motion & Interactions:** Smooth animations powered by `motion/react`.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Motion (formerly Framer Motion)
- **Icons:** Lucide React
- **Build Tool:** Vite

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## ⚙️ Local Setup

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <your-repo-url>
   cd nebula-casino
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Note: For local development, you can leave the `GEMINI_API_KEY` empty unless you are implementing AI-driven features.*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000` (or the port specified by Vite).

## 🏗️ Building for Production

To create an optimized production build:
```bash
npm run build
```
The output will be generated in the `dist/` directory.

## 📁 Project Structure

- `src/App.tsx`: Main application logic and routing.
- `src/constants.ts`: Mock data for games, banners, and user activity.
- `src/types.ts`: TypeScript interfaces for the casino domain.
- `src/index.css`: Global styles and Tailwind CSS configuration.
- `src/main.tsx`: Application entry point.

## 🎰 Mock API Reference

The application uses a mock data source based on the following entities:
- `CasinoGame`: Game metadata, logos, and stats.
- `PlayerWallet`: Balance and withdrawal information.
- `DepositOrder`: Transaction history records.
- `PromotionBanner`: Marketing and giveaway content.

---

*Built with ❤️ for Nebula Casino.*
