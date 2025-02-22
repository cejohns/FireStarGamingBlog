const API_BASE_URL = "http://localhost:3000"; // Ensure it's HTTP if HTTPS is causing issues
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
            <p><strong>Author:</strong> ${item.author}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Created At:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
            <p><strong>Summary:</strong> ${item.summary}</p>
            <p>${item.content}</p>
        `;

        // ✅ Add review-specific fields
        if (type === "reviews") {
            contentHtml += `<p><strong>Rating:</strong> ${item.rating}/10</p>`;
        }

        // ✅ Add media fields
        if (type === "galleries") {
            contentHtml += `<img src="${item.imageUrl}" alt="${item.title}" width="200">`;
        } else if (type === "videos") {
            contentHtml += `<video width="320" height="240" controls>
                <source src="${item.videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>`;
        }

        // ✅ Add approve button for posts, reviews, and tutorials
        if (item.approved !== undefined) {
            contentHtml += `<p><strong>Approved:</strong> ${item.approved ? "Yes" : "No"}</p>`;
            if (!item.approved) {
                contentHtml += `<button class="approve-${type}" data-id="${item._id}">Approve</button>`;
            }
        }

        // ✅ Add Edit and Delete buttons (only once)
        contentHtml += `
            <button class="edit-${type}" data-id="${item._id}">Edit</button>
            <button class="delete-${type}" data-id="${item._id}">Delete</button>
        `;

        element.innerHTML = contentHtml;
        container.appendChild(element);
    });

    // ✅ Attach event listeners for edit, delete, and approve buttons
    document.querySelectorAll(`.edit-${type}`).forEach((btn) =>
        btn.addEventListener("click", () => handleEdit(type, btn.dataset.id))
    );
    document.querySelectorAll(`.delete-${type}`).forEach((btn) =>
        btn.addEventListener("click", () => handleDelete(type, btn.dataset.id))
    );
    document.querySelectorAll(`.approve-${type}`).forEach((btn) =>
        btn.addEventListener("click", () => handleApprove(type, btn.dataset.id))
    );
}



// ✅ Generic Add Function for All Content Types
async function addContent(type, postData) {
    try {
        let response;
        
        if (type === "galleries") {
            // ✅ Use FormData for file upload
            const formData = new FormData();
            formData.append("title", postData.title);
            formData.append("image", postData.image); // Image file

            response = await fetch(`${API_BASE_URL}/api/galleries`, {
                method: "POST",
                body: formData
            });
        } else {
            response = await fetch(`${API_BASE_URL}/api/${type}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData)
            });
        }

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

async function handleApprove(type, id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${type}/approve/${id}`, {
            method: "PUT",
        });

        if (!response.ok) throw new Error("Failed to approve " + type);

        alert(`${type} approved successfully!`);
        fetchContent(type, `${type}-container`);
    } catch (error) {
        alert(`Error approving ${type}: ${error.message}`);
    }
}


// ✅ Fetch Gallery Images
async function fetchGalleries() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/galleries`);
        if (!response.ok) throw new Error("Failed to fetch galleries");

        const data = await response.json();
        renderGalleries(data);
    } catch (error) {
        console.error("Error fetching galleries:", error);
        document.getElementById("galleries-container").innerHTML = "<p>Failed to load galleries.</p>";
    }
}

// ✅ Render Images in the Gallery Section
function renderGalleries(data) {
    const container = document.getElementById("galleries-container");
    container.innerHTML = "";

    data.forEach((item) => {
        const imgElement = document.createElement("img");
        imgElement.src = item.imageUrl;
        imgElement.alt = item.title;
        imgElement.width = 200;

        container.appendChild(imgElement);
    });
}

// ✅ Upload Image Function
async function uploadImage(imageFile, title) {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);

    console.log("Uploading image...", imageFile, title); // Debugging

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
            method: "POST",
            body: formData,
        });

        console.log("Response status:", response.status); // Debugging

        if (!response.ok) throw new Error("Failed to upload image");

        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

// ✅ Video Upload Function
async function uploadVideo(videoFile) {
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
        const response = await fetch(`${API_BASE_URL}/api/videos`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload video");

        const data = await response.json();
        return data.videoUrl; // Ensure this matches backend response
    } catch (error) {
        console.error("Error uploading video:", error);
        throw error;
    }
}


// ✅ Handle Form Submissions
document.addEventListener("DOMContentLoaded", () => {
    // Fetch and render all content on page load
    fetchContent("posts", "posts-container");
    fetchContent("reviews", "reviews-container");
    fetchContent("tutorials", "tutorials-container");
    fetchContent("galleries", "galleries-container");
    fetchContent("videos", "videos-container");

    // Generic form submission handler
    const forms = {
        "add-post-form": "posts",
        "add-review-form": "reviews",
        "add-tutorial-form": "tutorials",
        "add-gallery-form": "galleries",
        "add-video-form": "videos",
    };

    for (const [formId, type] of Object.entries(forms)) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                if (type === "galleries" || type === "videos") {
                    const fileInput = form.querySelector('input[type="file"]');
                    const file = fileInput.files[0];
                    if (!file) {
                        alert("Please select a file.");
                        return;
                    }

                    const uploadFunction = type === "galleries" ? uploadImage : uploadVideo;
                    const fileUrl = await uploadFunction(file);
                    if (!fileUrl) throw new Error(`Failed to upload ${type} file.`);

                    data[type === "galleries" ? "imageUrl" : "videoUrl"] = fileUrl;
                }

                await addContent(type, data);
                form.reset();
            });
        }
    }
});

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

document.getElementById("add-post-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const postData = Object.fromEntries(formData.entries());

    postData.createdAt = new Date().toISOString(); // Ensure createdAt is included

    await addContent("posts", postData);
    e.target.reset();
});


// ✅ Handle Image Upload from Form
document.addEventListener("DOMContentLoaded", () => {
    fetchGalleries();

    const galleryForm = document.getElementById("add-gallery-form");

    if (galleryForm) {
        galleryForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = document.getElementById("gallery-title").value;
            const imageFile = document.getElementById("gallery-image").files[0];

            if (!title || !imageFile) {
                alert("All fields are required!");
                return;
            }

            try {
                const imageUrl = await uploadImage(imageFile, title);
                alert("Image uploaded successfully!");

                fetchGalleries(); // Refresh the gallery
                galleryForm.reset();
            } catch (error) {
                console.error("Error adding gallery image:", error);
                alert("Error adding gallery image: " + error.message);
            }
        });
    }
});

// ✅ Export functions for use in other scripts
export { fetchContent, addContent, handleEdit, handleDelete, uploadImage, uploadVideo };