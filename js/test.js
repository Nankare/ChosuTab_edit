fetch("https://suggestqueries.google.com/complete/search?client=chrome&q=helloworld!")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("サジェスト取得成功、Google候補:", data[1]);
    })
    .catch(error => {
        console.error("Googleサジェスト取得失敗:", error);
    });