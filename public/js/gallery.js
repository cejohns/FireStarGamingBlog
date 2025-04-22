const API_BASE_URL = "http://localhost:3001";

async function fetchGallery() {
    const urlParams = new URLSearchParams(window.location.search);
    const galleryId = urlParams.get("id");

    if (!galleryId) {
        document.body.innerHTML = "<h1>Gallery image not found</h1>";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/galleries/${galleryId}`);
        if (!response.ok) throw new Error("Failed to fetch gallery image");

        const gallery = await response.json();

        document.getElementById("gallery-title").textContent = gallery.title;
        document.getElementById("gallery-date").textContent = new Date(gallery.createdAt).toLocaleDateString();
        document.getElementById("gallery-image").src = gallery.imageUrl || "images/default-image.jpg";
    } catch (error) {
        console.error(error);
        document.body.innerHTML = "<h1>Failed to load gallery image</h1>";
    }
}

document.addEventListener("DOMContentLoaded", fetchGallery);
