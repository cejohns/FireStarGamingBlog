const API_BASE_URL = "http://localhost:3000";

function detailLink(type, id) {
  const map = {
    posts:     'post.html',
    reviews:   'review.html',
    tutorials: 'tutorials.html',
    galleries: 'gallery.html',
    videos:    'video.html'
  };
  const page = map[type];
  return page ? `${API_BASE_URL}/${page}?id=${id}` : `#`;
}

// Generic fetch for simple content (posts, reviews, tutorials)
async function fetchContent(type, containerId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/${type}`);
    if (!res.ok) throw new Error(`Failed to fetch ${type}`);
    const data = await res.json();
    const container = document.getElementById(containerId);
    container.innerHTML = data.length
      ? data.map(item => `
          <div class="${type}-preview">
            <h3><a href="${detailLink(type, item._id)}">${item.title}</a></h3>
            <p>${item.summary || ''}</p>
          </div>
        `).join("")
      : `<p>No ${type} available.</p>`;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
  }
}

// Fetch and render published videos
async function fetchPublishedVideos() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/videos`);
    if (!res.ok) throw new Error('Failed to fetch videos');
    const videos = await res.json();
    const container = document.getElementById('videos-container');
    const approved = videos.filter(v => v.approved);
    container.innerHTML = approved.length
      ? approved.map(video => `
          <div class="video-preview">
            <h3><a href="${detailLink('videos', video._id)}">${video.title}</a></h3>
            <video width="320" height="240" controls>
              <source src="${API_BASE_URL}${video.videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <p>${video.description || ''}</p>
          </div>
        `).join("")
      : `<p>No approved videos available.</p>`;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
}

// Fetch and render published galleries
async function fetchPublishedGalleries() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/galleries`);
    if (!res.ok) throw new Error('Failed to fetch galleries');
    const items = await res.json();
    const container = document.getElementById('galleries-container');
    const approved = items.filter(i => i.approved);
    container.innerHTML = approved.length
      ? approved.map(item => `
          <div class="gallery-preview">
            <h3><a href="${detailLink('galleries', item._id)}">${item.title}</a></h3>
            <img src="${API_BASE_URL}${item.imageUrl}" alt="${item.title}" width="200" />
          </div>
        `).join("")
      : `<p>No approved galleries available.</p>`;
  } catch (error) {
    console.error('Error fetching galleries:', error);
  }
}

// Load content on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('posts-container'))     fetchContent('posts', 'posts-container');
  if (document.getElementById('reviews-container'))   fetchContent('reviews', 'reviews-container');
  if (document.getElementById('tutorials-container')) fetchContent('tutorials', 'tutorials-container');
  if (document.getElementById('galleries-container')) fetchPublishedGalleries();
  if (document.getElementById('videos-container'))    fetchPublishedVideos();
});
