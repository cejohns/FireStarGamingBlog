const API_BASE_URL = "https://localhost:3001"; // Use HTTP if HTTPS causes issues

// ✅ Generic Fetch Function for All Content Types
async function fetchContent(type, containerId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${type}`);
        if (!response.ok) throw new Error(`Failed to fetch ${type}`);

        const data = await response.json();
        renderContent(data, containerId, type);
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        document.getElementById(containerId).innerHTML = `<p>Failed to load ${type}.</p>`;
    }
}

// ✅ Generic Render Function for All Content Types
function renderContent(data, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = data.length ? "" : `<p>No ${type} available.</p>`;

    data.forEach((item) => {
        const element = document.createElement("div");
        element.classList.add(type);

        let contentHtml = `
            <h3>${item.title}</h3>
            <p>${item.summary || item.content || ""}</p>
        `;

        if (type === "reviews") {
            contentHtml += `<p><strong>Rating:</strong> ${item.rating}/10</p>`;
        } else if (type === "galleries") {
            contentHtml += `<img src="${item.imageUrl}" alt="${item.title}" width="200">`;
        } else if (type === "videos") {
            contentHtml += `<video width="320" height="240" controls>
                <source src="${item.videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>`;
        }

        contentHtml += `
            <button class="edit-${type}" data-id="${item._id}">Edit</button>
            <button class="delete-${type}" data-id="${item._id}">Delete</button>
        `;

        element.innerHTML = contentHtml;
        container.appendChild(element);
    });

    // ✅ Attach event listeners for edit and delete buttons
    document.querySelectorAll(`.edit-${type}`).forEach((btn) =>
        btn.addEventListener("click", () => handleEdit(type, btn.dataset.id))
    );
    document.querySelectorAll(`.delete-${type}`).forEach((btn) =>
        btn.addEventListener("click", () => handleDelete(type, btn.dataset.id))
    );
}

// ✅ Generic Add Function for All Content Types
async function addContent(type, postData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        });

        if (!response.ok) throw new Error("Failed to add " + type);

        alert(`${type} added successfully!`);
        fetchContent(type, `${type}-container`);
    } catch (error) {
        alert(`Error adding ${type}: ${error.message}`);
    }
}

// ✅ Generic Edit Function for All Content Types
async function handleEdit(type, id) {
    alert(`Edit functionality for ${type} (ID: ${id}) is not yet implemented.`);
}

// ✅ Generic Delete Function for All Content Types
async function handleDelete(type, id) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/${type}/${id}`, { method: "DELETE" });

        if (!response.ok) throw new Error("Failed to delete " + type);

        alert(`${type} deleted successfully!`);
        fetchContent(type, `${type}-container`);
    } catch (error) {
        alert(`Error deleting ${type}: ${error.message}`);
    }
}

// ✅ Fetch and render all content on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchContent("posts", "posts-container");
    fetchContent("reviews", "reviews-container");
    fetchContent("tutorials", "tutorials-container");
    fetchContent("galleries", "galleries-container");
    fetchContent("videos", "videos-container");
});

// ✅ Image Upload Function
async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload/image`, { method: "POST", body: formData });
        return (await response.json()).imageUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}

// ✅ Video Upload Function
async function uploadVideo(file) {
    const formData = new FormData();
    formData.append("video", file);

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload/video`, { method: "POST", body: formData });
        return (await response.json()).videoUrl;
    } catch (error) {
        console.error("Error uploading video:", error);
        return null;
    }
}

// ✅ Approve Image
async function approveImage(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/gallery/approve/${id}`, { method: "PUT" });
        if (!response.ok) throw new Error("Failed to approve image");

        alert("Image approved successfully!");
        fetchContent("galleries", "galleries-container");
    } catch (error) {
        alert(`Error approving image: ${error.message}`);
    }
}

// ✅ Approve Video
async function approveVideo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/videos/approve/${id}`, { method: "PUT" });
        if (!response.ok) throw new Error("Failed to approve video");

        alert("Video approved successfully!");
        fetchContent("videos", "videos-container");
    } catch (error) {
        alert(`Error approving video: ${error.message}`);
    }
}

// ✅ Toggle content sections using tabs
document.querySelectorAll(".tab-btn").forEach((button) =>
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        document.querySelectorAll(".content-section").forEach((section) => {
            section.style.display = "none";
        });

        document.getElementById(button.dataset.target).style.display = "block";
    })
);

// ✅ Export functions for use in other scripts
export { fetchContent, addContent, handleEdit, handleDelete };
