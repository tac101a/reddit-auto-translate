// In-memory cache is the source of truth for per-URL attempts
let triedCache = new Set();

// Load session cache into memory on service worker startup
chrome.storage.session.get({ triedMap: {} }).then(({ triedMap }) => {
  if (triedMap) {
    Object.keys(triedMap).forEach((key) => triedCache.add(key));
  }
});

function baseKeyFrom(urlStr) {
  try {
    const u = new URL(urlStr);
    let path = u.pathname;
    if (path.endsWith("/") && path.length > 1) path = path.slice(0, -1);
    return u.origin + path;
  } catch (e) {
    return null;
  }
}

function shouldTranslateSync(urlStr) {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.replace(/^www\./, "");
    if (!host.endsWith("reddit.com") && !host.endsWith("redd.it")) return false;
    if (u.searchParams.get("show")?.toLowerCase() === "original") return false;
    if (u.searchParams.has("tl") || u.searchParams.has("show")) return false;
    const baseKey = baseKeyFrom(urlStr);
    if (!baseKey || triedCache.has(baseKey)) return false;
    return true;
  } catch (e) {
    return false;
  }
}

// Fire-and-forget persistence; RAM check remains authoritative
function markTried(urlStr) {
  const baseKey = baseKeyFrom(urlStr);
  if (!baseKey) return;
  triedCache.add(baseKey);
  chrome.storage.session.get({ triedMap: {} }).then(({ triedMap }) => {
    triedMap[baseKey] = true;
    chrome.storage.session.set({ triedMap });
  });
}

// Request-time redirect (blocking listener must stay synchronous)
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.type !== "main_frame") return;
    if (!shouldTranslateSync(details.url)) return;
    markTried(details.url);
    try {
      const u = new URL(details.url);
      u.searchParams.set("tl", "vi");
      return { redirectUrl: u.toString() };
    } catch (e) {
      return;
    }
  },
  { urls: ["*://*.reddit.com/*", "*://*.redd.it/*"] },
  ["blocking"]
);

// Fallback for browsers where blocking is ineffective
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    if (details.frameId !== 0) return;
    if (!shouldTranslateSync(details.url)) return;
    markTried(details.url);
    try {
      const u = new URL(details.url);
      u.searchParams.set("tl", "vi");
      chrome.tabs.update(details.tabId, { url: u.toString() });
    } catch (e) {}
  },
  { url: [{ hostSuffix: "reddit.com" }, { hostSuffix: "redd.it" }] }
);

// Messaging
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "clearTried") {
    triedCache.clear();
    chrome.storage.session.set({ triedMap: {} }).then(() => {
      sendResponse({ ok: true });
    });
    return true; // keep the channel open for async response
  }
});
