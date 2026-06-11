export function isEligibleForTranslation(urlString) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    if (!isRedditHostname(hostname)) {
      return false;
    }

    if (url.searchParams.get("show")?.toLowerCase() === "original") {
      return false;
    }

    if (url.searchParams.has("tl") || url.searchParams.has("show")) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

function isRedditHostname(hostname) {
  return (
    hostname === "reddit.com" ||
    hostname.endsWith(".reddit.com") ||
    hostname === "redd.it" ||
    hostname.endsWith(".redd.it")
  );
}
