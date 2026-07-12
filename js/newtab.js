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


//themeColor
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `${r}, ${g}, ${b}`;
}

chrome.storage.local.get(
    ["widgetColor", "widgetOpacity"],
    (data) => {

        const color = data.widgetColor ?? "#282828";
        const opacity = (data.widgetOpacity ?? 40) / 100;

        document.documentElement.style.setProperty(
            "--widget-bg",
            `rgba(${hexToRgb(color)}, ${opacity})`
        );
    }
);

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    chrome.storage.local.get(
        ["widgetColor", "widgetOpacity"],
        (data) => {

            const color = data.widgetColor ?? "#282828";
            const opacity = (data.widgetOpacity ?? 40) / 100;

            document.documentElement.style.setProperty(
                "--widget-bg",
                `rgba(${hexToRgb(color)}, ${opacity})`
            );
        }
    );
});

//font
chrome.storage.local.get(["font"], (data) => {

    document.documentElement.style.setProperty(
        "--font",
        data.font ?? "yomogi"
    );

});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.font) return;

    document.documentElement.style.setProperty(
        "--font",
        changes.font.newValue
    );
});