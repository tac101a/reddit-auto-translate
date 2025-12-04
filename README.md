# Reddit Auto Translate (vi) — v2.0 (MV2 / Instant Redirect)

A high-performance extension for Chrome / Edge / Opera GX.
Automatically redirects Reddit posts to the Vietnamese translated version (`?tl=vi`).

> **Note:** This version uses **Manifest V2** to unlock the full power of `webRequestBlocking` (synchronous). This ensures redirects happen **instantly** before the page loads, eliminating double-loading or flashing.

## 🚀 Features

- **Zero-Delay Redirect**: Uses synchronous blocking listeners to force `?tl=vi` immediately.
- **Smart Loop Protection**: Uses an in-memory `Set` + `storage.local` to track attempts. Tries redirecting **once per post per session** to prevent infinite loops if Reddit refuses to translate.
- **Respects Original**: If you manually choose "Show Original" (or the URL has `?show=original`), the extension will back off.
- **Opera GX Compatible**: Works perfectly on browsers that have strict MV3 limitations for packed extensions.

## 🛠️ Installation

1. Download or Clone this repository.
2. Open your browser's extension manager:
   - Chrome/Edge: `chrome://extensions`
   - Opera: `opera://extensions`
3. Enable **Developer mode** (top right corner).
4. Click **Load unpacked** and select this folder.

> ⚠️ **Warning:** You may see a generic warning: *"Manifest version 2 is deprecated..."*. You can safely **ignore** this. It is just a notice from Google, the extension works perfectly in Developer Mode.

## ⚙️ Permissions

This extension uses **Manifest V2** syntax:

```json
"permissions": [
  "webRequest",
  "webRequestBlocking",
  "webNavigation",
  "storage",
  "tabs",
  "*://*.reddit.com/*",
  "*://*.redd.it/*"
]
```

## 🧩 Architecture

- `manifest.json`: MV2, persistent background page.
- `background.js`: Core logic; handles `onBeforeRequest` (blocking) and manages the tried cache.
- `popup.js`: Handles manual overrides (Open as Translated / Open as Original) and cache clearing.

## 📝 Usage

Just browse Reddit—posts will automatically open in Vietnamese.

Click the extension icon to:

- **Open as Translated**: Force the current tab to Vietnamese.
- **Open as Original**: Force the current tab to the original version.
- **Reset cache**: Clear the session memory if you want to retry redirects.
