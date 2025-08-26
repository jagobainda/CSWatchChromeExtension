document.getElementById("github-btn").addEventListener("click", async () => {
    await chrome.tabs.create({
        url: "https://github.com/tu-repo"
    });
});
