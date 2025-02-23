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
async function fetchPublishedContent(type, containerId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${type}`);
        const data = await response.json();

        const container = document.getElementById(containerId);
        container.innerHTML = data.map(item => `
            <div>
              <h3><a href="post.html?id=${item._id}">${item.title}</a></h3>
                <p><strong>Author:</strong> ${item.author}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Published On:</strong> ${new Date(item.publishedAt).toLocaleDateString()}</p>
                <p>${item.summary}</p>
            </div>
        `).join("");
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("tutorials-container")) fetchPublishedContent("tutorials", "tutorials-container");
    if (document.getElementById("posts-container")) fetchPublishedContent("posts", "posts-container");
});