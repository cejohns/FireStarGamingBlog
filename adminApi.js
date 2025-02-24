const API_BASE_URL = "http://localhost:3000"; // Ensure it's HTTP if HTTPS is causing issues

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ adminApi.js Loaded");

    const postForm = document.getElementById("add-post-form");
    const showFormButton = document.getElementById("show-add-post-form");

    if (!postForm || !showFormButton) {
        console.warn("❌ Post form or button not found in admin_panel.html!");
        return;
    }

    // ✅ Show form when "Add New Post" button is clicked
    showFormButton.addEventListener("click", () => {
        postForm.style.display = "block";
        showFormButton.style.display = "none"; 
    });

    // ✅ Prevent duplicate event listeners
    if (postForm.dataset.listenerAttached) {
        console.warn("⚠ Event listener already attached to form.");
        return;
    }
    postForm.dataset.listenerAttached = true;

    // ✅ Handle form submission
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("✅ Form submitted!");

        const fields = ["title", "author", "summary", "content", "category"];
        let formData = {};

        for (let id of fields) {
            let field = document.getElementById(id);
            if (!field) {
                console.error(`❌ ERROR: Field #${id} is missing!`);
                alert(`Field ${id} is missing!`);
                return;
            }
            formData[id] = field.value.trim();
            console.log(`✅ ${id}:`, formData[id]);
        }

        if (Object.values(formData).some(value => value === "")) {
            alert("All fields are required.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add post: ${errorText}`);
            }

            alert("🎉 Post added successfully!");
            postForm.reset();
            postForm.style.display = "none"; 
            showFormButton.style.display = "block"; 
        } catch (error) {
            console.error("❌ Error submitting post:", error);
            alert("Failed to submit post.");
        }
    });
});




// ✅ Generic Fetch Function for All Content Types
async function fetchContent(type, containerId) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found in index.html!`);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/${type}`);
        if (!response.ok) throw new Error(`Failed to fetch ${type}`);

        const data = await response.json();
        renderContent(data, containerId, type);
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
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

        if (type === "reviews") {
            contentHtml += `<p><strong>Rating:</strong> ${item.rating}/10</p>`;
        }

        if (item.approved !== undefined) {
            contentHtml += `<p><strong>Approved:</strong> ${item.approved ? "Yes" : "No"}</p>`;
            
            if (!item.approved) {
                contentHtml += `<button class="approve-${type}" data-id="${item._id}">Approve</button>`;
            }
        }

        // ✅ Add Publish button for approved content
        if (item.approved) {
            contentHtml += `<button class="publish-${type}" data-id="${item._id}">Publish</button>`;
        }

        // ✅ Add Edit and Delete buttons
        contentHtml += `
            <button class="edit-${type}" data-id="${item._id}">Edit</button>
            <button class="delete-${type}" data-id="${item._id}">Delete</button>
        `;

        element.innerHTML = contentHtml;
        container.appendChild(element);
    });

    // ✅ Attach event listeners
    document.querySelectorAll(`.edit-${type}`).forEach((btn) =>
        btn.addEventListener("click", () => handleEdit(type, btn.dataset.id))
    );
    document.querySelectorAll(`.delete-${type}`).forEach((btn) =>
        btn.addEventListener("click", () => handleDelete(type, btn.dataset.id))
    );
    document.querySelectorAll(`.approve-${type}`).forEach((btn) =>
        btn.addEventListener("click", () => handleApprove(type, btn.dataset.id))
    );
    document.querySelectorAll(`.publish-${type}`).forEach((btn) =>
        btn.addEventListener("click", () => handlePublish(type, btn.dataset.id))
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

async function handlePublish(type, id) {
    try {
        const response = await fetch(`http://localhost:3000/api/${type}/publish/${id}`, {
            method: "PUT",
        });

        if (!response.ok) throw new Error(`Failed to publish ${type}`);

        const updatedItem = await response.json();
        console.log(`${type} published successfully:`, updatedItem);
        // ✅ Store published item in localStorage
        let publishedItems = JSON.parse(localStorage.getItem(`${type}-published`)) || [];
        publishedItems.push(updatedItem);
        localStorage.setItem(`${type}-published`, JSON.stringify(publishedItems));

        alert(`${type} published successfully!`);
        fetchContent(type, `${type}-container`);
    } catch (error) {
        console.error(`Error publishing ${type}:`, error);
        alert(`Error publishing ${type}: ${error.message}`);
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

/*document.addEventListener("DOMContentLoaded", () => {
    const addPostForm = document.getElementById("add-post-form");

    if (addPostForm) {
        addPostForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Form submitted!"); // Debugging

            // Collect form data
            const title = document.getElementById("post-title").value;
            const content = document.getElementById("post-content").value;
            const author = document.getElementById("post-author").value;

            try {
                const response = await fetch("http://localhost:3000/api/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content }),
                });

                if (!response.ok) throw new Error("Failed to add post");

                alert("Post added successfully!");
                addPostForm.reset();
            } catch (error) {
                console.error("Error submitting post:", error);
                alert("Failed to submit post.");
            }
        });
    } else {
        console.warn("Form with id 'add-post-form' not found in admin_panel.html!");
    }
});*/



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

document.addEventListener("DOMContentLoaded", () => {
    // Fix publish button issue
    const publishButton = document.getElementById("publish-button");
    if (publishButton) {
        publishButton.addEventListener("click", handlePublish);
    } else {
        console.warn("Publish button not found in index.html!");
    }

    // Fix tutorials and galleries issues
    if (document.getElementById("tutorials-container")) {
        fetchContent("tutorials", "tutorials-container");
    } else {
        console.warn("Tutorials container not found in index.html!");
    }

    if (document.getElementById("galleries-container")) {
        fetchContent("galleries", "galleries-container");
    } else {
        console.warn("Galleries container not found in index.html!");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const sections = ["reviews", "tutorials", "posts"];
    
    sections.forEach((type) => {
        if (document.getElementById(`${type}-container`)) {
            fetchContent(type, `${type}-container`);
        }
    });

    document.querySelectorAll(".publish-button").forEach((btn) => {
        btn.addEventListener("click", () => handlePublish(btn.dataset.type, btn.dataset.id));
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // ✅ Only look for the publish button inside the admin panel
    if (window.location.pathname.includes("admin")) { 
        const publishButton = document.getElementById("publish-button");
        if (publishButton) {
            publishButton.addEventListener("click", () => handlePublish("reviews"));
        } else {
            console.warn("Publish button not found in admin panel!");
        }
    }

    // ✅ Ensure home reviews are loaded
    const homeReviewsContainer = document.getElementById("home-reviews-container");
    if (homeReviewsContainer) {
        fetchContent("reviews", "home-reviews-container");
    } else {
        console.warn("Container home-reviews-container not found in index.html!");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // ✅ Only run this code if the page is "admin_panel.html"
    if (window.location.pathname.includes("admin_panel.html")) {
        const addPostForm = document.getElementById("add-post-form");

        if (addPostForm) {
            addPostForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                console.log("Form submitted!"); // Debugging

                // Collect form data
                const title = document.getElementById("title").value;
                const content = document.getElementById("content").value;

                try {
                    const response = await fetch("http://localhost:3000/api/posts", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title, content }),
                    });

                    if (!response.ok) throw new Error("Failed to add post");

                    alert("Post added successfully!");
                    addPostForm.reset();
                } catch (error) {
                    console.error("Error submitting post:", error);
                    alert("Failed to submit post.");
                }
            });
        } else {
            console.warn("Form with id 'add-post-form' not found. Skipping event listener.");
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("add-post-form");
    const showFormButton = document.getElementById("show-add-post-form");

    if (!postForm || !showFormButton) {
        console.warn("Post form or show form button not found in admin_panel.html!");
        return;
    }

    // ✅ Show form when "Add New Post" button is clicked
    showFormButton.addEventListener("click", () => {
        postForm.style.display = "block";
        showFormButton.style.display = "none"; // Hide the button after clicking
    });

    // ✅ Handle form submission
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // ✅ Ensure all form fields exist
        const titleInput = document.getElementById("title");
        const authorInput = document.getElementById("author");
        const summaryInput = document.getElementById("summary");
        const contentInput = document.getElementById("content");
        const categoryInput = document.getElementById("category");

        if (!titleInput || !authorInput || !summaryInput || !contentInput || !categoryInput) {
            console.error("One or more form fields are missing!");
            alert("Please fill in all fields.");
            return;
        }

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const summary = summaryInput.value.trim();
        const content = contentInput.value.trim();
        const category = categoryInput.value;

        if (!title || !author || !summary || !content || !category) {
            alert("All fields are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, author, summary, content, category }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add post: ${errorText}`);
            }

            alert("Post added successfully!");
            postForm.reset();
            postForm.style.display = "none"; // Hide form after submission
            showFormButton.style.display = "block"; // Show "Add New Post" button again
        } catch (error) {
            console.error("Error submitting post:", error);
            alert("Failed to submit post.");
        }
    });
});




// ✅ Export functions for use in other scripts
export { fetchContent, addContent, handleEdit, handleDelete, uploadImage, uploadVideo };