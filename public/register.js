// public/register.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const username        = form.username.value.trim();
    const email           = form.email.value.trim();
    const password        = form.password.value;
    const confirmPassword = form['confirm-password'].value;

    // 1️⃣ Simple client-side check
    if (password !== confirmPassword) {
      return alert('⚠️ Passwords do not match');
    }

    try {
      // 2️⃣ Send registration request
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role: 'user' })
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message || 'Registration failed');
      }

      // 3️⃣ On success, redirect to login (or automatically log in)
      alert('✅ Registration successful! Please log in.');
      window.location.href = '/login.html';

    } catch (err) {
      console.error('Registration error:', err);
      alert('❌ ' + err.message);
    }
  });
});
