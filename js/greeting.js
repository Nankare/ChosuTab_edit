const hour = new Date().getHours();

let greeting;

if (hour < 5) {
    greeting = "夜更かしですね🌙";
} else if (hour < 11) {
    greeting = "おはようございます！";
} else if (hour < 18) {
    greeting = "こんにちは！";
} else {
    greeting = "こんばんは！";
}

document.getElementById("greeting").textContent = greeting;