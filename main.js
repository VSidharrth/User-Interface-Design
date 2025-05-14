// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Setup navigation
    setupNavigation();

    // Load initial content
    loadInitialContent();

    // Initialize featured places
    loadFeaturedPlaces();

    // Update favorite buttons for logged-in user
    updateFavoriteButtons();
});

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main > section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));
            sections.forEach(s => s.classList.add('hidden'));

            // Add active class to clicked link and corresponding section
            link.classList.add('active');
            const sectionId = link.id.replace('-link', '-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.remove('hidden');
                section.classList.add('active-section');

                // Initialize map if on explore section
                if (sectionId === 'explore-section') {
                    if (window.mapUtils) {
                        window.mapUtils.initMap();
                    }
                }
                
                // Load favorites if favorites section is activated
                if (sectionId === 'favorites-section' && window.auth.isLoggedIn()) {
                    loadFavorites();
                }
            }
        });
    });
}

// Load initial content
function loadInitialContent() {
    document.getElementById('home-section').classList.remove('hidden');
}

// Load featured places
function loadFeaturedPlaces() {
    const places = window.placeUtils.getAllPlaces();
    updateFeaturedPlaces(places);
}

// Update featured places display
function updateFeaturedPlaces(places) {
    const featuredGrid = document.getElementById('featured-places-grid');
    if (!featuredGrid) return;

    featuredGrid.innerHTML = places.map(place => `
        <div class="place-card" data-place-id="${place.id}">
            <img src="${place.image}" alt="${place.name}">
            <div class="place-card-content">
                <h3>${place.name}</h3>
                <p>${place.description}</p>
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${place.state}
                </div>
                <div class="place-info">
                    <span><i class="fas fa-clock"></i> ${place.averageVisitTime} hours</span>
                    <span><i class="fas fa-rupee-sign"></i> ${place.entryFee}</span>
                </div>
                <div class="card-actions">
                    <button onclick="addToFavorites(${place.id})" class="favorite-btn">
                        <i class="far fa-heart"></i>
                    </button>
                    <button onclick="window.itineraryUtils.addToItinerary(${place.id})" class="add-to-itinerary">
                        Add to Itinerary
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers for place cards
    const placeCards = featuredGrid.querySelectorAll('.place-card');
    placeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't show popup if clicking buttons
            if (e.target.closest('.card-actions')) return;
            
            const placeId = parseInt(card.dataset.placeId);
            const place = window.placeUtils.getPlaceById(placeId);
            if (place) {
                showPlacePopup(place);
            }
        });
    });

    // Update favorite buttons
    updateFavoriteButtons();
}

// Show place popup
function showPlacePopup(place) {
    // Remove any existing popup
    const existingPopup = document.querySelector('.place-popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'place-popup-overlay';
    popup.innerHTML = `
        <div class="place-popup">
            <button class="close-popup"><i class="fas fa-times"></i></button>
            <div class="popup-image">
                <img src="${place.image}" alt="${place.name}">
            </div>
            <div class="popup-content">
                <h2>${place.name}</h2>
                <p class="description">${place.description}</p>
                <div class="info-grid">
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Location</span>
                        <strong>${place.state}</strong>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>Visit Time</span>
                        <strong>${place.averageVisitTime} hours</strong>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-rupee-sign"></i>
                        <span>Entry Fee</span>
                        <strong>₹${place.entryFee}</strong>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Best Time</span>
                        <strong>${place.bestTimeToVisit}</strong>
                    </div>
                </div>
                <div class="popup-actions">
                    <button onclick="addToFavorites(${place.id})" class="favorite-btn">
                        <i class="far fa-heart"></i> Add to Favorites
                    </button>
                    <button onclick="window.itineraryUtils.addToItinerary(${place.id})" class="add-to-itinerary">
                        <i class="fas fa-plus"></i> Add to Itinerary
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add close handler
    const closeBtn = popup.querySelector('.close-popup');
    closeBtn.addEventListener('click', () => popup.remove());

    // Close on overlay click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    });

    document.body.appendChild(popup);
    updateFavoriteButtons();
}

// Add to favorites
function addToFavorites(placeId) {
    if (!window.auth.isLoggedIn()) {
        showNotification('Please login to add favorites', 'error');
        return;
    }

    const currentUser = window.auth.getCurrentUser();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex === -1) {
        showNotification('User not found', 'error');
        return;
    }

    if (!users[userIndex].favorites) {
        users[userIndex].favorites = [];
    }

    const isFavorite = users[userIndex].favorites.includes(placeId);
    
    if (isFavorite) {
        users[userIndex].favorites = users[userIndex].favorites.filter(id => id !== placeId);
        showNotification('Removed from favorites', 'success');
    } else {
        users[userIndex].favorites.push(placeId);
        showNotification('Added to favorites', 'success');
    }

    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user's favorites
    currentUser.favorites = users[userIndex].favorites;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update UI
    updateFavoriteButtons();
    
    // Reload favorites section if it's active
    if (document.getElementById('favorites-section').classList.contains('active-section')) {
        loadFavorites();
    }
}

// Load favorites
function loadFavorites() {
    const currentUser = window.auth.getCurrentUser();
    if (!currentUser || !currentUser.favorites) {
        document.getElementById('favorites-grid').innerHTML = `
            <div class="no-results">
                <i class="far fa-heart"></i>
                <p>No favorite places yet.</p>
            </div>
        `;
        return;
    }

    const favoritesList = document.getElementById('favorites-grid');
    if (!favoritesList) return;

    const favoritePlaces = currentUser.favorites
        .map(id => window.placeUtils.getPlaceById(id))
        .filter(Boolean);
    
    if (favoritePlaces.length === 0) {
        favoritesList.innerHTML = `
            <div class="no-results">
                <i class="far fa-heart"></i>
                <p>No favorite places yet.</p>
            </div>
        `;
        return;
    }

    favoritesList.innerHTML = favoritePlaces.map(place => `
        <div class="place-card" data-place-id="${place.id}">
            <img src="${place.image}" alt="${place.name}">
            <div class="place-card-content">
                <h3>${place.name}</h3>
                <p>${place.description}</p>
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${place.state}
                </div>
                <div class="place-info">
                    <span><i class="fas fa-clock"></i> ${place.averageVisitTime} hours</span>
                    <span><i class="fas fa-rupee-sign"></i> ${place.entryFee}</span>
                </div>
                <div class="card-actions">
                    <button onclick="addToFavorites(${place.id})" class="favorite-btn active">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button onclick="window.itineraryUtils.addToItinerary(${place.id})" class="add-to-itinerary">
                        Add to Itinerary
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers for place cards
    const placeCards = favoritesList.querySelectorAll('.place-card');
    placeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't show popup if clicking buttons
            if (e.target.closest('.card-actions')) return;
            
            const placeId = parseInt(card.dataset.placeId);
            const place = window.placeUtils.getPlaceById(placeId);
            if (place) {
                showPlacePopup(place);
            }
        });
    });
}

// Update favorite buttons
function updateFavoriteButtons() {
    const currentUser = window.auth.getCurrentUser();
    if (!currentUser || !currentUser.favorites) return;

    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        const placeId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        const isFavorite = currentUser.favorites.includes(placeId);
        
        if (isFavorite) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
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

// Export main utilities
window.mainUtils = {
    addToFavorites,
    loadFavorites,
    updateFavoriteButtons
}; 