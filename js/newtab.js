let showClock = true;
    chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.showClock) return;

    document.querySelector(".clock-widget").style.display =
        changes.showClock.newValue ? "" : "none";
    
    });

chrome.storage.local.get(["backgroundImage"], (data) => {
    console.log(data);

    const bg = document.getElementById("background");

    if (data.backgroundImage) {
        bg.style.backgroundImage = `url("${data.backgroundImage}")`;
    } else {
        // デフォルト画像
        bg.style.backgroundImage = 'url("/img/background.png")';
    }
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    if (changes.backgroundImage) {
        document.getElementById("background").style.backgroundImage =
            `url("${changes.backgroundImage.newValue}")`;
    }
});

// ① 要素を取得
const shortcutsContainer = document.getElementById("shortcuts");

// ② 初回読み込み
chrome.storage.local.get(["showShortcuts"], (data) => {
    console.log("showShortcuts =", data.showShortcuts);

    shortcutsContainer.hidden = !(data.showShortcuts ?? true);

    console.log("hidden =", shortcutsContainer.hidden);
});

// ③ 設定が変わったら即反映
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    if (changes.showShortcuts) {
        console.log(changes.showShortcuts.newValue);
        shortcutsContainer.hidden = !changes.showShortcuts.newValue;
    }
});

chrome.storage.local.get(["showDate"], (data) => {
    document.getElementById("date").style.display =
        (data.showDate ?? true) ? "" : "none";
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.showDate) return;

    document.getElementById("date").style.display =
        changes.showDate.newValue ? "" : "none";
});
