// Main JavaScript file
let currentPage = 1;
let isLoading = false;
let hasMore = true;
let lastQuery = {};
let userCollections = []; // 新增变量，存储当前用户的收藏列表

// 用户认证相关函数
function updateAuthUI(user) {
    console.log('updateAuthUI called with user:', user); // Log user data received
    const authDiv = document.querySelector('.nav-auth');
    if (!authDiv) {
        console.error('Error: .nav-auth div not found.'); // Log if auth div is missing
        // Potentially retry finding the element or handle gracefully
        return; // Exit if the target element is not found
    }
    authDiv.innerHTML = ''; // 清空现有内容
    if (user && user.logged_in) {
        console.log('User logged in, updating auth UI.'); // Log when updating for logged in user
        authDiv.innerHTML = `
            <span class="nav-link">Hello, ${user.email}!</span>
            <a href="#" id="logoutLink" class="nav-link highlight">Logout</a>
        `;
        const logoutLinkElement = document.getElementById('logoutLink');
        if (logoutLinkElement) {
            logoutLinkElement.addEventListener('click', handleLogout);
        }
        fetchUserCollections(); // 用户登录后获取收藏列表
    } else {
        console.log('User not logged in, updating auth UI.'); // Log when updating for not logged in user
        authDiv.innerHTML = `
            <a href="#" id="showLoginLink" class="nav-link">Sign In</a>
            <a href="#" id="showRegisterLink" class="nav-link highlight">Sign Up</a>
        `;
        
        // 在innerHTML设置后，立即获取元素并绑定事件
        const showLoginLinkElement = document.getElementById('showLoginLink');
        const showRegisterLinkElement = document.getElementById('showRegisterLink');
        
        if (showLoginLinkElement) {
            showLoginLinkElement.addEventListener('click', function(e) {
                e.preventDefault();
                openModal('loginModal');
            });
        }
        
        if (showRegisterLinkElement) {
            showRegisterLinkElement.addEventListener('click', function(e) {
                e.preventDefault();
                openModal('registerModal');
            });
        }
        userCollections = []; // 用户登出或未登录时清空收藏列表
    }
}

function checkLoginStatus() {
    console.log('checkLoginStatus called.'); // Log when function is called
    fetch('/api/user')
        .then(res => {
            console.log('/api/user response status:', res.status); // Log response status
            return res.json();
        })
        .then(data => {
            console.log('/api/user response data:', data); // Log /api/user response data
            updateAuthUI(data);
        })
        .catch(error => {
            console.error('Error fetching user status:', error); // Log any fetch errors
            updateAuthUI(null); // Assume not logged in on error
        });
}

function handleLogout(e) {
    e.preventDefault();
    fetch('/logout', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                updateAuthUI(null); // 更新UI为未登录状态
            }
        });
}

function fetchUserCollections() {
     console.log('Fetching user collections...'); // Log initiation
     fetch('/api/user/collections')
        .then(res => {
            console.log('/api/user/collections response status:', res.status); // Log status
            return res.json();
        })
        .then(data => {
            console.log('/api/user/collections response data:', data); // Log data
            if (data.success) {
                userCollections = data.collections; // 更新用户收藏列表
                console.log('User collections updated:', userCollections); // Log updated collections
                // Update the UI for currently displayed images based on the new collections list
                updateGalleryItemCollectionState(); // Call new function to update UI

                // 如果当前在收藏页，需要重新渲染 (This part is handled by collection.js, keeping comment for context)
                if (window.location.pathname === '/collections') {
                    // 在collection.js中处理渲染逻辑
                    // 可以触发一个自定义事件或直接调用collection.js中的渲染函数
                    // 为了简单，这里先不处理，假设用户会刷新收藏页
                }
            }
        })
        .catch(error => {
            console.error('Error fetching user collections:', error); // Log errors
            userCollections = []; // Clear collections on error
        });
}

// New function to update collection state of already rendered gallery items
function updateGalleryItemCollectionState() {
    console.log('Updating gallery item collection states...'); // Log initiation
    document.querySelectorAll('.gallery-item .save-btn').forEach(btn => {
        const imgUrl = btn.getAttribute('data-img');
        const isCollected = userCollections.includes(imgUrl);
        const icon = btn.querySelector('i');

        // Update the data-collected attribute and icon class
        btn.setAttribute('data-collected', isCollected);
        if (isCollected) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
        console.log(`Updated collection state for ${imgUrl}: ${isCollected}`); // Log each item update
    });
}

// 弹窗相关函数
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        console.log(`Opened modal: ${modalId}`); // Added log
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        console.log(`Closed modal: ${modalId}`); // Added log
    }
}

function setupModals() {
    // 关闭按钮事件
    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', function() {
            closeModal(this.closest('.modal').id);
        });
    });
    // 点击 modal 外部关闭
    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target == modal) {
                closeModal(modal.id);
            }
        });
    });

    // 注册和登录表单提交事件
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // 弹窗之间切换链接事件
    document.getElementById('showRegisterModal').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal('loginModal');
        openModal('registerModal');
    });
    document.getElementById('showLoginModal').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal('registerModal');
        openModal('loginModal');
    });
}

function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const messageElement = document.getElementById('registerMessage');
    const formData = new FormData(form);
    fetch('/register', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        messageElement.textContent = data.message;
        messageElement.style.color = data.success ? 'green' : 'red';
        if (data.success) {
            form.reset();
            // 注册成功后自动打开登录弹窗
            setTimeout(() => {
                closeModal('registerModal');
                openModal('loginModal');
            }, 1000);
        }
    });
}

function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const messageElement = document.getElementById('loginMessage');
    const formData = new FormData(form);
    fetch('/login', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        messageElement.textContent = data.message;
        messageElement.style.color = data.success ? 'green' : 'red';
        if (data.success) {
            closeModal('loginModal');
            checkLoginStatus(); // 更新导航栏状态
        }
    });
}

// 初始化
function initializeGallery() {
    console.log('initializeGallery called.'); // Log initialization
    loadImages(1, true);
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        console.log('Load More/Explore More button element found.', loadMoreBtn); // Log if button element is found
        console.log('Adding event listener to Load More/Explore More button.'); // Log adding listener
        loadMoreBtn.addEventListener('click', function() {
            if (!isLoading && hasMore) {
                console.log('Load More/Explore More button clicked, loading next page.'); // Log click and load
                loadImages(currentPage + 1, false);
            } else {
                console.log('Load More/Explore More button clicked but not loading/no more images. isLoading:', isLoading, 'hasMore:', hasMore); // Log load more issues
            }
        });
    } else {
         console.error('Load More/Explore More button not found on this page.'); // Log if button is missing with error level
    }
}

function getQueryParams() {
    // 获取当前搜索和筛选条件
    const search = document.querySelector('.main-search-bar input')?.value.trim() || '';
    
    // 获取所有选中的 Shape 复选框的值
    const shapes = Array.from(document.querySelectorAll('input[name="shape"]:checked'))
                        .map(cb => cb.value);

    // 获取所有选中的 Style 复选框的值
    const styles = Array.from(document.querySelectorAll('input[name="style"]:checked'))
                        .map(cb => cb.value);

    // 获取所有选中的 Color 复选框的值
    const colors = Array.from(document.querySelectorAll('input[name="color"]:checked'))
                        .map(cb => cb.value);

    // 构造查询参数对象，只包含有选中值的分类
    const params = { search: search };
    if (shapes.length > 0) params.shape = shapes;
    if (styles.length > 0) params.style = styles;
    if (colors.length > 0) params.color = colors;

    console.log('Generated query params:', params); // Log generated params
    return params;
}

function loadImages(page = 1, reset = false) {
    console.log(`Loading images - Page: ${page}, Reset: ${reset}`); // Log loadImages call
    isLoading = true;
    const params = getQueryParams();
    lastQuery = params;
    let url = `/api/images?page=${page}`;

    // Append parameters, handling arrays for filters
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    // Iterate over array parameters and append each value
    if (params.shape) {
        params.shape.forEach(val => { url += `&shape=${encodeURIComponent(val)}`; });
    }
    if (params.style) {
        params.style.forEach(val => { url += `&style=${encodeURIComponent(val)}`; });
    }
    if (params.color) {
        params.color.forEach(val => { url += `&color=${encodeURIComponent(val)}`; });
    }

    console.log('Fetching URL:', url); // Log the URL being fetched
    fetch(url)
        .then(res => {
            console.log('Fetch response status:', res.status); // Log fetch response status
            return res.json();
        })
        .then(data => {
            console.log('Fetch response data:', data); // Log fetch response data
            renderImages(data.images, reset);
            currentPage = data.page;
            // Calculate hasMore based on total items vs current page items
            hasMore = (data.page * data.per_page) < data.total;
            console.log(`Calculated hasMore: ${hasMore}. Current Page: ${data.page}, Per Page: ${data.per_page}, Total: ${data.total}`); // Log hasMore calculation

            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (loadMoreBtn) {
                 loadMoreBtn.style.display = hasMore ? '' : 'none';
                 console.log('Load More/Explore More button display set to:', loadMoreBtn.style.display); // Log button display state
            }
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching images:', error); // Log any fetch errors
            isLoading = false;
        });
}

function renderImages(images, reset = false) {
    const grid = document.getElementById('galleryGrid');
    if (reset) grid.innerHTML = '';
    images.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        const isCollected = userCollections.includes(item.img_url); // 从userCollections判断是否已收藏
        div.innerHTML = `
            <div class="gallery-image">
                <img src="${item.img_url}" alt="${item.name}">
                <div class="gallery-overlay">
                    <button class="save-btn" data-img="${item.img_url}" data-collected="${isCollected}">
                        <i class="${isCollected ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                </div>
            </div>
            <div class="gallery-info">
                <h3>${item.name}</h3>
                <div class="gallery-tags">
                    <span class="tag">${item.shape}</span>
                    <span class="tag">${item.style}</span>
                    <span class="tag">${item.color}</span>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
    // 绑定收藏按钮事件
    grid.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const imgUrl = this.getAttribute('data-img');
            const isCollected = this.getAttribute('data-collected') === 'true';
            const icon = this.querySelector('i');

            // Check if user is logged in BEFORE making API call
            fetch('/api/user')
                .then(res => res.json())
                .then(userData => {
                    console.log('Inside save-btn click - user data:', userData); // Log user data in click handler
                    if (!userData || !userData.logged_in) {
                        console.log('User not logged in, opening login modal.'); // Log when opening modal
                        openModal('loginModal');
                        return;
                    }

                    const endpoint = isCollected ? '/api/uncollect' : '/api/collect';
                    const method = 'POST';
                    const formData = new FormData();
                    formData.append('img_url', imgUrl);

                    fetch(endpoint, {
                        method: method,
                        body: formData
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            // 更新按钮UI
                            if (isCollected) {
                                icon.classList.remove('fas');
                                icon.classList.add('far');
                                this.setAttribute('data-collected', 'false');
                                userCollections = userCollections.filter(url => url !== imgUrl); // 更新本地收藏列表
                            } else {
                                icon.classList.remove('far');
                                icon.classList.add('fas');
                                this.setAttribute('data-collected', 'true');
                                userCollections.push(imgUrl); // 更新本地收藏列表
                            }
                             // 可选：给用户一个提示
                            console.log(data.message);
                        } else {
                             // 如果后端返回未登录，则提示用户登录
                             if (data.message === 'Not logged in') {
                                 openModal('loginModal');
                             } else {
                                alert('Operation failed: ' + data.message);
                             }
                        }
                    })
                    .catch(error => {
                         console.error('Error collecting/uncollecting:', error);
                         alert('An error occurred.');
                    });
                });
        });
    });
}

function initializeSearch() {
    const input = document.querySelector('.main-search-bar input');
    const btn = document.querySelector('.main-search-bar button');
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = 1;
        loadImages(1, true);
    });
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            currentPage = 1;
            loadImages(1, true);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired.'); // Log when DOM is ready

    // Filter sidebar toggle
    const filterSidebar = document.getElementById('filterSidebar');
    const openFiltersBtn = document.getElementById('openFilters');
    const closeFiltersBtn = document.getElementById('closeFilters');

    // Check if filter elements exist before adding listeners
    if (filterSidebar && openFiltersBtn && closeFiltersBtn) {
        openFiltersBtn.addEventListener('click', function() {
            console.log('Open Filters button clicked.'); // Added log
            filterSidebar.classList.add('active');
        });

        closeFiltersBtn.addEventListener('click', function() {
            console.log('Close Filters button clicked.'); // Added log
            filterSidebar.classList.remove('active');
        });

        // Add event listener for the new Apply Filters button
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                console.log('Apply Filters button clicked.'); // Log button click
                // Close filter sidebar by removing the active class
                filterSidebar.classList.remove('active'); // Modified closing logic
                // closeModal('filterSidebar'); // Removed call to closeModal

                currentPage = 1; // Reset to first page on new filter application
                loadImages(1, true); // Load images with new filters
            });
        }
    }

    // Only initialize gallery/search/filters on the home page
    if (window.location.pathname === '/') {
        console.log('Initializing home page scripts.');
        initializeSearch(); // Keep search initialization for the top search bar
        initializeGallery();
    } else if (window.location.pathname === '/collections') {
         console.log('Initializing collections page scripts.');
         // collection.js is loaded separately, but ensure main.js core functions run
         // No specific initialization needed here from main.js for collections content
    }

    setupModals(); // 初始化弹窗 - Modals are in base.html, should work on all pages
    checkLoginStatus(); // 检查登录状态 - This should run on all pages loading base.html
}); 