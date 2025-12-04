async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}
function setParam(url, key, value, removeKeys = []) {
  const u = new URL(url);
  for (const k of removeKeys) u.searchParams.delete(k);
  if (value === null) u.searchParams.delete(key);
  else u.searchParams.set(key, value);
  return u.toString();
}
document.getElementById("to_vi").addEventListener("click", async () => {
  const tab = await getActiveTab();
  if (!tab?.url) return;
  const newUrl = setParam(tab.url, "tl", "vi", ["show"]);
  await chrome.tabs.update(tab.id, { url: newUrl });
  window.close();
});
document.getElementById("to_original").addEventListener("click", async () => {
  const tab = await getActiveTab();
  if (!tab?.url) return;
  const newUrl = setParam(tab.url, "show", "original", ["tl"]);
  await chrome.tabs.update(tab.id, { url: newUrl });
  window.close();
});
document.getElementById("clear").addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "clearTried" });
  window.close();
});
