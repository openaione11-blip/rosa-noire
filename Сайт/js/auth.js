// Логика авторизации и регистрации

let currentUser = JSON.parse(localStorage.getItem('rosaNoireUser')) || null;
let users = JSON.parse(localStorage.getItem('rosaNoireUsers')) || [];

/**
 * Регистрация нового пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @param {string} fullName - Полное имя
 * @returns {object} - {success: boolean, message: string}
 */
function register(email, password, fullName) {
    // Валидация
    if (!email || !password || !fullName) {
        return { success: false, message: 'Все поля обязательны' };
    }

    if (password.length < 6) {
        return { success: false, message: 'Пароль должен быть не менее 6 символов' };
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return { success: false, message: 'Введите корректный email' };
    }

    // Проверка на существование пользователя
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Пользователь с таким email уже существует' };
    }

    // Создание нового пользователя
    const newUser = {
        id: Date.now(),
        email: email,
        password: btoa(password), // базовое кодирование (не криптографически защищенное!)
        fullName: fullName,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('rosaNoireUsers', JSON.stringify(users));

    return { success: true, message: 'Регистрация успешна! Теперь войдите' };
}

/**
 * Авторизация пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @returns {object} - {success: boolean, message: string, user?: object}
 */
function login(email, password) {
    if (!email || !password) {
        return { success: false, message: 'Введите email и пароль' };
    }

    const user = users.find(u => u.email === email && u.password === btoa(password));

    if (!user) {
        return { success: false, message: 'Неверный email или пароль' };
    }

    currentUser = {
        id: user.id,
        email: user.email,
        fullName: user.fullName
    };

    localStorage.setItem('rosaNoireUser', JSON.stringify(currentUser));
    return { success: true, message: 'Вы успешно вошли', user: currentUser };
}

/**
 * Выход из аккаунта
 */
function logout() {
    currentUser = null;
    localStorage.removeItem('rosaNoireUser');
}

/**
 * Проверить, авторизован ли пользователь
 * @returns {boolean}
 */
function isAuthenticated() {
    return currentUser !== null;
}

/**
 * Получить текущего пользователя
 * @returns {object|null}
 */
function getCurrentUser() {
    return currentUser;
}
