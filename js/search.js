const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

async function saveSearchHistory(query) {
    if (!query.trim()) return;

    const data = await chrome.storage.local.get("searchHistory");

    let history = data.searchHistory ?? [];

    // 同じ検索を削除
    history = history.filter(item => item !== query);

    // 最新を先頭へ
    history.unshift(query);

    // 最大20件
    history = history.slice(0, 20);

    await chrome.storage.local.set({
        searchHistory: history
    });
}

searchInput.addEventListener("input", async () => {

    const text = searchInput.value.trim();

    suggestions.innerHTML = "";

    if (!text) return;


    const data = await chrome.storage.local.get("searchHistory");

    const history = data.searchHistory ?? [];


    const results = history.filter(item =>
        item.toLowerCase().startsWith(text.toLowerCase())
    );


    for (const result of results) {

        const div = document.createElement("div");

        div.textContent = "↻ " + result;

        div.className = "suggestion";


        div.addEventListener("click", () => {
            searchInput.value = result;
            suggestions.innerHTML = "";
        });


        suggestions.appendChild(div);
    }

});

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    await saveSearchHistory(searchInput.value);

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