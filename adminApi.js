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
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

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
            body: JSON.stringify(postData),
            credentials: "include",
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