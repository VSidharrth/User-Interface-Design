// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchBtn.addEventListener('click', () => handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});

// Handle search
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query === '') {
        updateSearchResults(window.placeUtils.getAllPlaces());
        return;
    }

    const results = window.placeUtils.searchPlaces(query);
    updateSearchResults(results);
}

// Update search results
function updateSearchResults(results) {
    const featuredGrid = document.getElementById('featured-places-grid');
    
    if (!featuredGrid) return;

    featuredGrid.innerHTML = '';

    if (results.length === 0) {
        featuredGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No places found matching your search.</p>
            </div>
        `;
        return;
    }

    results.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
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
                    <button onclick="addToItinerary(${place.id})" class="add-to-itinerary">
                        Add to Itinerary
                    </button>
                </div>
            </div>
        `;
        featuredGrid.appendChild(placeCard);
    });

    // Update favorite buttons for logged-in user
    updateFavoriteButtons();
}

// Update favorite buttons based on user's favorites
function updateFavoriteButtons() {
    const currentUser = window.auth.getCurrentUser();
    if (!currentUser) return;

    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        const placeId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        if (currentUser.favorites.includes(placeId)) {
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    });
}

// Debounce function to limit search rate
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export search utilities
window.searchUtils = {
    handleSearch,
    updateSearchResults
}; 