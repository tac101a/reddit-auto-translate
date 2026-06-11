const TRIED_KEY_PREFIX = "tried:";

export function getBaseKey(url) {
  try {
    const parsedUrl = new URL(url);
    let path = parsedUrl.pathname;

    if (path.endsWith("/") && path.length > 1) {
      path = path.slice(0, -1);
    }

    return `${parsedUrl.origin}${path}`;
  } catch (error) {
    return null;
  }
}

function getSessionStorageArea() {
  return chrome.storage.session;
}

function getStorageKey(url) {
  const baseKey = getBaseKey(url);
  return baseKey ? `${TRIED_KEY_PREFIX}${baseKey}` : null;
}

export async function hasTried(url) {
  const storageKey = getStorageKey(url);

  if (!storageKey) {
    return false;
  }

  const values = await getSessionStorageArea().get(storageKey);
  return Boolean(values[storageKey]);
}

export async function markTried(url) {
  const storageKey = getStorageKey(url);

  if (!storageKey) {
    return;
  }

  try {
    await getSessionStorageArea().set({ [storageKey]: true });
  } catch (error) {
    if (!isQuotaExceededError(error)) {
      throw error;
    }

    await clearTriedCache();
    await getSessionStorageArea().set({ [storageKey]: true });
  }
}

export async function clearTriedCache() {
  const values = await getSessionStorageArea().get(null);
  const triedKeys = Object.keys(values).filter((key) => key.startsWith(TRIED_KEY_PREFIX));

  if (triedKeys.length > 0) {
    await getSessionStorageArea().remove(triedKeys);
  }
}

function isQuotaExceededError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.toLowerCase().includes("quota");
}
