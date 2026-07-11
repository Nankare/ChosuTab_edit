const shortcuts = [
    {
        name: "YouTube",
        url: "https://www.youtube.com"
    },
    {
        name: "X",
        url: "https://x.com"
    },
    {
        name: "Gmail",
        url: "https://gmail.com"
    },
    {
        name: "ChatGPT",
        url: "https://chatgpt.com"
    },
];

const container = document.getElementById("shortcuts");

for (const shortcut of shortcuts) {
    const host = new URL(shortcut.url).hostname;

    const a = document.createElement("a");
    a.href = shortcut.url;
    a.target = "_blank";

    const img = document.createElement("img");
    img.src = `https://www.google.com/s2/favicons?domain=${host}&sz=16`;

    const span = document.createElement("span");
    span.textContent = shortcut.name;

    a.append(img, span);
    container.appendChild(a);
}