const API_BASE_URL = "http://localhost:3000";

async function fetchReview() {
    const urlParams = new URLSearchParams(window.location.search);
    const reviewId = urlParams.get("id");

    if (!reviewId) {
        document.body.innerHTML = "<h1>Review not found</h1>";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`);
        if (!response.ok) throw new Error("Failed to fetch review");

        const review = await response.json();
        
        document.getElementById("review-title").textContent = review.title;
        document.getElementById("review-image").src = review.image || "images/default-image.jpg";
        document.getElementById("review-author").textContent = review.author;
        document.getElementById("review-category").textContent = review.category;
        document.getElementById("review-date").textContent = new Date(review.createdAt).toLocaleDateString();
        document.getElementById("review-rating").textContent = review.rating;
        document.getElementById("review-content").textContent = review.content;
    } catch (error) {
        console.error(error);
        document.body.innerHTML = "<h1>Failed to load review</h1>";
    }
}

document.addEventListener("DOMContentLoaded", fetchReview);
