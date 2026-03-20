// Управление пользовательским интерфейсом

let currentCategory = "all";
let currentModalProduct = null;

/**
 * Отобразить товары в сетке каталога
 */
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    let filtered = products;
    
    if (currentCategory !== "all") {
        filtered = products.filter(p => p.category === currentCategory);
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center;">Товары не найдены. Скоро новое поступление.</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            <button class="wishlist-btn" data-id="${product.id}" style="display: flex;">
                <i class="far fa-heart"></i>
            </button>
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">${product.price} ₽</div>
                <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
            </div>
        </div>
    `).join('');

    // События на карточки (открытие модалки)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.wishlist-btn')) return;
            const id = parseInt(card.dataset.id);
            const prod = products.find(p => p.id === id);
            if (prod) openProductModal(prod);
        });
    });
    
    // Кнопки "добавить в корзину"
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) addToCart(product, 1);
        });
    });

    // Кнопки добавления в список желаний
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) {
                if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                } else {
                    addToWishlist(product);
                }
            }
        });
    });
}

/**
 * Открыть модалку с деталями товара
 * @param {object} product - Объект товара
 */
function openProductModal(product) {
    currentModalProduct = product;
    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalPrice').innerHTML = `${product.price} ₽`;
    document.getElementById('modalDesc').innerText = product.description;
    document.getElementById('modalIngr').innerText = product.ingredients;
    
    const modalImgDiv = document.getElementById('modalImgArea');
    modalImgDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="modal-product-image">
    `;
    
    const modal = document.getElementById('productModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Закрыть модалку товара
 */
function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = '';
}

/**
 * Инициализировать обработчики событий модалки товара
 */
function initProductModalHandlers() {
    document.querySelector('.close-modal').addEventListener('click', closeProductModal);
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('productModal');
        if (e.target === modal) {
            closeProductModal();
        }
    });
    
    document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
        if (currentModalProduct) {
            addToCart(currentModalProduct, 1);
            closeProductModal();
        }
    });
}

/**
 * Инициализировать обработчики событий фильтров категорий
 */
function initCategoryFilterHandlers() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.cat;
            renderProducts();
        });
    });
}

/**
 * Инициализировать обработчики событий корзины
 */
function initCartHandlers() {
    const cartDrawer = document.getElementById('cartDrawer');
    
    // Открыть корзину
    document.getElementById('cartIcon').addEventListener('click', () => {
        cartDrawer.classList.add('open');
        renderCartDrawer();
    });
    
    // Закрыть корзину
    document.getElementById('closeCart').addEventListener('click', () => {
        cartDrawer.classList.remove('open');
    });
    
    // Оформить заказ
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Корзина пуста, добавьте изысканные продукты');
        } else {
            const total = getCartTotal();
            alert(`Спасибо за заказ! Сумма ${total} ₽. Менеджер свяжется с вами для уточнения деталей.`);
            clearCart();
            cartDrawer.classList.remove('open');
            showToast('Заказ оформлен. Ждите роскошного преображения ✨');
        }
    });
    
    // Закрытие при клике вне сайдбара
    window.addEventListener('click', (e) => {
        if (e.target === cartDrawer && cartDrawer.classList.contains('open')) {
            cartDrawer.classList.remove('open');
        }
    });
}

/**
 * Инициализировать навигацию по якорям
 */
function initNavigationHandlers() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            const el = document.getElementById(target);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/**
 * Инициализировать обработчики списка желаний
 */
function initWishlistHandlers() {
    const wishlistIcon = document.getElementById('wishlistIcon');
    const wishlistModal = document.getElementById('wishlistModal');
    const closeWishlistBtn = document.querySelector('.close-wishlist');

    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', () => {
            wishlistModal.style.display = 'flex';
            renderWishlist();
        });
    }

    if (closeWishlistBtn) {
        closeWishlistBtn.addEventListener('click', () => {
            wishlistModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === wishlistModal) {
            wishlistModal.style.display = 'none';
        }
    });
}

/**
 * Инициализировать обработчики мобильного меню
 */
function initMobileMenuHandlers() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Закрывать меню при клике на ссылку
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

/**
 * Инициализировать весь интерфейс
 */
function initializeUI() {
    initAuthHandlers();
    renderProducts();
    updateCartCount();
    updateWishlistUI();
    initProductModalHandlers();
    initCategoryFilterHandlers();
    initCartHandlers();
    initWishlistHandlers();
    initNavigationHandlers();
    initMobileMenuHandlers();
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeUI);
