// Управление UI авторизации

let currentAuthModal = null; // 'login' или 'register'

/**
 * Открыть модалку авторизации (логин)
 */
function openLoginModal() {
    document.getElementById('authModal').style.display = 'flex';
    currentAuthModal = 'login';
    switchAuthForm('login');
}

/**
 * Открыть модалку регистрации
 */
function openRegisterModal() {
    document.getElementById('authModal').style.display = 'flex';
    currentAuthModal = 'register';
    switchAuthForm('register');
}

/**
 * Закрыть модалку авторизации
 */
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    clearAuthForm();
}

/**
 * Переключиться между формами логина и регистрации
 * @param {string} form - 'login' или 'register'
 */
function switchAuthForm(form) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');

    if (form === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        currentAuthModal = 'login';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        currentAuthModal = 'register';
    }
}

/**
 * Обработать отправку формы логина
 */
function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const result = login(email, password);

    if (result.success) {
        showToast(result.message);
        closeAuthModal();
        updateAuthUI();
    } else {
        showAuthError(result.message);
    }
}

/**
 * Обработать отправку формы регистрации
 */
function handleRegisterSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const fullName = document.getElementById('registerName').value;

    const result = register(email, password, fullName);

    if (result.success) {
        showToast(result.message);
        switchAuthForm('login');
        clearAuthForm();
    } else {
        showAuthError(result.message);
    }
}

/**
 * Показать ошибку в форме авторизации
 * @param {string} message - Сообщение об ошибке
 */
function showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    errorDiv.style.display = 'block';
    errorDiv.innerText = message;
}

/**
 * Скрыть ошибку в форме авторизации
 */
function clearAuthForm() {
    document.getElementById('authError').style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerName').value = '';
}

/**
 * Обновить UI в зависимости от статуса авторизации
 */
function updateAuthUI() {
    const authButton = document.getElementById('authButton');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const cart = document.getElementById('cartIcon');

    if (isAuthenticated()) {
        const user = getCurrentUser();
        authButton.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.innerText = user.fullName;
        cart.style.display = 'flex';
    } else {
        authButton.style.display = 'block';
        userMenu.style.display = 'none';
        cart.style.display = 'none';
    }
}

/**
 * Обработать выход из аккаунта
 */
function handleLogout() {
    logout();
    updateAuthUI();
    cart = [];
    updateCartCount();
    showToast('Вы вышли из аккаунта');
}

/**
 * Инициализировать обработчики авторизации
 */
function initAuthHandlers() {
    // Кнопка авторизации в хедере
    const authButton = document.getElementById('authButton');
    if (authButton) {
        authButton.addEventListener('click', openLoginModal);
    }

    // Кнопки в модалке
    document.getElementById('loginTab').addEventListener('click', () => switchAuthForm('login'));
    document.getElementById('registerTab').addEventListener('click', () => switchAuthForm('register'));

    // Отправка форм
    document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
    document.getElementById('registerForm').addEventListener('submit', handleRegisterSubmit);

    // Закрытие модалки
    document.getElementById('closeAuth').addEventListener('click', closeAuthModal);

    // Закрытие при клике вне окна
    const authModal = document.getElementById('authModal');
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });

    // Кнопка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Обновить UI при загрузке
    updateAuthUI();
}
