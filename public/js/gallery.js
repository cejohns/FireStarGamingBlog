const GALLERY_API = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { document.body.innerHTML = '<h1>Gallery not found</h1>'; return; }

  fetch(`${GALLERY_API}/api/galleries/${id}`)
    .then(res => { if (!res.ok) throw new Error('Failed to fetch gallery'); return res.json(); })
    .then(gal => {
      // Render fields
      document.getElementById('gallery-title').textContent   = gal.title;
      document.getElementById('gallery-date').textContent    = new Date(gal.createdAt).toLocaleDateString();
      const imgEl = document.getElementById('gallery-image');
      imgEl.src = gal.imageUrl;
      imgEl.alt = gal.title;

      // Analytics
      document.getElementById('view-count').textContent       = gal.views;
      document.getElementById('like-count').textContent       = gal.likes;
      document.getElementById('dislike-count').textContent    = gal.dislikes;
      document.getElementById('comment-count').textContent    = gal.commentCount;

      // Like/Dislike
      document.getElementById('like-btn').addEventListener('click', () => {
        fetch(`${GALLERY_API}/api/galleries/${id}/like`, { method: 'POST' })
          .then(r => r.json())
          .then(updated => { document.getElementById('like-count').textContent = updated.likes; });
      });
      document.getElementById('dislike-btn').addEventListener('click', () => {
        fetch(`${GALLERY_API}/api/galleries/${id}/dislike`, { method: 'POST' })
          .then(r => r.json())
          .then(updated => { document.getElementById('dislike-count').textContent = updated.dislikes; });
      });

      // Comments
      fetch(`${GALLERY_API}/api/comments?galleryId=${id}`)
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
    .catch(err => { console.error(err); document.body.innerHTML = '<h1>Error loading gallery</h1>'; });
});
