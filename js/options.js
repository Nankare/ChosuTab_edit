const showClock = document.getElementById("showClock");
const showSeconds = document.getElementById("showSeconds");
const showDate = document.getElementById("showDate");
const showGreeting = document.getElementById("showGreeting");
const showTip = document.getElementById("showTip");
const input = document.getElementById("backgroundFile");
const showMemo  = document.getElementById("showMemo");

const shortcutList = document.getElementById("shortcut-list");
const addShortcut = document.getElementById("addShortcut");

const saveShortcuts = document.getElementById("saveShortcuts");
const showMusic = document.getElementById("showMusic");

showClock.addEventListener("change", () => {
    chrome.storage.local.set({
        showClock: showClock.checked
    });
});

showSeconds.addEventListener("change", () => {
    chrome.storage.local.set({
        showSeconds: showSeconds.checked
    });
});

showDate.addEventListener("change", () => {
    chrome.storage.local.set({
        showDate: showDate.checked
    });
});

showGreeting.addEventListener("change", () => {
    chrome.storage.local.set({
        showGreeting: showGreeting.checked
    });
});

showTip.addEventListener("change", () => {
    chrome.storage.local.set({
        showTip: showTip.checked
    });
});

showMemo.addEventListener("change", () => {
    chrome.storage.local.set({
        showMemo: showMemo.checked
    });
});

chrome.storage.local.get(
    [
        "showClock",
        "showSeconds",
        "showDate",
        "showShortcuts",
        "showGreeting",
        "showTip",
        "showMemo",
        "showMusic"
    ],
    (data) => {
        showClock.checked = data.showClock ?? true;
        showSeconds.checked = data.showSeconds ?? true;
        showDate.checked = data.showDate ?? true;
        showShortcuts.checked = data.showShortcuts ?? true;
        showGreeting.checked = data.showGreeting ?? true;
        showTip.checked = data.showTip ?? true;
        showMemo.checked = data.showMemo ?? true;
        showMusic.checked = data.showMusic ?? true;
    }
);

input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {

        const image = reader.result;

        const data = await chrome.storage.local.get("backgroundImages");
        const images = data.backgroundImages || [];

        // 重複防止
        if (images.includes(image)) {
            console.log("この画像は既に登録されています");
            return;
        }

        // 追加
        images.push(image);

        // 最大5枚まで（古いものから削除）
        while (images.length > 5) {
            images.shift();
        }

        await chrome.storage.local.set({
            backgroundImage: image,
            backgroundImages: images
        });

        console.log(`背景を保存しました！（現在${images.length}枚）`);
    };

    reader.readAsDataURL(file);
});

resetBG.addEventListener("click", () => {

    const result = confirm("背景を初期化します。よろしいですか？");

    if (result) {
        // OK（Yes）が押された
        chrome.storage.local.set({
        backgroundImage: null,
        backgroundImages: null
        });
        alert("背景を初期化しました。")
    } else {
        // キャンセル（No）が押された
        console.log("背景リセットキャンセル");
    }

});

showShortcuts.addEventListener("change", () => {
    chrome.storage.local.set({
        showShortcuts: showShortcuts.checked
    });
});

function createShortcutEditor(name = "", url = "") {

    const div = document.createElement("div");
    div.className = "shortcut-setting";

    shortcutList.appendChild(div);

    //title
    const title = document.createElement("h3");
    title.textContent = "ショートカット";

    div.appendChild(title);

    //nameInput
    const nameInput = document.createElement("input");

    nameInput.type = "text";
    nameInput.placeholder = "名前";
    nameInput.value = name;

    div.appendChild(nameInput); 

    //urlInput
    const urlInput = document.createElement("input");

    urlInput.type = "url";
    urlInput.placeholder = "https://example.com";
    urlInput.value = url;

    div.appendChild(urlInput);

    //実行
    shortcutList.appendChild(div);
}

//ロード
chrome.storage.local.get(["shortcuts"], (data) => {

    const shortcuts = data.shortcuts ?? [];

    for (const shortcut of shortcuts) {
        createShortcutEditor(
            shortcut.name,
            shortcut.url
        );
    }

});

//入力欄の追加
addShortcut.addEventListener("click", () => {
    createShortcutEditor("", "");
});


//保存
saveShortcuts.addEventListener("click", () => {

    const editors = document.querySelectorAll(".shortcut-setting");
    const shortcuts = [];

    for (const editor of editors) {
        const inputs = editor.querySelectorAll("input");

        let url = inputs[1].value.trim();

        if (url !== "" &&
            !url.startsWith("http://") &&
            !url.startsWith("https://") //&&
            //!url.startsWith("chrome://")
            ){
            alert("URLはhttp://またはhttps://から入力してください");
            return;
            }

        shortcuts.push({
            name: inputs[0].value,
            url: url,
        });
    }

    chrome.storage.local.set({
        shortcuts: shortcuts.filter(shortcut => shortcut.url !== "")
    });

    const result = shortcuts.filter(s => s.url !== "");

    chrome.storage.local.set({
        shortcuts: result.length ? result : null
    });

});

//初期化
clearShortcuts.addEventListener("click", () => {

    const result = confirm("初期化しますか？");

    if (result) {
        // OK（Yes）が押された
        console.log("初期化する");
        chrome.storage.local.set({
        showClock:null,
        showSeconds:null,
        shortcuts: null,
        widgetColor: null,
        widgetOpacity: null,
        font: null,
        backgroundImage: null,
        backgroundImages: null,
        showDate: null,
        showGreeting: null,
        showTip:null,
        showShortcuts: null,
        showMemo:null,
        showMusic:null,
        });
        alert("初期化したのでページを更新してね")
    } else {
        // キャンセル（No）が押された
        console.log("キャンセル");
    }

});

//theme
//color
const widgetColor = document.getElementById("widgetColor");
const widgetOpacity = document.getElementById("widgetOpacity");

widgetColor.addEventListener("change", saveWidgetStyle);
widgetOpacity.addEventListener("input", saveWidgetStyle);

function saveWidgetStyle() {
    chrome.storage.local.set({
        widgetColor: widgetColor.value,
        widgetOpacity: widgetOpacity.value
    });
}

chrome.storage.local.get(
    ["widgetColor", "widgetOpacity"],
    (data) => {

        widgetColor.value =
            data.widgetColor ?? "#282828";

        widgetOpacity.value =
            data.widgetOpacity ?? 40;
    }
);

//font
const font = document.getElementById("font");

font.addEventListener("change", () => {
    chrome.storage.local.set({
        font: font.value
    });
});

chrome.storage.local.get(["font"], (data) => {

    const selectedFont = data.font ?? "yomogi";

    font.value = selectedFont;

});

//jsonexport
const exportSettings = document.getElementById("exportSettings");

exportSettings.addEventListener("click", async () => {
    const settings = await chrome.storage.local.get();

    const json = JSON.stringify(settings, null, 2);

    const blob = new Blob(
        [json],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Chosutab-backup.json";
    a.click();

    URL.revokeObjectURL(url);
});

//import
const importSettings = document.getElementById("importSettings");
const fileInput = document.getElementById("settingsFile");

importSettings.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
        try {
            const settings = JSON.parse(reader.result);

            await chrome.storage.local.set(settings);

            alert("設定を復元しました！");
            location.reload();

        } catch (e) {
            alert("無効なJSONファイルです");
            console.error(e);
        }
    };

    reader.readAsText(file);
});

const searchEngine = document.getElementById("searchEngine");

// 保存
searchEngine.addEventListener("change", () => {
    chrome.storage.local.set({
        searchEngine: searchEngine.value
    });
});

// 読み込み
chrome.storage.local.get(["searchEngine"], (data) => {
    searchEngine.value = data.searchEngine ?? "google";
});

//検索履歴
const clearSearchHistory =
    document.getElementById("clearSearchHistory");

clearSearchHistory.addEventListener("click", async () => {

    const result = confirm(
        "検索履歴をすべて削除しますか？"
    );

    if (result) {
        await chrome.storage.local.set({
            searchHistory: null
        });

        alert("検索履歴を削除しました");
    }

});

//save
showMusic.addEventListener("change", () => {
    chrome.storage.local.set({
        showMusic: showMusic.checked
    });
});