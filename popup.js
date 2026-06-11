function queryTabs(queryInfo) {
  return new Promise((resolve) => {
    chrome.tabs.query(queryInfo, (tabs) => {
      const error = chrome.runtime.lastError;

      if (error) {
        resolve([]);
        return;
      }

      resolve(tabs || []);
    });
  });
}

function updateTab(tabId, updateProperties) {
  return new Promise((resolve) => {
    chrome.tabs.update(tabId, updateProperties, () => {
      const error = chrome.runtime.lastError;

      resolve({
        ok: !error,
        error: error?.message,
      });
    });
  });
}

function sendRuntimeMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      const error = chrome.runtime.lastError;

      if (error) {
        resolve({ ok: false, error: error.message });
        return;
      }

      resolve(response || { ok: false });
    });
  });
}

async function getActiveTab() {
  const tabs = await queryTabs({ active: true, currentWindow: true });
  return tabs[0] || null;
}

function setParam(url, key, value, removeKeys = []) {
  try {
    const parsedUrl = new URL(url);

    for (const removeKey of removeKeys) {
      parsedUrl.searchParams.delete(removeKey);
    }

    if (value === null) {
      parsedUrl.searchParams.delete(key);
    } else {
      parsedUrl.searchParams.set(key, value);
    }

    return parsedUrl.toString();
  } catch (error) {
    return url;
  }
}

async function updateUIState() {
  const tab = await getActiveTab();

  if (!tab?.url) {
    return;
  }

  try {
    const parsedUrl = new URL(tab.url);
    const btnVi = document.getElementById("to_vi");
    const btnOg = document.getElementById("to_original");

    btnVi.classList.remove("active");
    btnOg.classList.remove("active");

    if (parsedUrl.searchParams.get("tl") === "vi") {
      btnVi.classList.add("active");
    } else if (parsedUrl.searchParams.get("show") === "original") {
      btnOg.classList.add("active");
    }
  } catch (error) {
    /* ignore invalid tab URLs */
  }
}

updateUIState();

document.getElementById("to_vi").addEventListener("click", async () => {
  const tab = await getActiveTab();

  if (!tab?.url) {
    return;
  }

  const newUrl = setParam(tab.url, "tl", "vi", ["show"]);
  const response = await updateTab(tab.id, { url: newUrl });

  if (response.ok) {
    window.close();
  }
});

document.getElementById("to_original").addEventListener("click", async () => {
  const tab = await getActiveTab();

  if (!tab?.url) {
    return;
  }

  const newUrl = setParam(tab.url, "show", "original", ["tl"]);
  const response = await updateTab(tab.id, { url: newUrl });

  if (response.ok) {
    window.close();
  }
});

document.getElementById("clear").addEventListener("click", async () => {
  const btn = document.getElementById("clear");
  const label = btn.querySelector(".button-label");
  const originalText = label?.textContent || "Clear Cache";

  btn.classList.remove("is-success", "is-error");
  btn.disabled = true;

  if (label) {
    label.textContent = "Clearing...";
  }

  const response = await sendRuntimeMessage({ type: "clearTried" });

  if (response?.ok) {
    btn.classList.add("is-success");

    if (label) {
      label.textContent = "Cleared!";
    }

    setTimeout(() => window.close(), 500);
    return;
  }

  btn.classList.add("is-error");

  if (label) {
    label.textContent = "Try Again";
  }

  setTimeout(() => {
    btn.classList.remove("is-error");
    btn.disabled = false;

    if (label) {
      label.textContent = originalText;
    }
  }, 1200);
});
