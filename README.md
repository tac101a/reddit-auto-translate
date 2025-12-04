# Reddit Auto Translate (vi) - v2.0 (MV2 / Instant Redirect)

A high-performance extension for Chrome / Edge / Opera GX. Automatically redirects Reddit posts to the Vietnamese translated version (`?tl=vi`).

> Note: This version uses Manifest V2 to unlock the full power of `webRequestBlocking` (synchronous). Redirects happen instantly before the page loads, avoiding double-loading or flashing.

## Features

- Zero-delay redirect: synchronous blocking listener forces `?tl=vi` immediately.
- Smart loop protection: in-memory `Set` plus `storage.local`, tries once per post per session.
- Respects original: backs off if the URL has `?show=original`.
- Opera GX compatible: works even with strict MV3 limitations for packed extensions.

## Installation

1. Download or clone this repository.
2. Open the extension manager:
   - Chrome/Edge: `chrome://extensions`
   - Opera: `opera://extensions`
3. Enable Developer mode.
4. Click Load unpacked and select this folder.

> Warning: You may see a notice: "Manifest version 2 is deprecated...". It is safe to ignore in Developer Mode.

## Permissions

This extension uses Manifest V2 syntax:

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

## Architecture

- `manifest.json`: MV2, persistent background page.
- `background.js`: Core logic; handles `onBeforeRequest` (blocking) and manages the tried cache.
- `popup.js`: Manual overrides (Open as Translated / Open as Original) and cache clearing.

## Usage

Browse Reddit and posts will open in Vietnamese automatically.

Extension popup actions:

- Open as Translated: force the current tab to Vietnamese.
- Open as Original: force the current tab to the original version.
- Reset cache: clear session memory to retry redirects.
