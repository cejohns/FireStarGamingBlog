const VIDEO_API = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { document.body.innerHTML = '<h1>Video not found</h1>'; return; }

  fetch(`${VIDEO_API}/api/videos/${id}`)
    .then(res => { if (!res.ok) throw new Error('Failed to fetch video'); return res.json(); })
    .then(video => {
      // Render fields
      document.getElementById('video-title').textContent       = video.title;
      document.getElementById('video-description').textContent = video.description;
      const player = document.getElementById('video-player');
      player.src = video.videoUrl;
      player.load();
      document.getElementById('video-date').textContent        = new Date(video.createdAt).toLocaleDateString();

      // Analytics
      document.getElementById('view-count').textContent       = video.views;
      document.getElementById('like-count').textContent       = video.likes;
      document.getElementById('dislike-count').textContent    = video.dislikes;
      document.getElementById('comment-count').textContent    = video.commentCount;

      // Like/Dislike
      document.getElementById('like-btn').addEventListener('click', () => {
        fetch(`${VIDEO_API}/api/videos/${id}/like`, { method: 'POST' })
          .then(r => r.json())
          .then(updated => { document.getElementById('like-count').textContent = updated.likes; });
      });
      document.getElementById('dislike-btn').addEventListener('click', () => {
        fetch(`${VIDEO_API}/api/videos/${id}/dislike`, { method: 'POST' })
          .then(r => r.json())
          .then(updated => { document.getElementById('dislike-count').textContent = updated.dislikes; });
      });

      // Comments
      fetch(`${VIDEO_API}/api/comments?videoId=${id}`)
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
    .catch(err => { console.error(err); document.body.innerHTML = '<h1>Error loading video</h1>'; });
});
