# AutoTrade Pro - PWA

A mobile-first Progressive Web App for automated trading signal execution, built with Next.js 14, React, and TypeScript.

## Features

- **Mobile-First Design**: Bottom navigation on mobile, sidebar on desktop
- **PWA Support**: Installable with manifest.json and service worker
- **Dark/Light Theme**: Premium, calm UI with proper theme switching
- **Telegram Chat Integration**: View messages with signal tagging and parsed signal drawer
- **Automation Management**: Create, edit, and manage trading automations
- **Signal Tracking**: View all detected signals with execution status
- **Notifications**: Timeline-style alerts for trades and signals

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

The app runs on `http://localhost:3000` by default.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── automations/        # Automation management
│   ├── chats/              # Telegram chat interface
│   ├── notifications/      # Notifications center
│   ├── settings/           # App settings
│   ├── signals/            # Signal history
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home/Login redirect
├── components/
│   ├── automations/        # Automation components
│   ├── chats/              # Chat components
│   ├── layout/             # Layout components
│   ├── screens/            # Screen components
│   └── Providers.tsx       # Theme provider
├── data/                   # Mock JSON data
├── lib/                    # Utility functions
├── store/                  # Zustand store
└── types/                  # TypeScript types
```

## Mock Data

All data is stored in local JSON files in `src/data/`:

- `user.json` - User profile
- `telegramProviders.json` - Connected Telegram channels
- `telegramMessages.json` - Chat messages
- `parsedSignals.json` - Detected trading signals
- `brokers.json` - Connected brokers
- `automations.json` - Automation configurations
- `trades.json` - Trade history
- `notifications.json` - App notifications

## PWA Setup

The app includes:

- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker placeholder

To add app icons, place them in `public/icons/` with sizes:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

## Design Philosophy

- **Premium & Calm**: No gradients, no neon colors
- **Trust-Building**: Transparent signal and trade tracking
- **Mobile-Native Feel**: App-like transitions and interactions
- **Monochrome Base**: Color only for status indicators
  - Green: Profit, executed, connected
  - Red: Loss, skipped, error
  - Orange: Edited, warning
  - Gray: Informational

## License

Private - All rights reserved

