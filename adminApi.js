const API_BASE_URL = "http://localhost:3000";

// ✅ Forms mapped to their respective API endpoints
const formMappings = {
    "add-post-form": "posts",
    "add-review-form": "reviews",
    "add-tutorial-form": "tutorials",
    "add-gallery-form": "galleries",
    "add-video-form": "videos",
};

// ✅ Attach form submission event listeners
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ adminApi.js Loaded");

    Object.entries(formMappings).forEach(([formId, type]) => {
        const form = document.getElementById(formId);
        if (!form) {
            console.warn(`⚠ Form #${formId} not found.`);
            return;
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const postData = Object.fromEntries(formData.entries());

            // ✅ Debugging: Check submitted data in Console
            console.log(`📤 Submitting ${type}:`, postData);

            // ✅ Trim values to avoid empty spaces being mistaken as input
            for (const key in postData) {
                if (typeof postData[key] === "string") {
                    postData[key] = postData[key].trim();
                }
            }

            // ✅ Check required fields
            if (
                !postData.title ||
                !postData.author ||
                !postData.content ||
                (type === "reviews" && (!postData.summary || postData.rating === undefined)) ||
                (type === "tutorials" && !postData.category)
            ) {
                alert(`⚠ All fields are required for ${type}!`);
                return;
            }

            // ✅ Handle file uploads for galleries & videos
            if (type === "galleries" || type === "videos") {
                const fileInput = form.querySelector('input[type="file"]');
                if (!fileInput?.files.length) {
                    alert(`⚠ Please select a file for ${type}.`);
                    return;
                }

                const uploadFunction = type === "galleries" ? uploadImage : uploadVideo;
                const fileUrl = await uploadFunction(fileInput.files[0]);
                if (!fileUrl) throw new Error(`❌ Failed to upload ${type} file.`);

                postData[type === "galleries" ? "imageUrl" : "videoUrl"] = fileUrl;
            }

            await addContent(type, postData);
            form.reset();
            alert(`✅ ${type} added successfully!`);
        });
    });
});

// ✅ Generic function to send data to the server
async function addContent(type, postData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to add ${type}: ${errorText}`);
        }

        alert(`${type} added successfully!`);
        fetchContent(type, `${type}-container`);
    } catch (error) {
        console.error(`❌ Error adding ${type}:`, error);
        alert(`Error adding ${type}: ${error.message}`);
    }
}

// ✅ Fetch content dynamically
async function fetchContent(type, containerId) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`⚠ Container ${containerId} not found.`);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/${type}`);
        if (!response.ok) throw new Error(`Failed to fetch ${type}`);

        const data = await response.json();
        renderContent(data, containerId, type);
    } catch (error) {
        console.error(`❌ Error fetching ${type}:`, error);
    }
}

// ✅ Render content dynamically
function renderContent(data, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = data.length ? "" : `<p>No ${type} available.</p>`;

    data.forEach((item) => {
        const element = document.createElement("div");
        element.classList.add(type);

        let contentHtml = `
            <h3>${item.title}</h3>
            <p><strong>Author:</strong> ${item.author}</p>
            <p><strong>Category:</strong> ${item.category || "N/A"}</p>
            <p><strong>Created At:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
            <p><strong>Summary:</strong> ${item.summary || ""}</p>
            <p>${item.content}</p>
        `;

        if (type === "reviews") {
            contentHtml += `<p><strong>Rating:</strong> ${item.rating}/10</p>`;
        }

        if (item.imageUrl) {
            contentHtml += `<img src="${item.imageUrl}" alt="${item.title}" width="200">`;
        }

        if (item.videoUrl) {
            contentHtml += `<video width="320" height="240" controls>
                <source src="${item.videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>`;
        }

        if (item.approved !== undefined) {
            contentHtml += `<p><strong>Approved:</strong> ${item.approved ? "Yes" : "No"}</p>`;
            if (!item.approved) {
                contentHtml += `<button class="approve-${type}" data-id="${item._id}">Approve</button>`;
            }
        }

        if (item.approved) {
            contentHtml += `<button class="publish-${type}" data-id="${item._id}">Publish</button>`;
        }

        contentHtml += `
            <button class="edit-${type}" data-id="${item._id}">Edit</button>
            <button class="delete-${type}" data-id="${item._id}">Delete</button>
        `;

        element.innerHTML = contentHtml;
        container.appendChild(element);
    });

    attachEventListeners(type);
}

// ✅ Attach event listeners dynamically
function attachEventListeners(type) {
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

// ✅ File upload functions
async function uploadImage(imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload image");

        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error("❌ Error uploading image:", error);
        throw error;
    }
}

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
        return data.videoUrl;
    } catch (error) {
        console.error("❌ Error uploading video:", error);
        throw error;
    }
}

// ✅ Generic edit and delete functions
async function handleEdit(type, id) {
    try {
        const response = await fetch(`http://localhost:3000/api/${type}/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch ${type} details`);

        const itemData = await response.json();
        console.log(`📝 Editing ${type}:`, itemData);

        // ✅ Ensure correct form ID mapping
        const formId = `edit-${type}-form`;
        const form = document.getElementById(formId);
        
        if (!form) {
            console.warn(`⚠ Edit form for ${type} not found.`);
            return;
        }

        // ✅ Ensure the form fields match the correct names
        form.querySelector("[name='title']").value = itemData.title || "";
        form.querySelector("[name='author']").value = itemData.author || "";
        form.querySelector("[name='summary']").value = itemData.summary || "";
        form.querySelector("[name='content']").value = itemData.content || "";
        if (form.querySelector("[name='category']")) {
            form.querySelector("[name='category']").value = itemData.category || "";
        }
        if (form.querySelector("[name='rating']")) {
            form.querySelector("[name='rating']").value = itemData.rating || "";
        }

        // ✅ Make sure the form is visible
        form.style.display = "block";

        // ✅ Update submit button
        const submitButton = form.querySelector("button[type='submit']");
        submitButton.textContent = `Update ${type.charAt(0).toUpperCase() + type.slice(1)}`;

        // ✅ Remove previous event listener and add a new one
        form.replaceWith(form.cloneNode(true));
        const updatedForm = document.getElementById(formId);

        updatedForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(updatedForm);
            const updatedData = Object.fromEntries(formData.entries());

            console.log(`📤 Updating ${type}:`, updatedData);

            // ✅ Send updated data to the server
            const updateResponse = await fetch(`http://localhost:3000/api/${type}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                throw new Error(`Failed to update ${type}: ${errorText}`);
            }

            alert(`✅ ${type} updated successfully!`);
            updatedForm.reset();
            updatedForm.style.display = "none";
            fetchContent(type, `${type}-container`);
        });

    } catch (error) {
        console.error(`❌ Error editing ${type}:`, error);
        alert(`Error editing ${type}: ${error.message}`);
    }
}




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
        const response = await fetch(`http://localhost:3000/api/${type}/approve/${id}`, {
            method: "PUT",
        });

        if (!response.ok) {
            throw new Error(`Failed to approve ${type}`);
        }

        alert(`${type} approved successfully!`);
        fetchContent(type, `${type}-container`);
    } catch (error) {
        console.error(`Error approving ${type}:`, error);
        alert(`Error approving ${type}: ${error.message}`);
    }
}

async function handlePublish(type, id) {
    try {
        const response = await fetch(`http://localhost:3000/api/${type}/publish/${id}`, {
            method: "PUT",
        });

        if (!response.ok) {
            throw new Error(`Failed to publish ${type}`);
        }

        alert(`${type} published successfully!`);
        fetchContent(type, `${type}-container`);
    } catch (error) {
        console.error(`Error publishing ${type}:`, error);
        alert(`Error publishing ${type}: ${error.message}`);
    }
}
// ✅ Fetch content on page load
document.addEventListener("DOMContentLoaded", () => {
    Object.values(formMappings).forEach((type) => fetchContent(type, `${type}-container`));
});
// ✅ Add handlePublish back to the exports
export { uploadImage, addContent, fetchContent, handleEdit, handleDelete, handlePublish, handleApprove };





