// public/js/post.js
const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    document.body.innerHTML = "<h1>Post not found</h1>";
    return;
  }

  // 1️⃣ Fetch the post (this also increments views)
  fetch(`${API_BASE_URL}/api/posts/${postId}`)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch post (status ${res.status})`);
      return res.json();
    })
    .then(post => {
      // Render post fields
      document.getElementById("post-title").textContent    = post.title;
      document.getElementById("post-author").textContent   = post.author;
      document.getElementById("post-category").textContent = post.category;
      document.getElementById("post-date").textContent     = new Date(post.createdAt).toLocaleDateString();
      document.getElementById("post-content").textContent  = post.content;

      // Render analytics counts
      document.getElementById("view-count").textContent    = post.views;
      document.getElementById("like-count").textContent    = post.likes;
      document.getElementById("dislike-count").textContent = post.dislikes;
      document.getElementById("comment-count").textContent = post.commentCount;

      // 2️⃣ Attach Like button
      document.getElementById("like-btn").addEventListener("click", () => {
        fetch(`${API_BASE_URL}/api/posts/${postId}/like`, { method: "POST" })
          .then(r => {
            if (!r.ok) throw new Error(`Failed to like (status ${r.status})`);
            return r.json();
          })
          .then(updated => {
            document.getElementById("like-count").textContent = updated.likes;
          })
          .catch(err => console.error("Like error:", err));
      });

      // 3️⃣ Attach Dislike button
      document.getElementById("dislike-btn").addEventListener("click", () => {
        fetch(`${API_BASE_URL}/api/posts/${postId}/dislike`, { method: "POST" })
          .then(r => {
            if (!r.ok) throw new Error(`Failed to dislike (status ${r.status})`);
            return r.json();
          })
          .then(updated => {
            document.getElementById("dislike-count").textContent = updated.dislikes;
          })
          .catch(err => console.error("Dislike error:", err));
      });

      // 4️⃣ Fetch and render comments
      fetch(`${API_BASE_URL}/api/comments?postId=${postId}`)
        .then(r => {
          if (!r.ok) throw new Error(`Failed to fetch comments (status ${r.status})`);
          return r.json();
        })
        .then(comments => {
          document.getElementById("comment-count").textContent = comments.length;
          const container = document.getElementById("comments-container");
          container.innerHTML = comments.map(c => `
            <div class="comment-item">
              <p>${c.content}</p>
              <small>${new Date(c.createdAt).toLocaleString()}</small>
            </div>
          `).join("");
        })
        .catch(err => console.error("Comments error:", err));
    })
    .catch(err => {
      console.error("Post-fetch error:", err);
      document.body.innerHTML = "<h1>Failed to load post</h1>";
    });
});
