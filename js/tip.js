const tips = [
    "Tips: Ctrl + Shift + Tで閉じたタブを復元できます。",
    "Tips: F11で全画面表示になります。",
    "Tips: ChromeではCtrl + Lでアドレスバーへ移動できます。",
    "Tips: Ctrl + Shift + EscでChromeのタスクマネージャーが開けます。",
    "この拡張機能はMade with ❤️"
];

const random = tips[Math.floor(Math.random() * tips.length)];

document.getElementById("tip").textContent = random;