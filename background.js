\
// Session-tracking of base URLs
let triedCache = new Set();

async function loadTried() {
  const { triedMap } = await chrome.storage.session.get({ triedMap: {} });
  triedCache = new Set(Object.keys(triedMap));
}
async function markTried(baseKey) {
  triedCache.add(baseKey);
  const { triedMap } = await chrome.storage.session.get({ triedMap: {} });
  triedMap[baseKey] = true;
  await chrome.storage.session.set({ triedMap });
}
function baseKeyFrom(urlStr) {
  try { const u = new URL(urlStr); return u.origin + u.pathname; } catch(e){ return null; }
}
function shouldTranslate(urlStr){
  try {
    const u = new URL(urlStr);
    const host = u.hostname.replace(/^www\./,'');
    if (!host.endsWith('reddit.com')) return false;
    if (u.searchParams.get('show')?.toLowerCase() === 'original') return false;
    if (u.searchParams.has('tl') || u.searchParams.has('show')) return false;
    const baseKey = baseKeyFrom(urlStr);
    if (!baseKey || triedCache.has(baseKey)) return false;
    return true;
  } catch(e){ return false; }
}

// Load session state
loadTried();

// Preferred: request-time redirect
chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    try {
      if (details.type !== 'main_frame') return;
      if (!shouldTranslate(details.url)) return;
      const u = new URL(details.url);
      const baseKey = baseKeyFrom(details.url);
      await markTried(baseKey);
      u.searchParams.set('tl','vi');
      return { redirectUrl: u.toString() };
    } catch(e){ return; }
  },
  { urls: ["*://*.reddit.com/*"] },
  ["blocking"]
);

// Fallback: before navigation commit (if some Opera builds don't fire webRequest)
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  try {
    if (details.frameId !== 0) return; // only main frame
    const urlStr = details.url || '';
    if (!shouldTranslate(urlStr)) return;
    const u = new URL(urlStr);
    const baseKey = baseKeyFrom(urlStr);
    await markTried(baseKey);
    u.searchParams.set('tl','vi');
    chrome.tabs.update(details.tabId, { url: u.toString() });
  } catch(e){ /* ignore */ }
}, { url: [{hostSuffix: "reddit.com"}] });

// Popup messaging
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg?.type === "clearTried") {
    await chrome.storage.session.set({ triedMap: {} });
    triedCache.clear();
    sendResponse({ ok: true });
  }
});
