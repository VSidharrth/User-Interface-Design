// User management
let currentUser = null;

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Password must be at least 8 characters long and contain:
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function validateUsername(username) {
    // Username must be 3-20 characters long and contain only letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}

// Check if user is already logged in
function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

// Initialize auth elements
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const logoutBtn = document.getElementById('logout-btn');
    const closeBtns = document.querySelectorAll('.close');

    // Event listeners
    loginBtn.addEventListener('click', () => showModal(loginModal));
    signupBtn.addEventListener('click', () => showModal(signupModal));
    logoutBtn.addEventListener('click', handleLogout);
    closeBtns.forEach(btn => btn.addEventListener('click', () => hideModals()));

    // Form submissions
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);

    // Add input validation feedback
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value && !validatePassword(this.value)) {
                this.setCustomValidity('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
            } else {
                this.setCustomValidity('');
            }
        });
    });

    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value && !validateEmail(this.value)) {
                this.setCustomValidity('Please enter a valid email address');
            } else {
                this.setCustomValidity('');
            }
        });
    });

    const usernameInput = document.querySelector('#signup-form input[type="text"]');
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            if (this.value && !validateUsername(this.value)) {
                this.setCustomValidity('Username must be 3-20 characters long and contain only letters, numbers, and underscores');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Check auth status on load
    checkAuthStatus();
});

// Show modal
function showModal(modal) {
    hideModals();
    modal.classList.remove('hidden');
}

// Hide all modals
function hideModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = {
            username: user.username,
            email: user.email,
            favorites: user.favorites || []
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        hideModals();
        showNotification('Successfully logged in!', 'success');
        
        // Reload favorites if on favorites page
        if (document.getElementById('favorites-section').classList.contains('active-section')) {
            window.mainUtils.loadFavorites();
        }
    } else {
        showNotification('Invalid email or password!', 'error');
    }
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    const username = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;

    // Validate all fields
    if (!validateUsername(username)) {
        showNotification('Username must be 3-20 characters long and contain only letters, numbers, and underscores', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (!validatePassword(password)) {
        showNotification('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        showNotification('Email already registered!', 'error');
        return;
    }

    if (users.some(u => u.username === username)) {
        showNotification('Username already taken!', 'error');
        return;
    }

    // Add new user
    const newUser = {
        username,
        email,
        password,
        favorites: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login
    currentUser = {
        username: newUser.username,
        email: newUser.email,
        favorites: newUser.favorites
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    updateUIForLoggedInUser();
    hideModals();
    showNotification('Account created successfully!', 'success');
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateUIForLoggedInUser();
    showNotification('Successfully logged out!', 'success');
    
    // Redirect to home if on favorites or itinerary page
    const favoritesSection = document.getElementById('favorites-section');
    const itinerarySection = document.getElementById('itinerary-section');
    if (favoritesSection.classList.contains('active-section') || 
        itinerarySection.classList.contains('active-section')) {
        document.getElementById('home-link').click();
    }
}

// Update UI based on auth status
function updateUIForLoggedInUser() {
    const authBtns = document.querySelectorAll('.auth-btn');
    const userProfile = document.getElementById('user-profile');
    const username = document.getElementById('username');

    if (currentUser) {
        authBtns.forEach(btn => btn.classList.add('hidden'));
        userProfile.classList.remove('hidden');
        username.textContent = currentUser.username;
    } else {
        authBtns.forEach(btn => btn.classList.remove('hidden'));
        userProfile.classList.add('hidden');
        username.textContent = '';
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Export auth utilities
window.auth = {
    getCurrentUser: () => currentUser,
    isLoggedIn: () => currentUser !== null,
    logout: handleLogout
}; 