import { clearTriedCache, hasTried, markTried } from "./src/storage/sessionManager.js";
import { isEligibleForTranslation } from "./src/rules/urlValidator.js";

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

  if (await hasTried(url)) {
    return;
  }

  const newUrl = buildTranslatedUrl(url);

  if (!newUrl) {
    return;
  }

  await chrome.tabs.update(tabId, { url: newUrl });
  await markTried(url);
}

function handleRedirection(tabId, url) {
  processRedirection(tabId, url).catch(() => {});
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
