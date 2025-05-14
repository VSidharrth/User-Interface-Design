let map;
let markers = [];

// Initialize map
function initMap() {
    // Center of South India
    const southIndiaCenter = [15.9129, 79.7400];
    
    // If map is already initialized, remove it
    if (map) {
        map.remove();
    }
    
    // Initialize the map
    map = L.map('map', {
        center: southIndiaCenter,
        zoom: 6,
        minZoom: 5,
        maxZoom: 18,
        scrollWheelZoom: true,
        zoomControl: true
    });
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Add zoom control to a specific position
    map.zoomControl.setPosition('topright');

    // Force a resize event after initialization
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // Load initial places
    loadPlacesOnMap(window.placeUtils.getAllPlaces());
}

// Load places on map
function loadPlacesOnMap(places) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Add new markers
    places.forEach(place => {
        const marker = L.marker([place.location.lat, place.location.lng], {
            title: place.name,
            riseOnHover: true
        }).bindPopup(createPopupContent(place));
        
        marker.on('click', () => {
            marker.openPopup();
        });

        markers.push(marker);
        marker.addTo(map);
    });

    // Fit bounds if there are markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Create popup content
function createPopupContent(place) {
    return `
        <div class="map-popup">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <p><strong>State:</strong> ${place.state}</p>
            <p><strong>Category:</strong> ${place.category}</p>
            <p><strong>Visit Time:</strong> ${place.averageVisitTime} hours</p>
            <p><strong>Entry Fee:</strong> ₹${place.entryFee}</p>
            <p><strong>Best Time:</strong> ${place.bestTimeToVisit}</p>
            <button onclick="addToItinerary(${place.id})" class="add-to-itinerary">
                <i class="fas fa-plus"></i> Add to Itinerary
            </button>
        </div>
    `;
}

// Filter places on map
function filterPlacesOnMap() {
    const stateFilter = document.getElementById('state-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;

    let filteredPlaces = window.placeUtils.getAllPlaces();

    if (stateFilter) {
        filteredPlaces = filteredPlaces.filter(place => place.state === stateFilter);
    }

    if (categoryFilter) {
        filteredPlaces = filteredPlaces.filter(place => place.category === categoryFilter);
    }

    loadPlacesOnMap(filteredPlaces);
    updatePlacesList(filteredPlaces);
}

// Update places list
function updatePlacesList(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
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
                <button onclick="addToItinerary(${place.id})" class="add-to-itinerary">
                    Add to Itinerary
                </button>
            </div>
        `;
        placesList.appendChild(placeCard);
    });
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize map if we're on the explore section
    if (document.getElementById('map')) {
        initMap();
    }

    // Add filter event listeners
    const stateFilter = document.getElementById('state-filter');
    const categoryFilter = document.getElementById('category-filter');

    if (stateFilter && categoryFilter) {
        stateFilter.addEventListener('change', filterPlacesOnMap);
        categoryFilter.addEventListener('change', filterPlacesOnMap);
    }
});

// Export map utilities
window.mapUtils = {
    initMap,
    loadPlacesOnMap,
    filterPlacesOnMap
}; 