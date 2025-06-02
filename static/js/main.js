// Main JavaScript file
let allImagesData = []; // Store all image data
let filteredImages = []; // Store currently filtered images
let currentPage = 1;
const imagesPerPage = 20; // Define how many images to show per page initially
let isLoading = false;
let hasMore = true;
let lastQuery = {}; // Will store filter and search terms

// --- Local Storage Collections Functions ---
const COLLECTION_STORAGE_KEY = 'nailArtCollections';

function getCollections() {
    const collections = localStorage.getItem(COLLECTION_STORAGE_KEY);
    return collections ? JSON.parse(collections) : [];
}

function saveCollections(collections) {
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collections));
}

function isCollected(imgUrl) {
    const collections = getCollections();
    return collections.some(item => item.img_url === imgUrl);
}

function addCollection(item) {
    const collections = getCollections();
    if (!isCollected(item.img_url)) {
        collections.push(item);
        saveCollections(collections);
        console.log(`Added ${item.name} to collections.`);
    }
}

function removeCollection(imgUrl) {
    let collections = getCollections();
    const initialLength = collections.length;
    collections = collections.filter(item => item.img_url !== imgUrl);
    if (collections.length < initialLength) {
        saveCollections(collections);
        console.log(`Removed ${imgUrl} from collections.`);
    }
}

// --- End Local Storage Collections Functions ---

// Function to fetch and load images data from tags.json
async function loadAllImages() {
    console.log('Loading all images from tags.json...');
    try {
        const response = await fetch('/tags.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allImagesData = await response.json();
        console.log(`Loaded ${allImagesData.length} images.`);
        applyFiltersAndSearch(); // Apply initial filters and search after loading
    } catch (error) {
        console.error('Error loading images:', error);
        // Display an error message to the user if loading fails
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid) {
            galleryGrid.innerHTML = '<p>Error loading images. Please try again later.</p>';
        }
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none'; // Hide load more button on error
        }
    }
}

// Function to apply filters and search query to the loaded data
function applyFiltersAndSearch() {
    console.log('Applying filters and search...');
    const searchInput = document.querySelector('.main-search-bar input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const selectedShapes = Array.from(document.querySelectorAll('input[name="shape"]:checked')).map(input => input.value);
    const selectedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(input => input.value);
    const selectedColors = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(input => input.value);

    filteredImages = allImagesData.filter(item => {
        // Search filter
        const searchMatch = !searchTerm || 
                            (item.name && item.name.toLowerCase().includes(searchTerm)) ||
                            (item.shape && item.shape.toLowerCase().includes(searchTerm)) ||
                            (item.style && item.style.toLowerCase().includes(searchTerm)) ||
                            (item.color && item.color.toLowerCase().includes(searchTerm));

        // Tag filters
        const shapeMatch = selectedShapes.length === 0 || (item.shape && selectedShapes.includes(item.shape));
        const styleMatch = selectedStyles.length === 0 || (item.style && selectedStyles.includes(item.style));
        const colorMatch = selectedColors.length === 0 || (item.color && selectedColors.includes(item.color));

        return searchMatch && shapeMatch && styleMatch && colorMatch;
    });

    console.log(`Found ${filteredImages.length} images matching filters and search.`);
    currentPage = 1; // Reset to first page for new results
    renderImages(filteredImages, true); // Render the first page of filtered images, clearing previous
    updateLoadMoreButton(); // Update button visibility
}

// Function to render images to the gallery
function renderImages(imagesToRender, reset = false) {
    console.log(`Rendering ${imagesToRender.length} images (reset: ${reset})...`);
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    if (reset) {
        galleryGrid.innerHTML = ''; // Clear existing images if resetting
    }

    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const imagesForCurrentPage = imagesToRender.slice(startIndex, endIndex);

    if (imagesForCurrentPage.length === 0 && reset) {
         galleryGrid.innerHTML = '<p>No images found matching your criteria.</p>';
    }

    imagesForCurrentPage.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        // Check if item is collected to set initial icon
        const collectedClass = isCollected(item.img_url) ? 'fas' : 'far';

        galleryItem.innerHTML = `
            <img src=\"${item.img_url}\" alt=\"${item.name}\" loading=\"lazy\">\n
            <div class=\"overlay\">\n
                <div class=\"item-info\">\n
                    <h3>${item.name}</h3>\n
                    <p>Shape: ${item.shape || 'N/A'}</p>\n
                    <p>Style: ${item.style || 'N/A'}</p>\n
                    <p>Color: ${item.color || 'N/A'}</p>\n
                </div>\n
                <!-- Save button with data attribute for image URL -->\n                <button class=\"save-btn\" data-img=\"${item.img_url}\" data-name=\"${item.name}\" data-shape=\"${item.shape || ''}\" data-style=\"${item.style || ''}\" data-color=\"${item.color || ''}\">\n                    <i class=\"${collectedClass} fa-bookmark\"></i> \n                </button>\n
            </div>\n
        `;
        galleryGrid.appendChild(galleryItem);
    });

    isLoading = false; // Finished loading current page
    // Attach event listeners after rendering
    attachSaveButtonListeners();
}

// Function to attach event listeners to save buttons using event delegation
function attachSaveButtonListeners() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        galleryGrid.removeEventListener('click', handleSaveButtonClick); // Prevent multiple listeners
        galleryGrid.addEventListener('click', handleSaveButtonClick);
    }
}

// Event handler for save button clicks
function handleSaveButtonClick(event) {
    const target = event.target.closest('.save-btn');
    if (target) {
        const imgUrl = target.getAttribute('data-img');
        const isCurrentlyCollected = isCollected(imgUrl);
        const icon = target.querySelector('i');

        if (isCurrentlyCollected) {
            removeCollection(imgUrl);
            icon.classList.remove('fas');
            icon.classList.add('far');
        } else {
            const itemToCollect = {
                img_url: imgUrl,
                name: target.getAttribute('data-name'),
                shape: target.getAttribute('data-shape'),
                style: target.getAttribute('data-style'),
                color: target.getAttribute('data-color')
            };
            addCollection(itemToCollect);
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
    }
}

// Function to update the state of the Load More button
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;

    const startIndex = currentPage * imagesPerPage;
    if (startIndex < filteredImages.length) {
        loadMoreBtn.style.display = 'block';
        hasMore = true;
        console.log('Load More button shown.');
    } else {
        loadMoreBtn.style.display = 'none';
        hasMore = false;
        console.log('Load More button hidden (no more images).');
    }
}

// Event listener for Load More button
function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    console.log('Setting up Load More button...');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            if (!isLoading && hasMore) {
                isLoading = true;
                currentPage++;
                renderImages(filteredImages, false); // Append images
                // No need to call updateLoadMoreButton here, renderImages does it
                console.log('Loading more images...');
            } else {
                console.log('Load More clicked, but not loading or no more images.');
            }
        });
    } else {
        console.error('Load More button not found.');
    }
}

// Event listeners for filter changes and apply button
function setupFiltersAndSearch() {
    console.log('Setting up filters and search...');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    const searchInput = document.querySelector('.main-search-bar input');

    // Add event listener for Apply Filters button (already exists)
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFiltersAndSearch(); // Apply filters and search
            // Close filter sidebar after applying filters
            if (filterSidebar) {
                filterSidebar.classList.remove('active');
                console.log('Filter sidebar closed after applying filters.');
            }
        });
    }

    // Add event listener for search input - trigger filtering on input
    if (searchInput) {
        searchInput.addEventListener('input', applyFiltersAndSearch);
        console.log('Added input listener to search input.');
    }

    // Add event listeners for filter checkbox changes - trigger filtering on change
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFiltersAndSearch);
        console.log(`Added change listener to filter checkbox: ${checkbox.value}`);
    });

    // Optional: Apply filters automatically on search input change (instead of button click)
    // if (searchInput) {
    //     searchInput.addEventListener('input', applyFiltersAndSearch);
    // }
}

// Filter sidebar toggle logic
function setupFilterSidebarToggle() {
    console.log('Setting up filter sidebar toggle...');
    const filterSidebar = document.getElementById('filterSidebar');
    const openFiltersBtn = document.getElementById('openFilters');
    const closeFiltersBtn = document.getElementById('closeFilters');

    if (filterSidebar && openFiltersBtn && closeFiltersBtn) {
        openFiltersBtn.addEventListener('click', function() {
            filterSidebar.classList.add('active');
            console.log('Filter sidebar opened.');
        });

        closeFiltersBtn.addEventListener('click', function() {
            filterSidebar.classList.remove('active');
            console.log('Filter sidebar closed.');
        });
    } else {
        console.error('Filter sidebar elements not found.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired. Initializing page...');
    loadAllImages(); // Start by loading all images
    setupLoadMoreButton(); // Setup load more button listener
    setupFiltersAndSearch(); // Setup filter and search listeners
    setupFilterSidebarToggle(); // Setup filter sidebar toggle
    // attachSaveButtonListeners(); // This is now called within renderImages
}); 