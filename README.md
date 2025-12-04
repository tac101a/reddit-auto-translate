# Reddit Auto Translate (vi) — v6.1 (Request-time + Fallback)

For Opera GX / Chrome / Edge (Chromium).

- **Preferred**: `webRequest.onBeforeRequest` with `"blocking"` redirects to `?tl=vi` **before** page loads.
- **Fallback**: `webNavigation.onBeforeNavigate` updates the tab URL pre-commit if some builds don't fire `webRequest` for unpacked extensions.
- **Once per post per session**, respects `?show=original`.

## Install
1. Unzip.
2. Go to `opera://extensions` (or `chrome://extensions`).
3. Enable Developer mode.
4. Load unpacked.

## Permissions
```json
"permissions": ["webRequest", "webRequestBlocking", "webNavigation", "storage", "tabs"],
"host_permissions": ["*://*.reddit.com/*"]
```

## Notes
- Session memory resets when you close the browser.
- You can clear the session cache using the popup.
