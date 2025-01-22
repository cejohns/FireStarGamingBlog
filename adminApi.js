// adminApi.js

const API_BASE_URL = "http://localhost:3000/api"; // Change this to your backend URL

// Fetch all blog posts
async function fetchPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        return await response.json();
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Add a new blog post
async function addPost(postData) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error("Failed to add post");
        return await response.json();
    } catch (error) {
        console.error("Error adding post:", error);
    }
}

// Edit an existing blog post
async function editPost(postId, updatedData) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error("Failed to edit post");
        return await response.json();
    } catch (error) {
        console.error("Error editing post:", error);
    }
}

// Delete a blog post
async function deletePost(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete post");
        return await response.json();
    } catch (error) {
        console.error("Error deleting post:", error);
    }
}

// Fetch analytics data
async function fetchAnalytics() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics`);
        if (!response.ok) throw new Error("Failed to fetch analytics");
        return await response.json();
    } catch (error) {
        console.error("Error fetching analytics:", error);
    }
}

// Fetch comments for moderation
async function fetchComments() {
    try {
        const response = await fetch(`${API_BASE_URL}/comments`);
        if (!response.ok) throw new Error("Failed to fetch comments");
        return await response.json();
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}

// Approve a comment
async function approveComment(commentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/comments/approve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId }),
        });
        if (!response.ok) throw new Error("Failed to approve comment");
        return await response.json();
    } catch (error) {
        console.error("Error approving comment:", error);
    }
}

// Delete a comment
async function deleteComment(commentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete comment");
        return await response.json();
    } catch (error) {
        console.error("Error deleting comment:", error);
    }
}

// Export functions for use in the admin panel
export {
    fetchPosts,
    addPost,
    editPost,
    deletePost,
    fetchAnalytics,
    fetchComments,
    approveComment,
    deleteComment,
};
