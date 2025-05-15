const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { document.body.innerHTML = '<h1>Review not found</h1>'; return; }

  fetch(`${API_BASE_URL}/api/reviews/${id}`)
    .then(res => { if (!res.ok) throw new Error('Failed to fetch review'); return res.json(); })
    .then(review => {
      // Render fields
      document.getElementById('review-title').textContent    = review.title;
      document.getElementById('review-author').textContent   = review.author;
      document.getElementById('review-category').textContent = review.category;
      document.getElementById('review-date').textContent     = new Date(review.createdAt).toLocaleDateString();
      document.getElementById('review-rating').textContent   = review.rating;
      document.getElementById('review-content').textContent  = review.content;

      // Analytics
      document.getElementById('view-count').textContent       = review.views;
      document.getElementById('like-count').textContent       = review.likes;
      document.getElementById('dislike-count').textContent    = review.dislikes;
      document.getElementById('comment-count').textContent    = review.commentCount;

      // Like/Dislike
      document.getElementById('like-btn').addEventListener('click', () => {
        fetch(`${API_BASE_URL}/api/reviews/${id}/like`, { method: 'POST' })
          .then(r => r.json())
          .then(updated => { document.getElementById('like-count').textContent = updated.likes; });
      });
      document.getElementById('dislike-btn').addEventListener('click', () => {
        fetch(`${API_BASE_URL}/api/reviews/${id}/dislike`, { method: 'POST' })
          .then(r => r.json())
          .then(updated => { document.getElementById('dislike-count').textContent = updated.dislikes; });
      });

      // Comments
      fetch(`${API_BASE_URL}/api/comments?reviewId=${id}`)
        .then(r => r.json())
        .then(comments => {
          document.getElementById('comment-count').textContent = comments.length;
          const container = document.getElementById('comments-container');
          container.innerHTML = comments.map(c => `
            <div class="comment-item">
              <p>${c.content}</p>
              <small>${new Date(c.createdAt).toLocaleString()}</small>
            </div>`).join('');
        });
    })
    .catch(err => { console.error(err); document.body.innerHTML = '<h1>Error loading review</h1>'; });
});
