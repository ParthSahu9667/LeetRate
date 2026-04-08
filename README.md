# LeetRank 🚀

LeetRank is a Manifest V3 Chrome extension that fetches and displays **clist.by** problem ratings directly on LeetCode problem pages. It helps you quickly see the difficulty of a problem according to the competitive programming community.

![LeetRank Banner](https://img.shields.io/badge/LeetCode-Clist.by-orange?style=for-the-badge)

## ✨ Features

- **Standard Rating Colors**: Ratings are color-coded based on Clist standard tiers (Gray, Green, Cyan, Blue, Purple, Orange, Red).
- **Spoiler-Free**: Ratings are blurred by default. Click the badge to reveal the rating and problem name.
- **SPA Friendly**: built with a `MutationObserver` to handle LeetCode's Single Page Application (React) navigation without page reloads.
- **Clean UI**: Designed to blend seamlessly with LeetCode's native UI using topic-tag inspired styling.
- **Modular Codebase**: Organized into clear directories (`api`, `components`, `utils`) using TypeScript.
- **Fast Bundling**: Linked with `esbuild` for lightning-fast compilation and bundling.

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Bundler**: esbuild
- **Manifest**: MV3 (Chrome Extension)
- **Styling**: Vanilla CSS with LeetCode-native classes

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [NPM](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/LeetRank.git
   cd LeetRank
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Credentials**:
   Open `src/api/clist.ts` and replace the placeholders with your Clist.by credentials:
   ```typescript
   const CLIST_USERNAME = 'your_username';
   const CLIST_API_KEY = 'your_api_key';
   ```
   *(You can find your API key in your [Clist.by settings](https://clist.by/api/v4/))*

4. **Build the extension**:
   ```bash
   npm run build
   ```

### Loading into Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right).
3. Click **Load unpacked**.
4. Select the `LeetRank` root folder (the one containing `manifest.json`).

## 📖 Usage

- Open any problem on `leetcode.com/problems/*`.
- Find the **Rating** badge near the problem title.
- **Click** the blurred rating to reveal the Clist.by score.
- Use the extension popup (click the LeetRank icon in the toolbar) to see the integration status.

## 📁 Project Structure

```text
LeetRank/
├── dist/                # Compiled and bundled JavaScript files
│   ├── background.js
│   ├── content.js
│   └── popup.js
├── images/              # Extension assets
│   └── icon.png
├── node_modules/        # Project dependencies
├── src/                 # Source code (TypeScript)
│   ├── api/
│   │   └── clist.ts      # Clist.by API fetching logic
│   ├── components/
│   │   └── badge.ts      # UI injection and animation logic
│   ├── utils/
│   │   ├── formatters.ts # String manipulation
│   │   ├── theme.ts      # Rating color resolver
│   │   └── url.ts        # LeetCode URL parsing
│   ├── background.ts    # Service worker entry
│   ├── content.ts       # Content script entry
│   └── popup.ts         # Popup script entry
├── .env                 # API credentials (reference only)
├── manifest.json        # Extension manifest v3
├── package.json         # Build scripts and dependencies
├── popup.html           # Main popup UI
├── README.md            # You are here
└── tsconfig.json        # TypeScript configuration
```

## ⚖️ License

Built for personal use. Feel free to fork and modify!
