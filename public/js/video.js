const API_BASE_URL = "http://localhost:3000";

async function fetchVideo() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("id");

    if (!videoId) {
        document.body.innerHTML = "<h1>Video not found</h1>";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}`);
        if (!response.ok) throw new Error("Failed to fetch video");

        const video = await response.json();

        document.getElementById("video-title").textContent = video.title;
        document.getElementById("video-date").textContent = new Date(video.createdAt).toLocaleDateString();
        const videoElement = document.getElementById("video-player");
        videoElement.src = video.videoUrl;
        videoElement.load();
    } catch (error) {
        console.error(error);
        document.body.innerHTML = "<h1>Failed to load video</h1>";
    }
}

document.addEventListener("DOMContentLoaded", fetchVideo);
