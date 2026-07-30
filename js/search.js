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

async function updateSuggestions(query = "") {
    const { searchHistory = [] } =
        await chrome.storage.local.get("searchHistory");

    suggestions.innerHTML = "";

    const keyword = query.toLowerCase();

    const history = searchHistory
        .slice()
        .filter(item =>
            keyword === "" ||
            item.toLowerCase().startsWith(keyword)
        )
        .slice(0, 5);

    for (const item of history) {
        const div = document.createElement("div");

        div.className = "suggestion";
        div.textContent = "↻ " + item;

        div.addEventListener("click", () => {
            searchInput.value = item;
            suggestions.innerHTML = "";
        });

        suggestions.appendChild(div);
    }
}

searchInput.addEventListener("input", () => {
    updateSuggestions(searchInput.value);
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

//フォーカスしたら表示するよ
searchInput.addEventListener("focus", () => {
    updateSuggestions(searchInput.value);
});

//外をクリックしたら閉じるよ
document.addEventListener("click", (e) => {
    if (!searchForm.contains(e.target)) {
        suggestions.innerHTML = "";
    }
});