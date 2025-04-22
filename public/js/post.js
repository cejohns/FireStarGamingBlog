const API_BASE_URL = "http://localhost:3001";

async function fetchPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        document.body.innerHTML = "<h1>Post not found</h1>";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post");

        const post = await response.json();

        document.getElementById("post-title").textContent = post.title;
        document.getElementById("post-author").textContent = post.author;
        document.getElementById("post-category").textContent = post.category;
        document.getElementById("post-date").textContent = new Date(post.createdAt).toLocaleDateString();
        document.getElementById("post-content").textContent = post.content;
    } catch (error) {
        console.error(error);
        document.body.innerHTML = "<h1>Failed to load post</h1>";
    }
}

document.addEventListener("DOMContentLoaded", fetchPost);
