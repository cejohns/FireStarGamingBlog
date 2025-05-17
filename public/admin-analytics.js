const API_BASE_URL = "http://localhost:3000";

const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
};

async function fetchAnalytics() {
  try {
    // ✅ include headers, and remove the stray comma
    const res = await fetch(
      `${API_BASE_URL}/api/analytics`,
      { headers }
    );
    const {
      totalPosts,
      totalComments,
      topPosts
    } = await res.json();

    document.getElementById('total-posts').textContent =
      `Total Posts: ${totalPosts}`;
    document.getElementById('total-comments').textContent =
      `Total Comments: ${totalComments}`;

    const popular = document.getElementById('popular-posts');
    popular.innerHTML = topPosts.length
      ? topPosts.map(p =>
          `<div>
             <a href="/posts/${p._id}" target="_blank">${p.title}</a>
             <span> (${p.views} views)</span>
           </div>`
        ).join('')
      : '<p>No posts to show.</p>';
  } catch (err) {
    console.error('Analytics load failed:', err);
    document.getElementById('analytics')
      .insertAdjacentHTML('beforeend',
        '<p class="error">Failed to load analytics.</p>'
      );
  }
}

async function fetchCommentsModeration() {
  try {
    // ✅ include headers on the GET
    const res = await fetch(
      `${API_BASE_URL}/api/comments`,
      { headers }
    );
    const comments = await res.json();
    const pending = comments.filter(c => !c.approved);
    const container = document.getElementById('comments-container');

    if (!pending.length) {
      container.innerHTML = '<p>No comments awaiting approval.</p>';
      return;
    }

    container.innerHTML = pending.map(c =>
      `<div class="comment-item" data-id="${c._id}">
         <p>${c.text}</p>
         <small>${new Date(c.createdAt).toLocaleString()}</small><br/>
         <button class="approve-btn">Approve</button>
         <button class="delete-btn">Delete</button>
       </div>`
    ).join('');

    container.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.closest('.comment-item').dataset.id;
        // ✅ include headers on the PUT
        await fetch(
          `${API_BASE_URL}/api/comments/approve/${id}`,
          { method: 'PUT', headers }
        );
        btn.closest('.comment-item').remove();
      });
    });

    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.closest('.comment-item').dataset.id;
        // ✅ include headers on the DELETE
        await fetch(
          `${API_BASE_URL}/api/comments/${id}`,
          { method: 'DELETE', headers }
        );
        btn.closest('.comment-item').remove();
      });
    });
  } catch (err) {
    console.error('Comments load failed:', err);
    document.getElementById('comments-moderation')
      .insertAdjacentHTML('beforeend',
        '<p class="error">Failed to load comments.</p>'
      );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchAnalytics();
  fetchCommentsModeration();
});
