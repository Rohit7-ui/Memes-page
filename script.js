document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const memeContainer = document.getElementById("memeContainer");
    const loadMoreBtn = document.getElementById("loadMore");
    const filters = document.querySelectorAll(".filter");
    const uploadMeme = document.getElementById("uploadMeme");
    const memeCanvas = document.getElementById("memeCanvas");
    const memeCaption = document.getElementById("memeCaption");
    const generateCaption = document.getElementById("generateCaption");
    const downloadMeme = document.getElementById("downloadMeme");
    
    let memeCategory = "trending";
    let allMemes = [];
    let page = 1;
    let isFetching = false;
    
    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
    });
    
    filters.forEach(button => {
        button.addEventListener("click", (event) => {
            memeCategory = event.target.dataset.category;
            page = 1;
            memeContainer.innerHTML = "";
            displayMemes(filterMemes(memeCategory));
        });
    });
    
    async function fetchMemes() {
        if (isFetching) return;
        isFetching = true;
        
        try {
            const response = await fetch("https://api.imgflip.com/get_memes");
            const data = await response.json();
            
            if (data.success) {
                allMemes = data.data.memes;
                displayMemes(filterMemes(memeCategory));
            }
        } catch (error) {
            console.error("Error fetching memes:", error);
        } finally {
            isFetching = false;
        }
    }
    
    function filterMemes(category) {
        switch (category) {
            case "trending":
                return [...allMemes].sort((a, b) => b.width - a.width).slice(0, 10);
            case "new":
                return allMemes.slice(-10);
            case "classic":
                return allMemes.filter(meme => meme.name.toLowerCase().includes("drake") || meme.name.toLowerCase().includes("distracted"));
            case "random":
                return allMemes.sort(() => 0.5 - Math.random()).slice(0, 10);
            default:
                return allMemes.slice(0, 10);
        }
    }
    
    function displayMemes(memes) {
        memeContainer.innerHTML = "";
        memes.forEach(meme => {
            const memeElement = document.createElement("div");
            memeElement.classList.add("meme");
            memeElement.innerHTML = `<img src="${meme.url}" alt="${meme.name}">`;
            memeContainer.appendChild(memeElement);
        });
    }
    
    loadMoreBtn.addEventListener("click", () => {
        page++;
        displayMemes(filterMemes(memeCategory).slice(0, page * 10));
    });
    
    fetchMemes();
});
