const API_BASE_URL = "http://localhost:3000";

// ⚠️ Pull your JWT from localStorage
const token = localStorage.getItem('token');
const authHeaders = {
  'Authorization': 'Bearer ' + token
};

// ✅ Forms mapped to their respective API endpoints
const formMappings = {
    "add-post-form": "posts",
    "add-review-form": "reviews",
    "add-tutorial-form": "tutorials",
    "add-gallery-form": "galleries",
    "add-video-form": "videos",

     // Edit Forms (New!)
     "edit-post-form": "posts",
     "edit-review-form": "reviews",
     "edit-tutorial-form": "tutorials",
     "edit-gallery-form": "galleries",
     "edit-video-form": "videos"
};

function detailLink(type, id) {
  const map = {
    posts:     'post.html',
    reviews:   'review.html',
    tutorials: 'tutorial.html',
    galleries: 'gallery.html',
    videos:    'video.html',
  };
  const page = map[type];
  return page
    ? `${API_BASE_URL}/${page}?id=${id}`
    : '#';
}


function getEditFormIdFromType(type) {
    const match = Object.entries(formMappings).find(
        ([formId, formType]) =>
            formId.startsWith("edit-") && formType === type
    );
    return match ? match[0] : null;
}


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
        
            // Special handling for galleries
            if (type === "galleries") {
                const fileInput = form.querySelector('input[type="file"]');
                const titleInput = form.querySelector('#gallery-title');
                if (!fileInput?.files.length || !titleInput.value.trim()) {
                    alert("⚠ Title and image file are required for galleries.");
                    return;
                }
        
                const formData = new FormData();
                formData.append("image", fileInput.files[0]);
                formData.append("title", titleInput.value);

                // ✅ Debug: Log form data before sending
for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
}
        
                try {
                    const response = await fetch(`${API_BASE_URL}/api/galleries`, {
                        method: "POST",
                          headers: authHeaders,
                        body: formData,
                    });
        
                    if (!response.ok) throw new Error(await response.text());
        
                    alert("✅ Gallery image added successfully!");
                    form.reset();
                    fetchContent("galleries", "galleries-container");
                } catch (error) {
                    console.error("❌ Gallery upload failed:", error);
                    alert("❌ Failed to upload image: " + error.message);
                }
                return;
            }
        
          // Special handling for videos
if (type === "videos") {
  const fileInput       = form.querySelector('input[type="file"]');
  const titleInput      = form.querySelector('#video-title');
  const descInput       = form.querySelector('#video-description');
  if (!fileInput?.files.length || !titleInput.value.trim() || !descInput.value.trim()) {
    alert("⚠ Title, description, and video file are all required.");
    return;
  }

  const formData = new FormData();
  formData.append("video",       fileInput.files[0]);
  formData.append("title",       titleInput.value.trim());
  formData.append("description", descInput.value.trim());

  try {
    const response = await fetch(`${API_BASE_URL}/api/videos`, {
      method: "POST",
        headers: authHeaders,
      body: formData,
    });
    if (!response.ok) throw new Error(await response.text());
    alert("✅ Video uploaded successfully!");
    form.reset();
    fetchContent("videos", "videos-container");
  } catch (error) {
    console.error("❌ Video upload failed:", error);
    alert("❌ Failed to upload video: " + error.message);
  }
  return;
}

        
            // Generic handling for posts, reviews, tutorials
            const formData = new FormData(form);
            const postData = Object.fromEntries(formData.entries());
        
            for (const key in postData) {
                if (typeof postData[key] === "string") {
                    postData[key] = postData[key].trim();
                }
            }
        
            // Validate fields (updated)
            if (
                !postData.title ||
                (type !== "galleries" && type !== "videos" && (!postData.author || !postData.content)) ||
                (type === "reviews" && (!postData.summary || postData.rating === undefined)) ||
                (type === "tutorials" && !postData.category)
            ) {
                alert(`⚠ All fields are required for ${type}!`);
                return;
            }
        F
            try {
                await addContent(type, postData);
                form.reset();
                alert(`✅ ${type} added successfully!`);
            } catch (error) {
                console.error(`❌ Error adding ${type}:`, error);
                alert(`❌ Error adding ${type}: ${error.message}`);
            }
        });
    });
});



// ✅ Generic function to send data to the server
async function addContent(type, postData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json",  ...authHeaders },
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

         const response = await fetch(`${API_BASE_URL}/api/${type}`, { headers: authHeaders });
        if (!response.ok) throw new Error(`Failed to fetch ${type}`);

        const data = await response.json();
        renderContent(data, containerId, type);
    } catch (error) {
        console.error(`❌ Error fetching ${type}:`, error);
    }
}

// ✅ Render content dynamically/**
 //Renders content items into the given container, with dynamic "View" links

/**
 * Render content items in admin panel with edit, delete, approve, publish, and preview
 */
function renderContent(data, containerId, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = data.length ? '' : `<p>No ${type} available.</p>`;

  data.forEach(item => {
    const element = document.createElement('div');
    element.classList.add('content-item', type);

    let contentHtml = `<h3>${item.title}</h3>`;

    // Common fields
    if (item.category)  contentHtml += `<p><strong>Category:</strong> ${item.category}</p>`;
    if (item.createdAt) contentHtml += `<p><strong>Created At:</strong> ${new Date(item.createdAt).toLocaleString()}</p>`;

    // Type-specific
    if (type === 'posts') {
      if (item.summary) contentHtml += `<p>${item.summary}</p>`;
    }
    if (type === 'reviews') {
      if (item.rating !== undefined) contentHtml += `<p><strong>Rating:</strong> ${item.rating}/10</p>`;
      if (item.summary)        contentHtml += `<p>${item.summary}</p>`;
    }
    if (type === 'tutorials') {
      if (item.summary)        contentHtml += `<p>${item.summary}</p>`;
      if (item.content)        contentHtml += `<p>${item.content}</p>`;
    }
    if (type === 'galleries') {
      if (item.imageUrl)       contentHtml += `<img src="${item.imageUrl}" alt="${item.title}" width="200">`;
    }
    // Video preview and description
    if (type === 'videos') {
      if (item.description)    contentHtml += `<p><strong>Description:</strong> ${item.description}</p>`;
      if (item.videoUrl)       contentHtml += `
        <video width="320" height="240" controls style="display:block; margin:8px 0;">
          <source src="${API_BASE_URL}${item.videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
    }

    // Approval status and button
    if (item.approved !== undefined) {
      contentHtml += `<p><strong>Approved:</strong> ${item.approved ? '✅' : '❌'}</p>`;
      if (!item.approved) {
        contentHtml += `<button class="approve-${type}" data-id="${item._id}">Approve</button>`;
      }
    }

    // Publish button (for content with published flag)
    if (item.approved && item.published !== undefined) {
      contentHtml += `<button class="publish-${type}" data-id="${item._id}">Publish</button>`;
    }

    // Preview link
    if (item.approved) {
      contentHtml += `<a href="${detailLink(type, item._id)}" target="_blank" class="preview-link">` +
                     ({
                       posts:     'View Post',
                       reviews:   'View Review',
                       tutorials: 'View Tutorial',
                       galleries: 'View Gallery',
                       videos:    'View Video'
                     }[type] || 'View') +
                     `</a>`;
    }

    // Edit/Delete buttons
    contentHtml += `
      <button class="edit-${type}"   data-id="${item._id}">Edit</button>
      <button class="delete-${type}" data-id="${item._id}">Delete</button>
    `;

    element.innerHTML = contentHtml;
    container.appendChild(element);
  });

  // Attach event listeners for edit, delete, approve, publish
  attachEventListeners(type);
}

// Export or globally expose as needed
window.renderContent = renderContent;


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
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: "POST",
              headers: authHeaders,
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
              headers: authHeaders,
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
        const response = await fetch(`${API_BASE_URL}/api/${type}/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch ${type} details`);

        const itemData = await response.json();
        console.log(`📝 Editing ${type}:`, itemData);

        const formId = getEditFormIdFromType(type);
        if (!formId) {
            console.warn(`⚠ No edit form mapping found for type: ${type}`);
            return;
        }
        
        const oldForm = document.getElementById(formId);
        if (!oldForm) {
            console.warn(`⚠ Edit form for ${type} not found. Looking for: #${formId}`);
            return;
        }
        

        // ✅ Clone the form and populate it
        const formClone = oldForm.cloneNode(true);
        populateEditForm(formClone, itemData);
        formClone.style.display = "block";

        // ✅ Adjust submit button text
        const submitButton = formClone.querySelector("button[type='submit']");
        if (submitButton) {
            submitButton.textContent = `Update ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        }

        // ✅ Prepare sidebar
        const sidebar = document.getElementById("edit-sidebar");
        const wrapper = document.getElementById("edit-form-wrapper");
        wrapper.innerHTML = ""; // Clear previous form
        wrapper.appendChild(formClone);
        sidebar.style.display = "block";

        // ✅ Debug
        console.log("✅ Form added to sidebar:", formClone);
        console.log("➡️ Sidebar is now visible:", sidebar.style.display);

        // ✅ Handle form submission
        formClone.addEventListener("submit", async (e) => {
            e.preventDefault();
            

            const formData = new FormData(formClone);
            const updatedData = Object.fromEntries(formData.entries());
            console.log("📤 Sending updatedData:", updatedData);
            const updateResponse = await fetch(`${API_BASE_URL}/api/${type}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(updatedData),
            });

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                throw new Error(`Failed to update ${type}: ${errorText}`);
            }

            alert(`✅ ${type} updated successfully!`);
            sidebar.style.display = "none";
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
        const response = await fetch(`${API_BASE_URL}/api/${type}/${id}`, { method: "DELETE" ,  headers: authHeaders,});

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
              headers: authHeaders,
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
              headers: authHeaders,
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

function populateEditForm(form, data) {
    const fields = ["title", "author", "summary", "content", "category", "rating"];
    fields.forEach((field) => {
        const input = form.querySelector(`[name='${field}']`);
        if (input) input.value = data[field] ?? "";
    });
}

// ✅ Fetch content on page load
document.addEventListener("DOMContentLoaded", () => {
    Object.values(formMappings).forEach((type) => fetchContent(type, `${type}-container`));
});
// ✅ Add handlePublish back to the exports
export { uploadImage, addContent, fetchContent, handleEdit, handleDelete, handlePublish, handleApprove };





