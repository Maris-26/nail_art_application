// static/js/collections.js

const COLLECTION_STORAGE_KEY = 'nailArtCollections';

function getCollections() {
    const collections = localStorage.getItem(COLLECTION_STORAGE_KEY);
    return collections ? JSON.parse(collections) : [];
}

function saveCollections(collections) {
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collections));
}

function renderCollections() {
    const collectionsGrid = document.getElementById('collectionsGrid');
    const noCollectionsMessage = document.getElementById('noCollectionsMessage');
    if (!collectionsGrid || !noCollectionsMessage) return;

    const collections = getCollections();

    collectionsGrid.innerHTML = ''; // Clear previous content

    if (collections.length === 0) {
        noCollectionsMessage.style.display = 'block';
        return;
    } else {
        noCollectionsMessage.style.display = 'none';
    }

    collections.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');
        galleryItem.innerHTML = `
            <img src=\"${item.img_url}\" alt=\"${item.name}\" loading=\"lazy\">\n
            <div class=\"overlay\">\n
                <div class=\"item-info\">\n
                    <h3>${item.name}</h3>\n
                    <p>Shape: ${item.shape || 'N/A'}</p>\n
                    <p>Style: ${item.style || 'N/A'}</p>\n
                    <p>Color: ${item.color || 'N/A'}</p>\n
                </div>\n
                <!-- Remove button with data attribute for image URL -->\n                <button class=\"remove-btn\" data-img=\"${item.img_url}\">\n                    <i class=\"fas fa-times-circle\"></i> \n                </button>\n
            </div>\n
        `;
        collectionsGrid.appendChild(galleryItem);
    });
}

// Function to handle remove button clicks
function handleRemoveButtonClick(event) {
    const target = event.target.closest('.remove-btn');
    if (target) {
        const imgUrl = target.getAttribute('data-img');
        removeCollection(imgUrl);
        renderCollections(); // Re-render the list after removing
    }
}

// Function to remove collection item from localStorage
function removeCollection(imgUrl) {
     let collections = getCollections();
     collections = collections.filter(item => item.img_url !== imgUrl);
     saveCollections(collections);
     console.log(`Removed ${imgUrl} from collections.`);
}

// Attach event listeners after rendering
function attachRemoveButtonListeners() {
    const collectionsGrid = document.getElementById('collectionsGrid');
    if (collectionsGrid) {
        collectionsGrid.removeEventListener('click', handleRemoveButtonClick); // Prevent multiple listeners
        collectionsGrid.addEventListener('click', handleRemoveButtonClick);
    }
}

// Initialize the collections page
document.addEventListener('DOMContentLoaded', function() {
    renderCollections(); // Render collections on page load
    attachRemoveButtonListeners(); // Attach event listeners
}); 