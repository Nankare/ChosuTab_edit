
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

let selectedSuggestionIndex = -1;
let suggestionRequestId = 0;
let suggestionController = null;

function resetSuggestionSelection() {
    selectedSuggestionIndex = -1;
    updateSuggestionSelection();
}

function updateSuggestionSelection() {
    const items = suggestions.querySelectorAll(".suggestion");

    items.forEach((item, index) => {
        const selected = index === selectedSuggestionIndex;

        item.classList.toggle("selected", selected);

        if (selected) {
            item.setAttribute("aria-selected", "true");
        } else {
            item.setAttribute("aria-selected", "false");
        }
    });
}

// 検索履歴を保存
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

// Googleサジェストを取得
async function fetchGoogleSuggestions(query, signal) {
    const url =
        "https://suggestqueries.google.com/complete/search" +
        "?client=chrome&q=" + encodeURIComponent(query);

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Google suggestions: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || !Array.isArray(data[1])) {
        throw new Error("Google suggestions: Invalid response");
    }

    return data[1].filter(item => typeof item === "string");
}

// 候補一覧を更新
async function updateSuggestions(query = "") {
    const requestId = ++suggestionRequestId;
    selectedSuggestionIndex = -1;
    suggestions.innerHTML = "";


    // 前の通信を中断
    suggestionController?.abort();
    suggestionController = null;

    const keyword = query.trim().toLocaleLowerCase();

    const { searchHistory = [] } =
        await chrome.storage.local.get("searchHistory");

    // ストレージ取得中に入力が変わっていたら終了
    if (requestId !== suggestionRequestId) return;

    // 入力が空なら、従来どおり履歴を最大5件表示
    if (!keyword) {
        renderSuggestions(
            [],
            searchHistory.slice(0, 5)
        );
        return;
    }

    let googleCandidates = [];

    // Google候補を取得
    suggestionController = new AbortController();

    try {
        const candidates = await fetchGoogleSuggestions(
            query.trim(),
            suggestionController.signal
        );

        if (requestId !== suggestionRequestId) return;

        googleCandidates = candidates;
    } catch (error) {
        if (error.name !== "AbortError") {
            console.warn("Googleサジェスト取得失敗:", error);
        }
    }

    if (requestId !== suggestionRequestId) return;

    // Google候補は最大3件
    const googleSeen = new Set();

    googleCandidates = googleCandidates
        .map(item => item.trim())
        .filter(item => {
            const key = item.toLocaleLowerCase();

            if (!item || googleSeen.has(key)) return false;

            googleSeen.add(key);
            return true;
        })
        .slice(0, 3);

    // 入力文字列に前方一致する履歴を抽出
    const historyCandidates = searchHistory
        .filter(item =>
            typeof item === "string" &&
            item.toLocaleLowerCase().startsWith(keyword)
        );

    // Google候補と重複しない履歴を最大2件選ぶ
    const seen = new Set(
        googleCandidates.map(item => item.toLocaleLowerCase())
    );

    const history = [];

    for (const item of historyCandidates) {
        const key = item.toLocaleLowerCase();

        if (seen.has(key)) continue;

        seen.add(key);
        history.push(item);

        if (history.length >= 2) break;
    }

    renderSuggestions(googleCandidates, history);
}

function createSuggestion(item, icon) {
    const div = document.createElement("div");
    div.className = "suggestion";

    const label = document.createElement("span");
    label.className = "suggestion-label";
    label.textContent = `${icon} ${item}`;

    const addButton = document.createElement("button");
    addButton.className = "suggestion-add";
    addButton.type = "button";
    addButton.textContent = "↖";
    addButton.title = "検索バーに入力";

    // 候補本体をクリックしたら直接検索
    div.addEventListener("click", () => {
        searchInput.value = item;
        searchForm.requestSubmit();
    });

    // ↖ ボタンは検索バーへの入力だけ
    addButton.addEventListener("click", (e) => {
        e.stopPropagation();
        searchInput.value = item;
        searchInput.focus();
        suggestions.innerHTML = "";
    });

    div.append(label, addButton);
    return div;
}

// 候補一覧を描画
function renderSuggestions(googleCandidates, history) {
    suggestions.innerHTML = "";

    const fragment = document.createDocumentFragment();

    for (const item of googleCandidates) {
        fragment.appendChild(createSuggestion(item, "⌕"));
    }

    for (const item of history) {
        fragment.appendChild(createSuggestion(item, "↻"));
    }

    suggestions.appendChild(fragment);
}

searchInput.addEventListener("keydown", (e) => {
    // 日本語などの変換確定中は操作しない
    if (e.isComposing) return;

    const items = suggestions.querySelectorAll(".suggestion");

    if (e.key === "Escape") {
        suggestions.innerHTML = "";
        resetSuggestionSelection();
        return;
    }

    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();

        selectedSuggestionIndex =
            (selectedSuggestionIndex + 1) % items.length;

        updateSuggestionSelection();
        items[selectedSuggestionIndex].scrollIntoView({
            block: "nearest"
        });
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();

        selectedSuggestionIndex =
            selectedSuggestionIndex <= 0
                ? items.length - 1
                : selectedSuggestionIndex - 1;

        updateSuggestionSelection();
        items[selectedSuggestionIndex].scrollIntoView({
            block: "nearest"
        });
    }

    if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        items[selectedSuggestionIndex].click();
    }
});

// 入力時に候補を更新
searchInput.addEventListener("input", () => {
    updateSuggestions(searchInput.value);
});

// 検索を実行
searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    if (!query) return;

    await saveSearchHistory(query);

    // URLとして扱えるか判定
    let targetUrl = null;

    try {
        const candidate = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(query)
            ? new URL(query)
            : !/\s/.test(query) && query.includes(".")
                ? new URL(`https://${query}`)
                : null;

        if (
            candidate &&
            ["http:", "https:"].includes(candidate.protocol) &&
            candidate.hostname.includes(".")
        ) {
            targetUrl = candidate.href;
        }
    } catch {
        // URLとして不正なら通常検索へ
    }

    if (targetUrl) {
        location.href = targetUrl;
        return;
    }

    // 従来の検索エンジン設定を維持
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
        encodeURIComponent(query);

    location.href = url;
});

// フォーカスしたら表示
searchInput.addEventListener("focus", () => {
    updateSuggestions(searchInput.value);
});

// 外をクリックしたら閉じる
document.addEventListener("click", (e) => {
    if (!searchForm.contains(e.target) &&
        !suggestions.contains(e.target)) {
        suggestions.innerHTML = "";
    }
});