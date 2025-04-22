const API_BASE_URL = "http://localhost:3001";

async function fetchTutorial() {
    const urlParams = new URLSearchParams(window.location.search);
    const tutorialId = urlParams.get("id");

    if (!tutorialId) {
        document.body.innerHTML = "<h1>Tutorial not found</h1>";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/tutorials/${tutorialId}`);
        if (!response.ok) throw new Error("Failed to fetch tutorial");

        const tutorial = await response.json();

        document.getElementById("tutorial-title").textContent = tutorial.title;
        document.getElementById("tutorial-author").textContent = tutorial.author;
        document.getElementById("tutorial-category").textContent = tutorial.category;
        document.getElementById("tutorial-date").textContent = new Date(tutorial.createdAt).toLocaleDateString();
        document.getElementById("tutorial-content").textContent = tutorial.content;
    } catch (error) {
        console.error(error);
        document.body.innerHTML = "<h1>Failed to load tutorial</h1>";
    }
}

document.addEventListener("DOMContentLoaded", fetchTutorial);
