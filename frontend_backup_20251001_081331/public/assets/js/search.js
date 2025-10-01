// Sample data for testing purposes
const articles = [
    {
        id: 1,
        title: "The Rise of Esports",
        category: "video-games",
        date: "2025-01-10",
        popularity: "most-popular",
        thumbnail: "images/esports.jpg",
        description: "An in-depth look at the growing esports industry."
    },
    {
        id: 2,
        title: "Mastering Game Development",
        category: "game-development",
        date: "2025-01-05",
        popularity: "least-popular",
        thumbnail: "images/game-dev.jpg",
        description: "Learn the secrets of successful game development."
    },
    {
        id: 3,
        title: "Top Tech Innovations of 2025",
        category: "new-tech",
        date: "2025-01-12",
        popularity: "most-popular",
        thumbnail: "images/tech.jpg",
        description: "Discover the top tech trends shaping the future."
    }
];

// Function to display articles
function displayArticles(filteredArticles) {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "";

    if (filteredArticles.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    filteredArticles.forEach(article => {
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("article");

        articleDiv.innerHTML = `
            <img src="${article.thumbnail}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="#">Read More</a>
        `;

        resultsContainer.appendChild(articleDiv);
    });
}

// Function to handle search
function handleSearch() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query)
    );
    displayArticles(filteredArticles);
}

// Function to apply filters
function handleFilters(event) {
    event.preventDefault();

    const category = document.getElementById("category").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const popularity = document.getElementById("popularity").value;

    let filteredArticles = articles;

    if (category !== "all") {
        filteredArticles = filteredArticles.filter(article => article.category === category);
    }

    if (startDate) {
        filteredArticles = filteredArticles.filter(article => new Date(article.date) >= new Date(startDate));
    }

    if (endDate) {
        filteredArticles = filteredArticles.filter(article => new Date(article.date) <= new Date(endDate));
    }

    if (popularity !== "all") {
        filteredArticles = filteredArticles.filter(article => article.popularity === popularity);
    }

    displayArticles(filteredArticles);
}

// Event listeners
document.getElementById("search-input").addEventListener("input", handleSearch);
document.getElementById("filter-form").addEventListener("submit", handleFilters);

// Initial display
displayArticles(articles);
