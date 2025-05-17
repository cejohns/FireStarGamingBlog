// public/js/gallery.js

const GALLERY_API = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const startId = params.get('id');
  const titleEl       = document.getElementById('gallery-title');
  const dateEl        = document.getElementById('gallery-date');
  const imgEl         = document.getElementById('gallery-image');
  const viewCountEl   = document.getElementById('view-count');
  const likeBtn       = document.getElementById('like-btn');
  const dislikeBtn    = document.getElementById('dislike-btn');
  const likeCountEl   = document.getElementById('like-count');
  const dislikeCountEl= document.getElementById('dislike-count');
  const commentCountEl= document.getElementById('comment-count');
  const commentsContainer = document.getElementById('comments-container');
  const prevBtn       = document.getElementById('prev-slide');
  const nextBtn       = document.getElementById('next-slide');

  let galleries = [];
  let idx       = 0;

  // 1. Fetch all gallery items
  fetch(`${GALLERY_API}/api/galleries`)
    .then(res => res.json())
    .then(data => {
      galleries = data;
      // 2. Find index matching startId, default to 0
      idx = galleries.findIndex(g => g._id === startId);
      if (idx < 0) idx = 0;
      renderSlide();
      attachNav();
      attachInteractions();
    })
    .catch(err => {
      console.error('Error loading galleries:', err);
      document.body.innerHTML = '<h1>Error loading gallery slideshow</h1>';
    });

  function renderSlide() {
    const g = galleries[idx];
    titleEl.textContent       = g.title;
    dateEl.textContent        = new Date(g.createdAt).toLocaleDateString();
    imgEl.src                 = g.imageUrl;
    imgEl.alt                 = g.title;
    viewCountEl.textContent   = g.views || 0;
    likeCountEl.textContent   = g.likes || 0;
    dislikeCountEl.textContent= g.dislikes || 0;
    commentCountEl.textContent= g.commentCount || 0;

    // load comments for this slide
    commentsContainer.innerHTML = 'Loading comments...';
    fetch(`${GALLERY_API}/api/comments?galleryId=${g._id}`)
      .then(r => r.json())
      .then(comments => {
        commentCountEl.textContent = comments.length;
        commentsContainer.innerHTML = comments.map(c =>
          `<div class="comment-item">
             <p>${c.content}</p>
             <small>${new Date(c.createdAt).toLocaleString()}</small>
           </div>`
        ).join('') || '<p>No comments</p>';
      })
      .catch(() => {
        commentCountEl.textContent = '0';
        commentsContainer.innerHTML = '<p>Could not load comments.</p>';
      });
  }

  function attachNav() {
    prevBtn.addEventListener('click', () => {
      idx = (idx - 1 + galleries.length) % galleries.length;
      renderSlide();
    });
    nextBtn.addEventListener('click', () => {
      idx = (idx + 1) % galleries.length;
      renderSlide();
    });
  }

  function attachInteractions() {
    likeBtn.addEventListener('click', () => {
      const id = galleries[idx]._id;
      fetch(`${GALLERY_API}/api/galleries/${id}/like`, { method: 'POST' })
        .then(r => r.json())
        .then(updated => {
          galleries[idx].likes = updated.likes;
          renderSlide();
        })
        .catch(err => console.error('Error liking:', err));
    });

    dislikeBtn.addEventListener('click', () => {
      const id = galleries[idx]._id;
      fetch(`${GALLERY_API}/api/galleries/${id}/dislike`, { method: 'POST' })
        .then(r => r.json())
        .then(updated => {
          galleries[idx].dislikes = updated.dislikes;
          renderSlide();
        })
        .catch(err => console.error('Error disliking:', err));
    });
  }
});
