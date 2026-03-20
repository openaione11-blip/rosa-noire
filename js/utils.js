// Вспомогательные функции

/**
 * Показать уведомление (тост) в нижней части экрана
 * @param {string} msg - Текст сообщения
 */
function showToast(msg) {
    let toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#C5A267';
    toast.style.color = '#0B0B0B';
    toast.style.padding = '10px 24px';
    toast.style.borderRadius = '40px';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '1200';
    toast.style.fontFamily = 'Montserrat';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}
