// public/login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const email    = document.getElementById('username').value; // or use #email if you switch
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || 'Login failed');
      }

      const { token } = await res.json();
      // 1️⃣ store it
      localStorage.setItem('token', token);

      // 2️⃣ fetch the protected HTML
      const panelRes = await fetch('/admin-panel.html', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!panelRes.ok) {
        const errText = await panelRes.text();
        console.error('Could not load admin panel:', errText);
        return alert('Access denied');
      }

      // 3️⃣ replace this page with the admin panel
      const html = await panelRes.text();
      document.open();
      document.write(html);
      document.close();
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  });
});
