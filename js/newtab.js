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