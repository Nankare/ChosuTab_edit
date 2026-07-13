const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { searchEngine = "google" } =
        await chrome.storage.local.get("searchEngine");

    const engines = {
        google: "https://www.google.com/search?q=",
        bing: "https://www.bing.com/search?q=",
        duckduckgo: "https://duckduckgo.com/?q=",
        yahoo: "https://search.yahoo.co.jp/search?p="
    };

    const url =
        (engines[searchEngine] ?? engines.google) +
        encodeURIComponent(searchInput.value);

    location.href = url;
});