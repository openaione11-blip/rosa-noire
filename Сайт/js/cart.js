// Логика корзины

let cart = JSON.parse(localStorage.getItem('rosaNoireCart')) || [];

/**
 * Обновить счетчик товаров в корзине
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').innerText = totalItems;
    localStorage.setItem('rosaNoireCart', JSON.stringify(cart));
    renderCartDrawer();
}

/**
 * Добавить товар в корзину
 * @param {object} product - Объект товара
 * @param {number} quantity - Количество (по умолчанию 1)
 */
function addToCart(product, quantity = 1) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }
    updateCartCount();
    showToast(`Добавлено: ${product.name}`);
}

/**
 * Отобразить содержимое корзины в сайдбаре
 */
function renderCartDrawer() {
    const container = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('cartTotalPrice');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-bag"></i><p>Корзина пуста, но красота ждёт вас.</p></div>`;
        totalSpan.innerText = "0 ₽";
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, idx) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-img"><i class="fas ${item.icon || 'fa-gem'}"></i></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                    <div class="cart-item-qty">
                        <button data-id="${item.id}" data-delta="-1">-</button>
                        <span>${item.quantity}</span>
                        <button data-id="${item.id}" data-delta="1">+</button>
                        <button data-id="${item.id}" data-delta="0" style="background:#442e22; margin-left:8px;">✕</button>
                    </div>
                </div>
                <div>${itemTotal} ₽</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    totalSpan.innerText = total + " ₽";

    // Обработчики кнопок +/-/удалить
    document.querySelectorAll('.cart-item-qty button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const delta = parseInt(btn.dataset.delta);
            const itemIndex = cart.findIndex(i => i.id === id);
            if (itemIndex === -1) return;
            
            if (delta === 0) {
                cart.splice(itemIndex, 1);
            } else {
                const newQty = cart[itemIndex].quantity + delta;
                if (newQty <= 0) cart.splice(itemIndex, 1);
                else cart[itemIndex].quantity = newQty;
            }
            updateCartCount();
        });
    });
}

/**
 * Очистить корзину
 */
function clearCart() {
    cart = [];
    updateCartCount();
}

/**
 * Получить общую стоимость товаров в корзине
 * @returns {number}
 */
function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
