const showClock = document.getElementById("showClock");
const showSeconds = document.getElementById("showSeconds");
const input = document.getElementById("backgroundFile");
const showShortcuts = document.getElementById("showShortcuts");


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

chrome.storage.local.get(
    ["showClock", "showSeconds"],
    (data) => {
        showClock.checked = data.showClock ?? true;
        showSeconds.checked = data.showSeconds ?? true;
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

chrome.storage.local.get(["showShortcuts"], (data) => {
    showShortcuts.checked = data.showShortcuts ?? true;
});