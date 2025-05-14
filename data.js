const historicalPlaces = [
    {
        id: 1,
        name: "Hampi",
        state: "Karnataka",
        category: "Monument",
        description: "Ancient capital of the Vijayanagara Empire, featuring stunning ruins and temples.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/2880px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg",
        location: {
            lat: 15.3350,
            lng: 76.4600
        },
        averageVisitTime: 6,
        entryFee: 600,
        bestTimeToVisit: "October to March"
    },
    {
        id: 2,
        name: "Meenakshi Temple",
        state: "Tamil Nadu",
        category: "Temple",
        description: "Ancient temple dedicated to Goddess Meenakshi, known for its stunning architecture.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg/2880px-An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg",
        location: {
            lat: 9.9195,
            lng: 78.1193
        },
        averageVisitTime: 3,
        entryFee: 100,
        bestTimeToVisit: "October to March"
    },
    {
        id: 3,
        name: "Golconda Fort",
        state: "Telangana",
        category: "Fort",
        description: "Medieval fort known for its acoustic effects and diamond trading history.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Golconda_Fort_005.jpg/2560px-Golconda_Fort_005.jpg",
        location: {
            lat: 17.3833,
            lng: 78.4011
        },
        averageVisitTime: 4,
        entryFee: 200,
        bestTimeToVisit: "November to February"
    },
    {
        id: 4,
        name: "Padmanabhaswamy Temple",
        state: "Kerala",
        category: "Temple",
        description: "Ancient temple dedicated to Lord Vishnu, known for its wealth and architecture.",
        image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Sree_Padmanabhaswamy_temple_01.jpg",
        location: {
            lat: 8.4827,
            lng: 76.9435
        },
        averageVisitTime: 2,
        entryFee: 50,
        bestTimeToVisit: "September to March"
    },
    {
        id: 5,
        name: "Lepakshi Temple",
        state: "Andhra Pradesh",
        category: "Temple",
        description: "Ancient temple known for its mural paintings and architectural elements.",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Front_side_of_Veerabhadra_Temple%2C_Lepakshi.jpg",
        location: {
            lat: 14.2800,
            lng: 77.6100
        },
        averageVisitTime: 3,
        entryFee: 100,
        bestTimeToVisit: "November to February"
    },
    {
        id: 6,
        name: "Brihadeeswarar Temple",
        state: "Tamil Nadu",
        category: "Temple",
        description: "UNESCO World Heritage site, known for its magnificent Dravidian architecture and massive Shiva lingam.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Brihadesvara_Temple%2C_Tanjavur%2C_India_02.jpg/500px-Brihadesvara_Temple%2C_Tanjavur%2C_India_02.jpg",
        location: {
            lat: 10.7828,
            lng: 79.1318
        },
        averageVisitTime: 3,
        entryFee: 50,
        bestTimeToVisit: "October to March"
    },
    {
        id: 7,
        name: "Mysore Palace",
        state: "Karnataka",
        category: "Palace",
        description: "Spectacular royal palace illuminated by thousands of lights, showcasing Indo-Saracenic architecture.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/2880px-Mysore_Palace_Morning.jpg",
        location: {
            lat: 12.3052,
            lng: 76.6552
        },
        averageVisitTime: 4,
        entryFee: 300,
        bestTimeToVisit: "October to February"
    },
    {
        id: 8,
        name: "Charminar",
        state: "Telangana",
        category: "Monument",
        description: "Iconic monument and mosque built in 1591, symbol of Hyderabad's rich history.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Charminar-Pride_of_Hyderabad.jpg/1280px-Charminar-Pride_of_Hyderabad.jpg",
        location: {
            lat: 17.3616,
            lng: 78.4747
        },
        averageVisitTime: 2,
        entryFee: 100,
        bestTimeToVisit: "October to March"
    },
    {
        id: 9,
        name: "Athirappilly Falls",
        state: "Kerala",
        category: "Monument",
        description: "Largest waterfall in Kerala, known as the 'Niagara of India', surrounded by lush forest.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/The_View_of_the_Athirapally_Falls_during_the_onset_of_Monsoon.jpg/2560px-The_View_of_the_Athirapally_Falls_during_the_onset_of_Monsoon.jpg",
        location: {
            lat: 10.2850,
            lng: 76.5700
        },
        averageVisitTime: 3,
        entryFee: 80,
        bestTimeToVisit: "September to January"
    },
    {
        id: 10,
        name: "Warangal Fort",
        state: "Telangana",
        category: "Fort",
        description: "13th-century fort showcasing Kakatiya dynasty architecture with intricate carvings.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Shiv_Linga_at_Warangal_Fort_Complex.jpg/500px-Shiv_Linga_at_Warangal_Fort_Complex.jpg",
        location: {
            lat: 18.0000,
            lng: 79.5833
        },
        averageVisitTime: 3,
        entryFee: 150,
        bestTimeToVisit: "October to March"
    },
    {
        id: 11,
        name: "Shore Temple",
        state: "Tamil Nadu",
        category: "Temple",
        description: "UNESCO World Heritage site, ancient structural temple built in 700-728 AD overlooking Bay of Bengal.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg/2560px-Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg",
        location: {
            lat: 12.6162,
            lng: 80.1967
        },
        averageVisitTime: 2,
        entryFee: 200,
        bestTimeToVisit: "November to February"
    },
    {
        id: 12,
        name: "Belur Temple",
        state: "Karnataka",
        category: "Temple",
        description: "Stunning example of Hoysala architecture with intricate carvings and sculptures.",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Courtyard_of_Chennakesava_Temple_-_Belur.jpg",
        location: {
            lat: 13.1650,
            lng: 75.8617
        },
        averageVisitTime: 3,
        entryFee: 100,
        bestTimeToVisit: "October to March"
    },
    {
        id: 13,
        name: "Rameshwaram Temple",
        state: "Tamil Nadu",
        category: "Temple",
        description: "One of the twelve Jyotirlinga temples, known for its magnificent corridors and sacred water tanks.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ramanathaswamy_temple7.JPG/1280px-Ramanathaswamy_temple7.JPG",
        location: {
            lat: 9.2885,
            lng: 79.3131
        },
        averageVisitTime: 4,
        entryFee: 100,
        bestTimeToVisit: "October to April"
    },
    {
        id: 14,
        name: "Bekal Fort",
        state: "Kerala",
        category: "Fort",
        description: "Largest fort in Kerala, shaped like a giant keyhole, overlooking the Arabian Sea.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Bakel_Fort_Beach_Kasaragod7.jpg/2560px-Bakel_Fort_Beach_Kasaragod7.jpg",
        location: {
            lat: 12.3917,
            lng: 75.0327
        },
        averageVisitTime: 3,
        entryFee: 50,
        bestTimeToVisit: "September to March"
    },
    {
        id: 15,
        name: "Tirumala Venkateswara Temple",
        state: "Andhra Pradesh",
        category: "Temple",
        description: "One of the most visited religious sites in the world, dedicated to Lord Venkateswara.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/2560px-Tirumala_090615.jpg",
        location: {
            lat: 13.6833,
            lng: 79.3474
        },
        averageVisitTime: 5,
        entryFee: 300,
        bestTimeToVisit: "September to February"
    }
];

// Function to get all places
function getAllPlaces() {
    return historicalPlaces;
}

// Function to get places by state
function getPlacesByState(state) {
    return historicalPlaces.filter(place => place.state === state);
}

// Function to get places by category
function getPlacesByCategory(category) {
    return historicalPlaces.filter(place => place.category === category);
}

// Function to search places
function searchPlaces(query) {
    query = query.toLowerCase();
    return historicalPlaces.filter(place => 
        place.name.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query) ||
        place.state.toLowerCase().includes(query)
    );
}

// Function to get place by ID
function getPlaceById(id) {
    return historicalPlaces.find(place => place.id === id);
}

// Function to calculate total visit time
function calculateTotalTime(placeIds) {
    return placeIds.reduce((total, id) => {
        const place = getPlaceById(id);
        return total + (place ? place.averageVisitTime : 0);
    }, 0);
}

// Function to calculate total cost
function calculateTotalCost(placeIds) {
    return placeIds.reduce((total, id) => {
        const place = getPlaceById(id);
        return total + (place ? place.entryFee : 0);
    }, 0);
}

// Export functions
window.placeUtils = {
    getAllPlaces,
    getPlacesByState,
    getPlacesByCategory,
    searchPlaces,
    getPlaceById,
    calculateTotalTime,
    calculateTotalCost
}; 