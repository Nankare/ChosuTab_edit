let showClock = true;
    chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.showClock) return;

    document.querySelector(".clock-widget").style.display =
        changes.showClock.newValue ? "" : "none";
    
    });

//BG
const bg = document.getElementById("background"); // ← あなたの要素に合わせて変更

async function loadBackground() { //設定を反映させる

    const data = await chrome.storage.local.get([
        "backgroundImage",
        "backgroundImages"
    ]);

    let image = null;

    if (data.backgroundImages?.length) {

        const images = data.backgroundImages;

        image = images[Math.floor(Math.random() * images.length)];

    } else if (data.backgroundImage) {

        image = data.backgroundImage;

    }

    bg.style.backgroundImage = image
        ? `url("${image}")`
        : 'url("/img/background.webp")';
}

loadBackground();//上のfunctionを読む=設定反映

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    if (changes.backgroundImage || changes.backgroundImages) {
        loadBackground();
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

chrome.storage.local.get(["showGreeting"], (data) => {
    document.getElementById("greeting").style.display =
        (data.showGreeting ?? true) ? "" : "none";
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.showGreeting) return;

    document.getElementById("greeting").style.display =
        changes.showGreeting.newValue ? "" : "none";
});

chrome.storage.local.get(["showTip"], (data) => {
    document.getElementById("tip").style.display =
        (data.showTip ?? true) ? "" : "none";
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.showTip) return;

    document.getElementById("tip").style.display =
        changes.showTip.newValue ? "" : "none";
});

chrome.storage.local.get(["showMemo"], (data) => {
    document.getElementById("memo").style.display =
        (data.showMemo ?? true) ? "" : "none";
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.showMemo) return;

    document.getElementById("memo").style.display =
        changes.showMemo.newValue ? "" : "none";
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

//memo
const memo = document.getElementById("memo");

// 読み込み
chrome.storage.local.get("memo", (data) => {
    memo.value = data.memo || "";
});

// 保存
memo.addEventListener("input", () => {
    chrome.storage.local.set({
        memo: memo.value
    });
});

const music = document.getElementById("music");

chrome.storage.local.get(
    ["showMusic"],
    (data) => {

        if (data.showMusic ?? true) {
            music.hidden = false;
        } else {
            music.hidden = true;
        }

    }
);

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    if (changes.showMusic) {
        music.hidden = !changes.showMusic.newValue;
    }
});

const selectMusic = document.getElementById("selectMusic");

selectMusic.addEventListener("click", () => {
    musicFile.click();
});