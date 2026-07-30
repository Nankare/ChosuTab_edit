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

        await chrome.storage.local.set({
            backgroundImage: image
        });

        console.log("背景を保存しました");
    };

    reader.readAsDataURL(file);
});

resetBG.addEventListener("click", async () => {

    const result = confirm("背景を初期化します。よろしいですか？");

    if (result) {
        await chrome.storage.local.set({
            backgroundImage: null
        });

        alert("背景を初期化しました");
    } else {
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

// title,いらねやつだから消す
//    const title = document.createElement("h3");
//    title.textContent = "ショートカット";
//
//    div.appendChild(title);

    //nameInput
    const nameInput = document.createElement("input");

    nameInput.type = "text";
    nameInput.placeholder = "名前";
    nameInput.value = name;

    nameInput.name = "shortcutName"

    div.appendChild(nameInput); 

    //urlInput
    const urlInput = document.createElement("input");

    urlInput.type = "url";
    urlInput.placeholder = "https://example.com";
    urlInput.value = url;

    urlInput.name = "shortcutURL"

    div.appendChild(urlInput);

    // 削除ボタン
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "🗑️削除";

    deleteButton.addEventListener("click", () => {
        div.remove();
    });

    div.appendChild(deleteButton);

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

    const storage = await chrome.storage.local.get();

    const exportData = {
        format: "ChosuTab_ExportFile",
        format_version: 1,
        settings: storage
    };

    const json = JSON.stringify(exportData, null, 2);

    const blob = new Blob(
        [json],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ChosuTab-backup.json";
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
        const data = JSON.parse(reader.result);
        let settings;

        if (data.format === "ChosuTab_ExportFile") {
            // 新形式
            settings = data.settings;

            if (!settings) {
                console.log("settingsがありません", data);
                alert("設定データがありません");
                return;
            }

        } else {
            // 旧形式
            settings = data;
            alert("旧形式のフォーマットです。バックアップの再作成を推奨します。");
        }

        // whitelist(キー追加したらホワリスも追加すること)
        const allowedKeys = [
            "backgroundImage",
            "font",
            "memo",
            "musicVolume",
            "searchEngine",
            "searchHistory",
            "shortcuts",
            "showClock",
            "showDate",
            "showGreeting",
            "showMemo",
            "showMusic",
            "showSeconds",
            "showShortcuts",
            "showTip",
            "widgetColor",
            "widgetOpacity"
        ];

        const filteredSettings = {};

        for (const key of allowedKeys) {
            if (settings[key] !== undefined) {
                filteredSettings[key] = settings[key];
            }
        }

        // ChosuTabの設定が1つもない
        if (Object.keys(filteredSettings).length === 0) {
            alert("ちょすたぶのExportファイルではありません");
            return;
        }

        const result = confirm(
            "現在の設定をインポートした設定で上書きします。よろしいですか？"
        );

        if (!result) {
            console.log("Importキャンセル");
            return;
        }


        await chrome.storage.local.clear();
        await chrome.storage.local.set(filteredSettings);

        alert("設定を上書きしました！");
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