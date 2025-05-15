const TUTORIAL_API = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { document.body.innerHTML = '<h1>Tutorial not found</h1>'; return; }

  fetch(`${TUTORIAL_API}/api/tutorials/${id}`)
    .then(res => { if (!res.ok) throw new Error('Failed to fetch tutorial'); return res.json(); })
    .then(tut => {
      // Render fields
      document.getElementById('tutorial-title').textContent    = tut.title;
      document.getElementById('tutorial-category').textContent = tut.category;
      document.getElementById('tutorial-date').textContent     = new Date(tut.createdAt).toLocaleDateString();
      document.getElementById('tutorial-content').textContent  = tut.content;

      // Analytics
      document.getElementById('view-count').textContent       = tut.views;
      document.getElementById('like-count').textContent       = tut.likes;
      document.getElementById('dislike-count').textContent    = tut.dislikes;
      document.getElementById('comment-count').textContent    = tut.commentCount;

      // Like/Dislike
      document.getElementById('like-btn').addEventListener('click', () => {
        fetch(`${TUTORIAL_API}/api/tutorials/${id}/like`, { method: 'POST' })
          .then(r => r.json())
          .then(updated => { document.getElementById('like-count').textContent = updated.likes; });
      });
      document.getElementById('dislike-btn').addEventListener('click', () => {
        fetch(`${TUTORIAL_API}/api/tutorials/${id}/dislike`, { method: 'POST' })
          .then(r => r.json())
          .then(updated => { document.getElementById('dislike-count').textContent = updated.dislikes; });
      });

      // Comments
      fetch(`${TUTORIAL_API}/api/comments?tutorialId=${id}`)
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
    .catch(err => { console.error(err); document.body.innerHTML = '<h1>Error loading tutorial</h1>'; });
});
