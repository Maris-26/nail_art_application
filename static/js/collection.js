document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('collectionGrid');
    // let collections = JSON.parse(localStorage.getItem('collections') || '[]'); // 不再从localStorage读取

    // 1. 获取当前登录用户的收藏列表
    fetch('/api/user/collections')
        .then(res => res.json())
        .then(userCollectionData => {
            if (userCollectionData.success && userCollectionData.collections) {
                const userCollections = userCollectionData.collections; // 当前用户的收藏图片URL列表
                
                // 2. 获取所有图片数据
                fetch('/api/images?per_page=1000') // 获取足够多的图片以便过滤
                    .then(res => res.json())
                    .then(allImageData => {
                        if (allImageData.images) {
                            // 3. 过滤出用户收藏的图片
                            const collectedImages = allImageData.images.filter(item => userCollections.includes(item.img_url));
                            // 4. 渲染收藏图片
                            renderCollection(collectedImages);
                        }
                    });
            } else if (!userCollectionData.logged_in) {
                 grid.innerHTML = '<p style="text-align:center;color:#888;width:100%">Please login to view your collections.</p>';
            }
            else {
                 grid.innerHTML = '<p style="text-align:center;color:#888;width:100%">Error loading collections.</p>';
            }
        })
         .catch(error => {
            console.error('Error fetching user collections:', error);
            grid.innerHTML = '<p style="text-align:center;color:#888;width:100%">Error loading collections.</p>';
         });

    function renderCollection(images) {
        grid.innerHTML = '';
        if (images.length === 0) {
            grid.innerHTML = '<p style="text-align:center;color:#888;width:100%">No collections yet.</p>';
            return;
        }
        images.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            // const collections = JSON.parse(localStorage.getItem('collections') || '[]'); // 不再从localStorage读取
            // const isCollected = collections.includes(item.img_url);
            // 在收藏页，所有显示的图片都是已收藏状态，直接显示实心书签
            div.innerHTML = `
                <div class="gallery-image">
                    <img src="${item.img_url}" alt="${item.name}">
                    <div class="gallery-overlay">
                        <button class="save-btn" data-img="${item.img_url}" data-collected="true">
                            <i class="fas fa-bookmark"></i>
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
        // 绑定取消收藏事件
        grid.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const imgUrl = this.getAttribute('data-img');
                // let collections = JSON.parse(localStorage.getItem('collections') || '[]'); // 不再修改localStorage
                // collections = collections.filter(i => i !== img);
                // localStorage.setItem('collections', JSON.stringify(collections));

                // 调用后端API取消收藏
                const formData = new FormData();
                formData.append('img_url', imgUrl);

                fetch('/api/uncollect', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // 从UI中移除该图片
                        this.closest('.gallery-item').remove();
                         // 如果所有图片都被移除，显示"No collections yet."
                        if (grid.children.length === 0) {
                             grid.innerHTML = '<p style="text-align:center;color:#888;width:100%">No collections yet.</p>';
                        }
                       console.log(data.message);
                    } else {
                        alert('Uncollect failed: ' + data.message);
                    }
                })
                .catch(error => {
                     console.error('Error uncollecting:', error);
                     alert('An error occurred during uncollect.');
                });
            });
        });
    }
}); 