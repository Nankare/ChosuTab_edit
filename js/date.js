function updateDate() {
    const now = new Date();

    const date =
        now.getFullYear() + "/" +
        (now.getMonth() + 1) + "/" +
        now.getDate();

    document.getElementById("date").textContent = date;
}

updateDate();