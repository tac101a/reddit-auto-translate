import { clearTriedCache, getBaseKey, hasTried, markTried } from "./src/storage/sessionManager.js";
import { isEligibleForTranslation } from "./src/rules/urlValidator.js";

const inFlightLocks = new Set();

function buildTranslatedUrl(url) {
  try {
    const translatedUrl = new URL(url);
    translatedUrl.searchParams.set("tl", "vi");
    return translatedUrl.toString();
  } catch (error) {
    return null;
  }
}

async function processRedirection(tabId, url) {
  if (!Number.isInteger(tabId) || tabId < 0 || !url) {
    return;
  }

  if (!isEligibleForTranslation(url)) {
    return;
  }

  const lockKey = getBaseKey(url) || url;

  if (inFlightLocks.has(lockKey)) {
    return;
  }

  inFlightLocks.add(lockKey);

  try {
    if (await hasTried(url)) {
      return;
    }

    const newUrl = buildTranslatedUrl(url);

    if (!newUrl) {
      return;
    }

    await markTried(url);
    await chrome.tabs.update(tabId, { url: newUrl });
  } finally {
    inFlightLocks.delete(lockKey);
  }
}

function handleRedirection(tabId, url) {
  processRedirection(tabId, url).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);

    if (!message.includes("No tab with id")) {
      console.error(error);
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "loading" || !changeInfo.url) {
    return;
  }

  handleRedirection(tabId, changeInfo.url);
});

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (details.frameId !== 0) {
      return;
    }

    handleRedirection(details.tabId, details.url);
  },
  {
    url: [{ hostSuffix: "reddit.com" }, { hostSuffix: "redd.it" }],
  }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "clearTried") {
    return false;
  }

  clearTriedCache()
    .then(() => {
      sendResponse({ ok: true });
    })
    .catch((error) => {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    });

  return true;
});
