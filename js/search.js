const form = document.getElementById("search-form");
const box = document.getElementById("search-box");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = box.value.trim();

    if (!query) return;

    window.location.href =
        `https://www.google.com/search?q=${encodeURIComponent(query)}`;
});