const API_BASE_URL = "http://localhost:3001";

async function fetchGallery() {
    const galleryId = window.location.pathname.split("/").pop();

    console.log("Fetching gallery for ID:", galleryId);
    if (!galleryId) {
        document.body.innerHTML = "<h1>Gallery image not found</h1>";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/galleries/${galleryId}`);
        console.log("API URL:", `${API_BASE_URL}/api/galleries/${galleryId}`);
        if (!response.ok) throw new Error("Failed to fetch gallery image");

        const gallery = await response.json();
        console.log("📸 Fetched gallery:", gallery);

        document.getElementById("gallery-title").textContent = gallery.title;
        document.getElementById("gallery-date").textContent = new Date(gallery.createdAt).toLocaleDateString();
        document.getElementById("gallery-image").src = gallery.imageUrl || "images/default-image.jpg";
    } catch (error) {
        console.error(error);
        document.body.innerHTML = "<h1>Failed to load gallery image</h1>";
    }
}

// public/js/gallery.js
document.addEventListener("DOMContentLoaded", async () => {
    // 1) Grab the ID from the URL: /galleries/view/<ID>
    const parts = window.location.pathname.split("/");
    const galleryId = parts[parts.length - 1];
    console.log("🔍 galleryId =", galleryId);
  
    if (!galleryId) {
      document.body.innerHTML = "<h1>Gallery image not found</h1>";
      return;
    }
  
    try {
      // 2) Use a relative URL so it’s same-origin: no CORS needed
      const res = await fetch(`/api/galleries/${galleryId}`);
      console.log("📡 fetching", `/api/galleries/${galleryId}`, "– ok?", res.ok);
  
      if (!res.ok) throw new Error(`Status ${res.status}`);
  
      const gallery = await res.json();
      console.log("📸 gallery data:", gallery);
  
      document.getElementById("gallery-title").textContent = gallery.title;
      document.getElementById("gallery-date").textContent =
        new Date(gallery.createdAt).toLocaleString();
      document.getElementById("gallery-image").src = gallery.imageUrl;
    } catch (err) {
      console.error("❌ load error:", err);
      document.body.innerHTML = "<h1>Failed to load gallery image</h1>";
    }
  });
  
document.addEventListener("DOMContentLoaded", fetchGallery);
