const musicFile = document.getElementById("musicFile");
const player = document.getElementById("player");

musicFile.addEventListener("change", () => {
    const file = musicFile.files[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    player.src = url;

    musicTitle.textContent =
    file.name.replace(/\.[^/.]+$/, "");

    player.play();
});

const musicVolume = document.getElementById("musicVolume");

musicVolume.addEventListener("input", () => {
    player.volume = musicVolume.value / 100;
});

musicVolume.addEventListener("change", () => {
    chrome.storage.local.set({
        musicVolume: musicVolume.value
    });
});

chrome.storage.local.get(
    ["musicVolume"],
    (data) => {

        const volume = data.musicVolume ?? 100;

        musicVolume.value = volume;
        player.volume = volume / 100;

    }
);