const API_BASE_URL = "http://localhost:3000";

// Fetch and render published reviews
async function fetchPublishedReviews() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews`);
        const reviews = await response.json();
        const container = document.getElementById("reviews-container");

        container.innerHTML = reviews
            .filter(review => review.published)
            .map(review => `
                <div>
                    <h3>${review.title}</h3>
                    <p><strong>Author:</strong> ${review.author}</p>
                    <p><strong>Category:</strong> ${review.category}</p>
                    <p>${review.content}</p>
                </div>
            `).join("");
    } catch (error) {
        console.error("Error fetching published reviews:", error);
    }
}

// Fetch and render published tutorials
async function fetchPublishedTutorials() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tutorials`);
        const tutorials = await response.json();
        const container = document.getElementById("tutorials-container");

        container.innerHTML = tutorials
            .filter(tutorial => tutorial.published)
            .map(tutorial => `
                <div>
                    <h3>${tutorial.title}</h3>
                    <p><strong>Author:</strong> ${tutorial.author}</p>
                    <p><strong>Category:</strong> ${tutorial.category}</p>
                    <p>${tutorial.content}</p>
                </div>
            `).join("");
    } catch (error) {
        console.error("Error fetching published tutorials:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchPublishedReviews();
    fetchPublishedTutorials();
});
