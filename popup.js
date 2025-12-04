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

async function updateUIState() {
  const tab = await getActiveTab();
  if (!tab?.url) return;
  try {
    const u = new URL(tab.url);
    const btnVi = document.getElementById("to_vi");
    const btnOg = document.getElementById("to_original");
    btnVi.classList.remove("active");
    btnOg.classList.remove("active");
    if (u.searchParams.get("tl") === "vi") {
      btnVi.classList.add("active");
    } else if (u.searchParams.get("show") === "original") {
      btnOg.classList.add("active");
    }
  } catch (e) {
    /* ignore */
  }
}

updateUIState();

document.getElementById("to_vi").addEventListener("click", async () => {
  const tab = await getActiveTab();
  if (!tab?.url) return;
  const newUrl = setParam(tab.url, "tl", "vi", ["show"]);
  chrome.tabs.update(tab.id, { url: newUrl }, () => window.close());
});

document.getElementById("to_original").addEventListener("click", async () => {
  const tab = await getActiveTab();
  if (!tab?.url) return;
  const newUrl = setParam(tab.url, "show", "original", ["tl"]);
  chrome.tabs.update(tab.id, { url: newUrl }, () => window.close());
});

document.getElementById("clear").addEventListener("click", () => {
  const btn = document.getElementById("clear");
  const originalContent = btn.innerHTML;
  btn.innerHTML = "Clearing...";
  chrome.runtime.sendMessage({ type: "clearTried" }, () => {
    setTimeout(() => {
      btn.innerHTML = "Done!";
      setTimeout(() => window.close(), 500);
    }, 300);
  });
});
