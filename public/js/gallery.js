// public/js/gallery.js
document.addEventListener('DOMContentLoaded', () => {
  const params    = new URLSearchParams(window.location.search);
  const id        = params.get('id');
  const container = document.querySelector('.gallery-detail');

  if (!id) {
    container.innerHTML = '<p>No gallery ID provided.</p>';
    return;
  }

  fetch(`/api/galleries/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Gallery not found');
      return res.json();
    })
    .then(gal => {
      document.getElementById('gallery-title').textContent = gal.title;
      document.getElementById('gallery-date').textContent  =
        new Date(gal.createdAt).toLocaleDateString();
      const imgEl = document.getElementById('gallery-image');
      imgEl.src = gal.imageUrl;
      imgEl.alt = gal.title;
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<p>Failed to load gallery image.</p>';
    });
});
