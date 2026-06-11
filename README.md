# Reddit Auto Translate

Reddit Auto Translate is a Manifest V3 browser extension that automatically opens supported Reddit pages with Reddit's Vietnamese translation parameter, `tl=vi`.

The extension does not translate content itself. It enables Reddit's native translated view and respects pages that are already translated or explicitly opened in original mode.

## Architecture

This refactor moves the extension from a Manifest V2 persistent background page to a Manifest V3 service worker architecture.

- `manifest.json` declares an MV3 module service worker and `incognito: split` for privacy isolation.
- `background.js` is only the orchestration layer. It listens for navigation events and delegates URL rules and cache state to helper modules.
- `src/rules/urlValidator.js` contains pure URL eligibility logic with no Chrome API access.
- `src/storage/sessionManager.js` abstracts `chrome.storage.session` and owns redirect-attempt state.
- `popup.js` handles manual page actions and async messaging with the service worker.

## Key Improvements

- O(1) session state: redirect attempts are stored as independent `chrome.storage.session` keys, avoiding large read-modify-write maps and disk I/O lag.
- Zero persistent RAM usage: MV3 service workers start on demand and shut down when idle, removing the always-alive background page.
- Privacy-first Incognito mode: `incognito: split` gives normal and Incognito windows separate service workers and separate session storage.
- SPA-aware navigation: `chrome.webNavigation.onHistoryStateUpdated` catches Reddit internal route changes without relying on blocking request interception.
- Idempotent redirect checks: pure URL rules plus session-backed state prevent repeated redirects and service worker restart issues.

## Tech Stack

- Chrome Extension Manifest V3
- MV3 module service worker
- `chrome.storage.session`
- `chrome.tabs.onUpdated`
- `chrome.webNavigation.onHistoryStateUpdated`
- Pure JavaScript URL validation helpers

## Installation

1. Clone or download this repository.
2. Open your Chromium extension manager:
   - Chrome or Edge: `chrome://extensions`
   - Opera: `opera://extensions`
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the project directory.

## Usage

Browse Reddit normally. Eligible Reddit pages are redirected once per browser session to include `tl=vi`.

Use the extension popup to:

- Translate the current Reddit page to Vietnamese.
- View the original Reddit page.
- Clear the session redirect cache.

## Privacy Notes

The extension stores only temporary redirect-attempt keys in `chrome.storage.session`. This state is session-scoped and is not written to disk through `chrome.storage.local`.

Incognito mode runs in split mode, so Incognito redirect state is isolated from normal browsing state.
