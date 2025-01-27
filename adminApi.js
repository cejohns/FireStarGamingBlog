const API_BASE_URL = "https://localhost:3001"; // Changed to HTTP for development

// Fetch all blog posts
async function fetchPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch posts");
        }
        return await response.json();
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        document.getElementById('posts-container').innerHTML = '<p>Failed to load posts.</p>';
        throw error;
    }
}

// Render posts in the DOM
function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = ''; // Clear previous content

    posts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Category:</strong> ${post.category}</p>
            <p><strong>Summary:</strong> ${post.summary}</p>
            <button class="edit-post" data-id="${post._id}">Edit</button>
            <button class="delete-post" data-id="${post._id}">Delete</button>
        `;
        container.appendChild(postElement);
    });

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll('.edit-post').forEach((button) =>
        button.addEventListener('click', handleEditPost)
    );
    document.querySelectorAll('.delete-post').forEach((button) =>
        button.addEventListener('click', handleDeletePost)
    );

    // Fetch and display posts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
});
}

// Handle editing a post
function handleEditPost(event) {
    const postId = event.target.getAttribute('data-id');
    // Logic for editing a post (e.g., prefill form fields)
    console.log(`Edit post: ${postId}`);
}

// Handle deleting a post
async function handleDeletePost(event) {
    const postId = event.target.getAttribute('data-id');
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete post: ${response.status}`);
        }
        console.log(`Post ${postId} deleted successfully`);
        fetchPosts(); // Refresh the post list
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// Fetch posts when the page loads
fetchPosts();

// Add a new blog post
export const addPost = async (postData) => {
    try {
        console.log('Sending post data:', postData); // Debug log
        
        // Validate required fields before sending
        if (!postData.title || !postData.summary || !postData.content || !postData.category) {
            throw new Error('Missing required fields');
        }

        const response = await fetch(`${API_BASE_URL}/api/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(postData),
            
        });

        if (!response.ok) {
            let errorMessage = 'Failed to add post';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // If parsing JSON fails, use status text
                errorMessage = response.statusText;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding post:", error);
        throw error;
    }
};

// Edit an existing blog post
async function editPost(postId, updatedData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
            credentials: "include",
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to edit post");
        }
        return await response.json();
    } catch (error) {
        console.error("Error editing post:", error);
        throw error;
    }
}

// Delete a blog post
async function deletePost(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
            method: "DELETE",
            credentials: "include",
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete post");
        }
        return await response.json();
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}

// Export functions for use in the admin panel
export {
    fetchPosts,
    editPost,
    deletePost,
};