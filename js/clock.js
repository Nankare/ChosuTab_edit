function updateClock() {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").textContent =
        showSeconds
            ? `${h}:${m}:${s}`
            : `${h}:${m}`;
}

let showSeconds = true;

    chrome.storage.local.get(["showSeconds"], (data) => {
        showSeconds = data.showSeconds ?? true;
        updateClock();
    });

    chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    if (changes.showSeconds) {
        showSeconds = changes.showSeconds.newValue;
            updateClock();
        }
    });

setInterval(updateClock, 1000);