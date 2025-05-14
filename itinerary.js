// Current itinerary state
let selectedPlaces = [];
let optimizedPlan = null;

// Initialize itinerary functionality
document.addEventListener('DOMContentLoaded', () => {
    const optimizeBtn = document.getElementById('optimize-btn');
    const saveBtn = document.getElementById('save-itinerary-btn');
    const exportBtn = document.getElementById('export-btn');
    const daysInput = document.getElementById('days-input');

    if (optimizeBtn) optimizeBtn.addEventListener('click', optimizeItinerary);
    if (saveBtn) saveBtn.addEventListener('click', saveItinerary);
    if (exportBtn) exportBtn.addEventListener('click', exportItinerary);
    if (daysInput) daysInput.addEventListener('change', updateDailyPlan);

    // Load saved itinerary if exists
    loadSavedItinerary();
});

// Add place to itinerary
function addToItinerary(placeId) {
    if (!window.auth.isLoggedIn()) {
        showNotification('Please login to create an itinerary', 'error');
        return;
    }

    const place = window.placeUtils.getPlaceById(placeId);
    if (!place) return;

    if (selectedPlaces.some(p => p.id === placeId)) {
        showNotification('Place already in itinerary', 'error');
        return;
    }

    selectedPlaces.push(place);
    updateSelectedPlaces();
    updateDailyPlan();
    showNotification('Added to itinerary', 'success');
}

// Update selected places display
function updateSelectedPlaces() {
    const selectedPlacesContainer = document.getElementById('selected-places');
    if (!selectedPlacesContainer) return;

    selectedPlacesContainer.innerHTML = `
        <h3>Selected Places</h3>
        <div class="selected-places-list">
            ${selectedPlaces.map(place => `
                <div class="selected-place" draggable="true" data-id="${place.id}">
                    <span>${place.name}</span>
                    <span class="remove-place" onclick="removeFromItinerary(${place.id})">×</span>
                </div>
            `).join('')}
        </div>
        <div class="total-info">
            <p>Total Time: ${window.placeUtils.calculateTotalTime(selectedPlaces.map(p => p.id))} hours</p>
            <p>Total Cost: ₹${window.placeUtils.calculateTotalCost(selectedPlaces.map(p => p.id))}</p>
        </div>
    `;

    // Add drag and drop functionality
    setupDragAndDrop();
}

// Remove place from itinerary
function removeFromItinerary(placeId) {
    selectedPlaces = selectedPlaces.filter(place => place.id !== placeId);
    updateSelectedPlaces();
    updateDailyPlan();
    showNotification('Removed from itinerary', 'success');
}

// Optimize itinerary
function optimizeItinerary() {
    const days = parseInt(document.getElementById('days-input').value);
    if (!days || days < 1) {
        showNotification('Please enter a valid number of days', 'error');
        return;
    }

    if (selectedPlaces.length === 0) {
        showNotification('Please add places to your itinerary', 'error');
        return;
    }

    // Simple optimization: Try to distribute places evenly across days
    // and group them by state to minimize travel time
    const placesByState = {};
    selectedPlaces.forEach(place => {
        if (!placesByState[place.state]) {
            placesByState[place.state] = [];
        }
        placesByState[place.state].push(place);
    });

    optimizedPlan = Array(days).fill().map(() => []);
    let dayIndex = 0;

    // Distribute places by state
    Object.values(placesByState).forEach(statePlaces => {
        statePlaces.forEach(place => {
            optimizedPlan[dayIndex].push(place);
            dayIndex = (dayIndex + 1) % days;
        });
    });

    updateDailyPlan();
    showNotification('Itinerary optimized!', 'success');
}

// Update daily plan display
function updateDailyPlan() {
    const dailyPlanContainer = document.getElementById('daily-plan');
    if (!dailyPlanContainer) return;

    const days = parseInt(document.getElementById('days-input').value) || 1;
    const plan = optimizedPlan || distributePlaces(days);

    dailyPlanContainer.innerHTML = plan.map((dayPlaces, index) => `
        <div class="day-container">
            <div class="day-header">
                <h3>Day ${index + 1}</h3>
                <span>${calculateDayStats(dayPlaces)}</span>
            </div>
            <div class="day-places">
                ${dayPlaces.map(place => `
                    <div class="place-item">
                        <div class="place-details">
                            <h4>${place.name}</h4>
                            <span class="place-time">${place.averageVisitTime} hours</span>
                            <span class="place-cost">₹${place.entryFee}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Calculate day statistics
function calculateDayStats(places) {
    const totalTime = places.reduce((sum, place) => sum + place.averageVisitTime, 0);
    const totalCost = places.reduce((sum, place) => sum + place.entryFee, 0);
    return `${totalTime} hours | ₹${totalCost}`;
}

// Distribute places across days
function distributePlaces(days) {
    const plan = Array(days).fill().map(() => []);
    let dayIndex = 0;

    selectedPlaces.forEach(place => {
        plan[dayIndex].push(place);
        dayIndex = (dayIndex + 1) % days;
    });

    return plan;
}

// Save itinerary
function saveItinerary() {
    if (!window.auth.isLoggedIn()) {
        showNotification('Please login to save itinerary', 'error');
        return;
    }

    const currentUser = window.auth.getCurrentUser();
    const itinerary = {
        places: selectedPlaces,
        optimizedPlan,
        days: parseInt(document.getElementById('days-input').value) || 1
    };

    // Save to localStorage
    const savedItineraries = JSON.parse(localStorage.getItem(`itineraries_${currentUser.email}`) || '[]');
    savedItineraries.push({
        id: Date.now(),
        ...itinerary
    });
    localStorage.setItem(`itineraries_${currentUser.email}`, JSON.stringify(savedItineraries));

    showNotification('Itinerary saved successfully!', 'success');
}

// Export itinerary
function exportItinerary() {
    const days = parseInt(document.getElementById('days-input').value) || 1;
    const plan = optimizedPlan || distributePlaces(days);

    let exportText = "South India Heritage Explorer - Itinerary\n\n";
    
    plan.forEach((dayPlaces, index) => {
        exportText += `Day ${index + 1}\n`;
        exportText += "=".repeat(20) + "\n";
        
        dayPlaces.forEach(place => {
            exportText += `\n${place.name}\n`;
            exportText += `Location: ${place.state}\n`;
            exportText += `Visit Time: ${place.averageVisitTime} hours\n`;
            exportText += `Entry Fee: ₹${place.entryFee}\n`;
            exportText += `Best Time to Visit: ${place.bestTimeToVisit}\n`;
        });

        const dayStats = calculateDayStats(dayPlaces);
        exportText += `\nDay Total: ${dayStats}\n\n`;
    });

    const totalTime = window.placeUtils.calculateTotalTime(selectedPlaces.map(p => p.id));
    const totalCost = window.placeUtils.calculateTotalCost(selectedPlaces.map(p => p.id));
    exportText += `\nTotal Trip Duration: ${totalTime} hours\n`;
    exportText += `Total Trip Cost: ₹${totalCost}\n`;

    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'south-india-itinerary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Load saved itinerary
function loadSavedItinerary() {
    const currentUser = window.auth.getCurrentUser();
    if (!currentUser) return;

    const savedItineraries = JSON.parse(localStorage.getItem(`itineraries_${currentUser.email}`) || '[]');
    if (savedItineraries.length > 0) {
        const lastItinerary = savedItineraries[savedItineraries.length - 1];
        selectedPlaces = lastItinerary.places;
        optimizedPlan = lastItinerary.optimizedPlan;
        
        if (document.getElementById('days-input')) {
            document.getElementById('days-input').value = lastItinerary.days;
        }

        updateSelectedPlaces();
        updateDailyPlan();
    }
}

// Setup drag and drop
function setupDragAndDrop() {
    const draggables = document.querySelectorAll('.selected-place');
    const container = document.querySelector('.selected-places-list');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            updateSelectedPlacesOrder();
        });
    });

    if (container) {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement) {
                container.insertBefore(draggable, afterElement);
            } else {
                container.appendChild(draggable);
            }
        });
    }
}

// Get element to insert dragged item after
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.selected-place:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Update selected places order after drag and drop
function updateSelectedPlacesOrder() {
    const newOrder = [];
    document.querySelectorAll('.selected-place').forEach(place => {
        const placeId = parseInt(place.dataset.id);
        const placeData = selectedPlaces.find(p => p.id === placeId);
        if (placeData) {
            newOrder.push(placeData);
        }
    });
    selectedPlaces = newOrder;
    updateDailyPlan();
}

// Export itinerary utilities
window.itineraryUtils = {
    addToItinerary,
    removeFromItinerary,
    optimizeItinerary,
    saveItinerary,
    exportItinerary
}; 