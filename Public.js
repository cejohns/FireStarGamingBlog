const API_BASE_URL = "http://localhost:3000";

async function fetchContent(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found in index.html!`);
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/${type}`);
        if (!response.ok) throw new Error(`Failed to fetch ${type}`);

        const data = await response.json();

        container.innerHTML = data.length
            ? data.map(item => `
                <div class="${type}-preview">
                    <h3>${item.title}</h3>
                    <p><strong>Author:</strong> ${item.author}</p>
                    <p><strong>Category:</strong> ${item.category}</p>
                    <p><strong>Published On:</strong> ${new Date(item.publishedAt).toLocaleDateString()}</p>
                    <p>${item.summary}</p>
                </div>
            `).join("")
            : `<p>No published ${type} available.</p>`;

    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
    }
}

// ✅ Load published posts when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchContent("posts", "posts-container");
    fetchContent("reviews", "home-reviews-container");
    fetchContent("tutorials", "tutorials-container");
    fetchContent("galleries", "galleries-container");
    fetchContent("videos", "videos-container");
});



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



// ✅ Fetch and display published videos
async function fetchPublishedVideos() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/videos`);
        if (!response.ok) throw new Error("Failed to fetch videos");

        const videos = await response.json();
        const container = document.getElementById("videos-container");

        // Filter only approved videos
        const approvedVideos = videos.filter(video => video.approved);

        container.innerHTML = approvedVideos.length
            ? approvedVideos.map(video => `
                <div class="video-preview">
                    <h3>${video.title}</h3>
                    <video width="320" height="240" controls>
                        <source src="${API_BASE_URL}${video.videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `).join("")
            : "<p>No approved videos available.</p>";
    } catch (error) {
        console.error("Error fetching videos:", error);
    }
}

// ✅ Fetch and display published gallery images
async function fetchPublishedGalleries() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/galleries`);
        if (!response.ok) throw new Error("Failed to fetch galleries");

        const galleries = await response.json();
        const container = document.getElementById("galleries-container");

        // Filter only approved gallery images
        const approvedGalleries = galleries.filter(image => image.approved);

        container.innerHTML = approvedGalleries.length
            ? approvedGalleries.map(image => `
                <div class="gallery-preview">
                    <h3>${image.title}</h3>
                    <img src="${API_BASE_URL}${image.imageUrl}" alt="${image.title}" width="200">
                </div>
            `).join("")
            : "<p>No approved gallery images available.</p>";
    } catch (error) {
        console.error("Error fetching galleries:", error);
    }
}

// ✅ Load all content on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchPublishedVideos();
    fetchPublishedGalleries();
});


document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("tutorials-container")) fetchPublishedContent("tutorials", "tutorials-container");
    if (document.getElementById("posts-container")) fetchPublishedContent("posts", "posts-container");
});

document.addEventListener("DOMContentLoaded", () => {
    loadPublishedContent("reviews", "home-reviews-container");
    loadPublishedContent("tutorials", "tutorials-container");
    loadPublishedContent("galleries", "galleries-container");
    loadPublishedContent("videos", "videos-container");
});

// ✅ Load stored data from `localStorage`
function loadPublishedContent(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found in index.html!`);
        return;
    }

    let publishedItems = JSON.parse(localStorage.getItem(`${type}-published`)) || [];

    container.innerHTML = publishedItems.length
        ? publishedItems.map(item => `
            <div class="${type}-preview">
                <h3>${item.title}</h3>
                <p><strong>Author:</strong> ${item.author}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Published On:</strong> ${new Date(item.publishedAt).toLocaleDateString()}</p>
                <p>${item.summary}</p>
            </div>
        `).join("")
        : `<p>No approved ${type} available.</p>`;
}
