document.getElementById('newsletter-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const frequency = document.getElementById('frequency').value;

    try {
        const response = await fetch('http://localhost:5000/api/subscription/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, frequency }),
        });

        const result = await response.json();
        const feedback = document.getElementById('newsletter-feedback');
        if (response.ok) {
            feedback.textContent = 'Subscription successful! Thank you for subscribing.';
            feedback.style.color = 'green';
        } else {
            feedback.textContent = `Error: ${result.message}`;
            feedback.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        const feedback = document.getElementById('newsletter-feedback');
        feedback.textContent = 'An unexpected error occurred. Please try again.';
        feedback.style.color = 'red';
    }
});
