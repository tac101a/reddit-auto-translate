async function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs && tabs[0] ? tabs[0] : null);
    });
  });
}

function setParam(url, key, value, removeKeys = []) {
  try {
    const u = new URL(url);
    for (const k of removeKeys) u.searchParams.delete(k);
    if (value === null) u.searchParams.delete(key);
    else u.searchParams.set(key, value);
    return u.toString();
  } catch (e) {
    return url;
  }
}

document.getElementById("to_vi").addEventListener("click", async () => {
  const tab = await getActiveTab();
  if (!tab?.url) return; // Nếu không lấy được tab thì dừng

  const newUrl = setParam(tab.url, "tl", "vi", ["show"]);

  // Dùng callback cho chắc ăn trên mọi trình duyệt
  chrome.tabs.update(tab.id, { url: newUrl }, () => {
    window.close();
  });
});

document.getElementById("to_original").addEventListener("click", async () => {
  const tab = await getActiveTab();
  if (!tab?.url) return;

  const newUrl = setParam(tab.url, "show", "original", ["tl"]);
  chrome.tabs.update(tab.id, { url: newUrl }, () => {
    window.close();
  });
});

document.getElementById("clear").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "clearTried" }, () => {
    window.close();
  });
});
