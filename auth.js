document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    // Registration Logic
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Check if user already exists in our "database"
            let users = JSON.parse(localStorage.getItem('users')) || {};

            if (users[email]) {
                alert('An account with this email already exists!');
                return;
            }

            // Save new user
            users[email] = { name: name, password: password, purchasedCourses: [] };
            localStorage.setItem('users', JSON.stringify(users));

            alert('Registration successful! Please log in.');
            window.location.href = 'login.html';
        });
    }

    // Login Logic
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            let users = JSON.parse(localStorage.getItem('users')) || {};

            // Verify credentials
            if (users[email] && users[email].password === password) {
                // Set current active user session
                localStorage.setItem('currentUser', JSON.stringify({ email: email, name: users[email].name }));
                window.location.href = 'dashboard.html'; // Redirect to the dashboard
            } else {
                alert('Invalid email or password. Please try again.');
            }
        });
    }
});