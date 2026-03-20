// Логика списка желаний

let wishlist = JSON.parse(localStorage.getItem('rosaNoireWishlist')) || [];

/**
 * Добавить товар в список желаний
 * @param {object} product - Объект товара
 */
function addToWishlist(product) {
    if (!wishlist.find(item => item.id === product.id)) {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category
        });
        localStorage.setItem('rosaNoireWishlist', JSON.stringify(wishlist));
        updateWishlistUI();
        showToast(`${product.name} добавлен в список желаний ♥`);
    } else {
        showToast('Товар уже в списке желаний');
    }
}

/**
 * Удалить товар из списка желаний
 * @param {number} productId - ID товара
 */
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('rosaNoireWishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

/**
 * Проверить, находится ли товар в списке желаний
 * @param {number} productId - ID товара
 * @returns {boolean}
 */
function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

/**
 * Получить размер списка желаний
 * @returns {number}
 */
function getWishlistCount() {
    return wishlist.length;
}

/**
 * Обновить интерфейс списка желаний
 */
function updateWishlistUI() {
    // Обновить значок сердца на всех карточках
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.id);
        if (isInWishlist(productId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart" style="color: #C5A267;"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });

    // Обновить счетчик желаний в хедере
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.innerText = getWishlistCount();
    }

    // Обновить содержимое модалки желаний если она открыта
    if (document.getElementById('wishlistModal').style.display === 'flex') {
        renderWishlist();
    }
}

/**
 * Отобразить список желаний
 */
function renderWishlist() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 2rem; opacity: 0.7;">
            <i class="fas fa-heart" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
            <p>Ваш список желаний пуст. Добавьте товары, которые вас вдохновляют.</p>
        </div>`;
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <div class="wishlist-item" data-id="${item.id}" style="cursor: pointer;">
            <img src="${item.image}" alt="${item.name}" class="wishlist-item-img">
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${item.name}</div>
                <div class="wishlist-item-price">${item.price} ₽</div>
                <div class="wishlist-item-category" style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.3rem;">
                    ${item.category === 'lips' ? 'Для губ' : item.category === 'face' ? 'Для лица' : 'Для глаз'}
                </div>
            </div>
            <button class="wishlist-remove-btn" data-id="${item.id}" style="background: none; border: none; color: #C5A267; cursor: pointer; font-size: 1.2rem;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Обработчики удаления
    document.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            removeFromWishlist(id);
        });
    });

    // Обработчики открытия товара
    document.querySelectorAll('.wishlist-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-remove-btn')) return;
            const id = parseInt(item.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) {
                document.getElementById('wishlistModal').style.display = 'none';
                openProductModal(product);
            }
        });
    });
}
