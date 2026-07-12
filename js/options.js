const showClock = document.getElementById("showClock");
const showSeconds = document.getElementById("showSeconds");
const showDate = document.getElementById("showDate");
const input = document.getElementById("backgroundFile");
const showShortcuts = document.getElementById("showShortcuts");

const shortcutList = document.getElementById("shortcut-list");
const addShortcut = document.getElementById("addShortcut");

const saveShortcuts = document.getElementById("saveShortcuts");


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

chrome.storage.local.get(
    ["showClock", "showSeconds", "showDate", "showShortcuts"],
    (data) => {
        showClock.checked = data.showClock ?? true;
        showSeconds.checked = data.showSeconds ?? true;
        showDate.checked = data.showDate ?? true;
        showShortcuts.checked = data.showShortcuts ?? true;
    }
);

input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        chrome.storage.local.set({
            backgroundImage: reader.result
        });
        console.log("保存するよ！");
        console.log(reader.result);
    };

    reader.readAsDataURL(file);
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
    nameInput.value = name;4

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
            !url.startsWith("https://")) {
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
        backgroundImage: null,
        widgetColor: null,
        widgetOpacity: null
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