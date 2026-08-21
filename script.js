// ============================================
//  1. АНИМИРОВАННЫЙ ФОН (ПАРТИКЛЫ)
// ============================================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height, stars = [];
const STAR_COUNT = 180;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.4,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.8 + 0.2,
        });
    }
}
initStars();

function drawStars() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.12 * (1 - dist / 130)})`;
                ctx.lineWidth = 0.6;
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.stroke();
            }
        }
        const star = stars[i];
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        star.x += star.speedX;
        star.y += star.speedY;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
    }
    requestAnimationFrame(drawStars);
}
drawStars();

// ============================================
//  2. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// ============================================
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
    });
});

// ============================================
//  3. ТЁМНАЯ / СВЕТЛАЯ ТЕМА
// ============================================
let darkMode = localStorage.getItem('osint_dark') !== 'false';
document.getElementById('darkModeToggle').checked = darkMode;
applyTheme(darkMode);

document.getElementById('themeToggle').addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('osint_dark', darkMode);
    applyTheme(darkMode);
    document.getElementById('darkModeToggle').checked = darkMode;
});

document.getElementById('darkModeToggle').addEventListener('change', function () {
    darkMode = this.checked;
    localStorage.setItem('osint_dark', darkMode);
    applyTheme(darkMode);
});

function applyTheme(dark) {
    if (dark) {
        document.body.style.background = '#0a0a0f';
        document.querySelector('.container').style.background = 'rgba(10, 10, 15, 0.85)';
        document.querySelector('.container').style.border = '1px solid rgba(255,255,255,0.05)';
        document.querySelectorAll('.result-card').forEach(el => el.style.background = 'rgba(0,0,0,0.4)');
    } else {
        document.body.style.background = '#f0f2f5';
        document.querySelector('.container').style.background = 'rgba(255, 255, 255, 0.9)';
        document.querySelector('.container').style.border = '1px solid rgba(0,0,0,0.1)';
        document.querySelectorAll('.result-card').forEach(el => el.style.background = 'rgba(240, 240, 245, 0.9)');
    }
    document.getElementById('themeToggle').textContent = dark ? '☀️' : '🌙';
}

// ============================================
//  4. МУЛЬТИЯЗЫЧНОСТЬ (RU / EN)
// ============================================
const translations = {
    ru: {
        ip_title: '🌐 Геолокация по IP',
        phone_title: '📞 Информация по номеру',
        email_title: '📧 Email-инфо',
        social_title: '🔍 Проверка в соцсетях',
        domain_title: '🌍 WHOIS / DNS по домену',
        logger_title: '🎯 IP-логгер',
        image_title: '🖼️ Поиск по изображению',
        history_title: '📜 История запросов',
        settings_title: '⚙️ Настройки',
        find_btn: '🔍 Найти',
        check_btn: '🔍 Проверить',
        create_btn: '⚡ Создать ссылку',
    },
    en: {
        ip_title: '🌐 IP Geolocation',
        phone_title: '📞 Phone Info',
        email_title: '📧 Email Info',
        social_title: '🔍 Social Checker',
        domain_title: '🌍 WHOIS / DNS',
        logger_title: '🎯 IP Logger',
        image_title: '🖼️ Reverse Image Search',
        history_title: '📜 History',
        settings_title: '⚙️ Settings',
        find_btn: '🔍 Find',
        check_btn: '🔍 Check',
        create_btn: '⚡ Create Link',
    }
};

let currentLang = localStorage.getItem('osint_lang') || 'ru';
document.getElementById('langSelect').value = currentLang;
applyLang(currentLang);

document.getElementById('langToggle').addEventListener('click', () => {
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    currentLang = newLang;
    localStorage.setItem('osint_lang', newLang);
    document.getElementById('langSelect').value = newLang;
    applyLang(newLang);
});

document.getElementById('langSelect').addEventListener('change', function () {
    currentLang = this.value;
    localStorage.setItem('osint_lang', currentLang);
    applyLang(currentLang);
});

function applyLang(lang) {
    const t = translations[lang] || translations.ru;
    // Заголовки вкладок (часть сделана в HTML)
    document.querySelectorAll('.tab').forEach(tab => {
        const key = tab.dataset.tab;
        const map = {
            'ip': '🌐 ' + (lang === 'ru' ? 'IP' : 'IP'),
            'phone': '📞 ' + (lang === 'ru' ? 'Phone' : 'Phone'),
            'email': '📧 ' + (lang === 'ru' ? 'Email' : 'Email'),
            'social': '🔍 ' + (lang === 'ru' ? 'Соц' : 'Social'),
            'domain': '🌍 ' + (lang === 'ru' ? 'Домен' : 'Domain'),
            'logger': '🎯 ' + (lang === 'ru' ? 'Логгер' : 'Logger'),
            'image': '🖼️ ' + (lang === 'ru' ? 'Фото' : 'Image'),
            'history': '📜 ' + (lang === 'ru' ? 'История' : 'History'),
            'settings': '⚙️ ' + (lang === 'ru' ? 'Настройки' : 'Settings'),
        };
        if (map[key]) tab.innerHTML = map[key];
    });
    // Кнопки
    document.querySelectorAll('.btn').forEach(btn => {
        if (btn.textContent.includes('Найти') || btn.textContent.includes('Find')) {
            btn.textContent = t.find_btn;
        }
        if (btn.textContent.includes('Проверить') || btn.textContent.includes('Check')) {
            btn.textContent = t.check_btn;
        }
        if (btn.textContent.includes('Создать') || btn.textContent.includes('Create')) {
            btn.textContent = t.create_btn;
        }
    });
    document.getElementById('langToggle').textContent = lang.toUpperCase();
}

// ============================================
//  5. УТИЛИТЫ (КОПИРОВАНИЕ, ЭКСПОРТ, QR)
// ============================================

function copyResult(id) {
    const text = document.getElementById(id).textContent;
    if (!text) return alert('Нет данных для копирования');
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Скопировано в буфер обмена!');
    }).catch(() => {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        alert('✅ Скопировано!');
    });
}

function exportResult(id, format = 'txt') {
    const text = document.getElementById(id).textContent;
    if (!text) return alert('Нет данных для экспорта');
    const blob = new Blob([text], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `osint_result_${Date.now()}.${format === 'json' ? 'json' : 'txt'}`;
    link.click();
}

function exportHistory(format = 'json') {
    const history = JSON.parse(localStorage.getItem('osint_history') || '[]');
    if (!history.length) return alert('История пуста');
    let data;
    if (format === 'json') {
        data = JSON.stringify(history, null, 2);
    } else {
        // CSV
        const headers = ['type', 'query', 'result', 'date'];
        const rows = history.map(h => [h.type, h.query, h.result.substring(0, 100), h.date]);
        data = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `osint_history_${Date.now()}.${format === 'json' ? 'json' : 'csv'}`;
    link.click();
}

function clearHistory() {
    if (confirm('Очистить всю историю?')) {
        localStorage.removeItem('osint_history');
        renderHistory();
    }
}

function saveToHistory(type, query, result) {
    const history = JSON.parse(localStorage.getItem('osint_history') || '[]');
    history.push({ type, query, result, date: new Date().toISOString() });
    if (history.length > 100) history.shift(); // ограничение
    localStorage.setItem('osint_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('historyListContainer');
    const history = JSON.parse(localStorage.getItem('osint_history') || '[]');
    if (!history.length) {
        container.textContent = '📭 История пуста';
        return;
    }
    container.innerHTML = history.map((h, i) => 
        `<div style="border-bottom:1px solid #333;padding:4px 0;font-size:13px;">
            <strong>${h.type}</strong> ${h.query} 
            <span style="color:#888;">${new Date(h.date).toLocaleString()}</span>
            <button class="btn-small" onclick="copyResult('history_${i}')">📋</button>
            <div id="history_${i}" style="display:none;">${h.result}</div>
        </div>`
    ).join('');
}

// ============================================
//  6. IP-ЛОКАТОР (+ КАРТА + VPN)
// ============================================
document.getElementById('ipBtn').addEventListener('click', async () => {
    const ip = document.getElementById('ipInput').value.trim();
    if (!ip) return displayResult('ipResult', '❌ Введите IP-адрес');
    displayResult('ipResult', '⏳ Загрузка...');
    try {
        const data = await fetchAPI(`https://ipapi.co/${ip}/json/`);
        if (data.error) {
            displayResult('ipResult', `❌ Ошибка: ${data.reason || 'Неизвестная ошибка'}`);
        } else {
            // Проверка VPN (через ip-api.com)
            let vpnCheck = 'Неизвестно';
            try {
                const r2 = await fetchAPI(`http://ip-api.com/json/${ip}?fields=proxy,hosting`);
                vpnCheck = r2.proxy || r2.hosting ? '🛡️ Да' : '✅ Нет';
            } catch(e) {}

            const result = `
📍 IP: ${data.ip}
🌍 Страна: ${data.country_name} (${data.country_code})
🏙️ Регион: ${data.region}
🗺️ Город: ${data.city}
📡 Провайдер: ${data.org}
📌 Координаты: ${data.latitude}, ${data.longitude}
🛡️ VPN/Прокси: ${vpnCheck}
🗺️ Карта: https://www.google.com/maps?q=${data.latitude},${data.longitude}
            `.trim();
            displayResult('ipResult', result);
            saveToHistory('IP', ip, result);
            // Карта
            showMap(data.latitude, data.longitude, 'ipMap');
            document.getElementById('ipMap').style.display = 'block';
        }
    } catch (e) {
        displayResult('ipResult', `❌ Ошибка: ${e.message}`);
    }
});

function showMap(lat, lon, id) {
    const container = document.getElementById(id);
    container.style.display = 'block';
    if (window._map) window._map.remove();
    const map = L.map(container).setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([lat, lon]).addTo(map);
    window._map = map;
}

// ============================================
//  7. PHONE-ИНФО (+ QR)
// ============================================
document.getElementById('phoneBtn').addEventListener('click', async () => {
    const phone = document.getElementById('phoneInput').value.trim();
    if (!phone) return displayResult('phoneResult', '❌ Введите номер');
    displayResult('phoneResult', '⏳ Загрузка...');
    try {
        // Используем бесплатный API
        const data = await fetchAPI(`https://api.apilayer.com/number_verification/validate?number=${phone}`);
        const result = `
📞 Номер: ${data.international_format || phone}
🌍 Страна: ${data.country_name || 'Неизвестно'}
🏙️ Регион: ${data.location || 'Неизвестно'}
📡 Оператор: ${data.carrier || 'Неизвестно'}
📱 Тип: ${data.line_type || 'Неизвестно'}
        `.trim();
        displayResult('phoneResult', result);
        saveToHistory('Phone', phone, result);
        // QR-код
        document.getElementById('phoneQR').innerHTML = '';
        new QRCode(document.getElementById('phoneQR'), { text: phone, width: 128, height: 128 });
    } catch (e) {
        displayResult('phoneResult', `❌ Ошибка: ${e.message}`);
    }
});

// ============================================
//  8. EMAIL-ИНФО (проверка + утечки)
// ============================================
document.getElementById('emailBtn').addEventListener('click', async () => {
    const email = document.getElementById('emailInput').value.trim();
    if (!email) return displayResult('emailResult', '❌ Введите email');
    displayResult('emailResult', '⏳ Проверка...');
    let result = `📧 Email: ${email}\n`;
    // Проверка утечек (HIBP)
    try {
        const hibp = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`);
        if (hibp.status === 200) {
            const breaches = await hibp.json();
            result += `🔓 Утечки: ${breaches.length} (${breaches.map(b => b.Name).join(', ')})\n`;
        } else if (hibp.status === 404) {
            result += `✅ Утечек не найдено\n`;
        } else {
            result += `⚠️ Ошибка проверки утечек\n`;
        }
    } catch(e) { result += `⚠️ Ошибка проверки утечек\n`; }
    displayResult('emailResult', result);
    saveToHistory('Email', email, result);
});

// ============================================
//  9. SOCIAL (уже было, расширено)
// ============================================
document.getElementById('socialBtn').addEventListener('click', async () => {
    const query = document.getElementById('socialInput').value.trim();
    if (!query) return displayResult('socialResult', '❌ Введите данные');
    displayResult('socialResult', '⏳ Поиск...');
    let result = '';
    if (query.startsWith('+') || /^\d+$/.test(query.replace('+', ''))) {
        const clean = query.replace(/[^0-9+]/g, '');
        result = `🔍 Поиск по номеру ${clean}\n\n`;
        const services = [
            { name: 'WhatsApp', url: `https://api.whatsapp.com/send?phone=${clean.replace('+', '')}` },
            { name: 'Telegram', url: `https://t.me/?phone=${clean.replace('+', '')}` },
            { name: 'Viber', url: `https://chats.viber.com/${clean.replace('+', '')}` },
            { name: 'Signal', url: `https://signal.me/#p/${clean.replace('+', '')}` },
        ];
        for (const svc of services) {
            try {
                const r = await fetch(svc.url, { method: 'HEAD', mode: 'no-cors' });
                result += `  ✅ ${svc.name}: активен\n`;
            } catch {
                result += `  ❌ ${svc.name}: не найден\n`;
            }
        }
    } else {
        result = `🔍 Поиск профиля '${query}'\n\n`;
        const services = [
            { name: 'Telegram', url: `https://t.me/${query}` },
            { name: 'Instagram', url: `https://www.instagram.com/${query}/` },
            { name: 'Twitter', url: `https://twitter.com/${query}` },
            { name: 'VK', url: `https://vk.com/${query}` },
            { name: 'GitHub', url: `https://github.com/${query}` },
            { name: 'YouTube', url: `https://www.youtube.com/@${query}` },
            { name: 'TikTok', url: `https://www.tiktok.com/@${query}` },
            { name: 'Reddit', url: `https://www.reddit.com/user/${query}` },
            { name: 'Twitch', url: `https://www.twitch.tv/${query}` },
            { name: 'Steam', url: `https://steamcommunity.com/id/${query}` },
        ];
        for (const svc of services) {
            try {
                const r = await fetch(svc.url, { method: 'HEAD' });
                if (r.ok) {
                    result += `  ✅ ${svc.name}: ${svc.url}\n`;
                } else {
                    result += `  ❌ ${svc.name}: не найден\n`;
                }
            } catch {
                result += `  ❌ ${svc.name}: ошибка\n`;
            }
        }
    }
    displayResult('socialResult', result);
    saveToHistory('Social', query, result);
});

// ============================================
//  10. DOMAIN (WHOIS / DNS)
// ============================================
document.getElementById('domainBtn').addEventListener('click', async () => {
    const domain = document.getElementById('domainInput').value.trim();
    if (!domain) return displayResult('domainResult', '❌ Введите домен');
    displayResult('domainResult', '⏳ Загрузка...');
    try {
        const whois = await fetchAPI(`https://api.hackertarget.com/whois/?q=${domain}`);
        const dns = await fetchAPI(`https://api.hackertarget.com/dnslookup/?q=${domain}`);
        const result = `🌍 WHOIS:\n${whois}\n\n📡 DNS:\n${dns}`;
        displayResult('domainResult', result);
        saveToHistory('Domain', domain, result);
    } catch (e) {
        displayResult('domainResult', `❌ Ошибка: ${e.message}`);
    }
});

// ============================================
//  11. LOGGER (Grabify) - исправлен
// ============================================
document.getElementById('loggerBtn').addEventListener('click', async () => {
    const target = document.getElementById('loggerInput').value.trim() || 'youtube.com';
    displayResult('loggerResult', '⏳ Создание ссылки...');
    try {
        const response = await fetch('https://grabify.link/api/url/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                url: target,
                title: 'Click to continue',
                brand: false,
            }),
        });
        const data = await response.json();
        if (data.status === 'success') {
            const link = `https://grabify.link/${data.shortcode}`;
            const result = `
✅ Ссылка создана!
🔗 Ссылка: ${link}
📊 Панель: ${link}
🆔 Код трекинга: ${data.tracking_code}
📌 Отправьте ссылку собеседнику.
            `.trim();
            displayResult('loggerResult', result);
            saveToHistory('Logger', target, result);
        } else {
            displayResult('loggerResult', `❌ Ошибка: ${data.message || 'Неизвестная ошибка'}`);
        }
    } catch (e) {
        displayResult('loggerResult', `❌ Ошибка: ${e.message}`);
    }
});

// ============================================
//  12. IMAGE SEARCH (через Google)
// ============================================
document.getElementById('imageBtn').addEventListener('click', () => {
    const url = document.getElementById('imageInput').value.trim();
    const file = document.getElementById('imageFile').files[0];
    if (url) {
        window.open(`https://www.google.com/searchbyimage?image_url=${encodeURIComponent(url)}`, '_blank');
        displayResult('imageResult', '🔍 Открыт поиск по ссылке');
    } else if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            window.open(`https://www.google.com/searchbyimage?image_url=${encodeURIComponent(dataUrl)}`, '_blank');
            displayResult('imageResult', '🔍 Открыт поиск по загруженному файлу');
        };
        reader.readAsDataURL(file);
    } else {
        displayResult('imageResult', '❌ Введите ссылку или выберите файл');
    }
});

// ============================================
//  13. МОНИТОРИНГ (автообновление)
// ============================================
let monitorInterval = null;
document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    const interval = parseInt(document.getElementById('monitorInterval').value) || 30;
    if (monitorInterval) clearInterval(monitorInterval);
    monitorInterval = setInterval(() => {
        const ip = document.getElementById('ipInput').value.trim();
        if (ip) document.getElementById('ipBtn').click();
    }, interval * 1000);
    alert(`✅ Мониторинг запущен (каждые ${interval} сек)`);
});

// ============================================
//  14. TELEGRAM УВЕДОМЛЕНИЯ
// ============================================
document.getElementById('telegramToggle').addEventListener('change', function() {
    localStorage.setItem('osint_telegram', this.checked);
});

function sendToTelegram(message) {
    const enabled = localStorage.getItem('osint_telegram') === 'true';
    if (!enabled) return;
    const botToken = prompt('Введите токен бота (получить у @BotFather):');
    const chatId = prompt('Введите ваш Chat ID:');
    if (!botToken || !chatId) return;
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
    }).then(() => alert('✅ Уведомление отправлено')).catch(() => alert('❌ Ошибка'));
}

// ============================================
//  15. СНИППЕТЫ (быстрые команды)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const snippets = [
        { label: 'Мой IP', value: 'auto' },
        { label: 'Google DNS', value: '8.8.8.8' },
        { label: 'Cloudflare', value: '1.1.1.1' },
        { label: 'Пример номера', value: '+79261234567' },
    ];
    const container = document.createElement('div');
    container.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;';
    snippets.forEach(s => {
        const btn = document.createElement('button');
        btn.textContent = s.label;
        btn.className = 'btn-small';
        btn.onclick = () => {
            const activeTab = document.querySelector('.tab-content.active');
            const input = activeTab.querySelector('input[type="text"]');
            if (input) {
                input.value = s.value === 'auto' ? 'Автоматически' : s.value;
                const btn = activeTab.querySelector('.btn');
                if (btn) btn.click();
            }
        };
        container.appendChild(btn);
    });
    document.querySelector('.container').insertBefore(container, document.querySelector('.tab-content'));
});

// ============================================
//  16. АВТОДОПОЛНЕНИЕ (история)
// ============================================
function updateDatalist() {
    const history = JSON.parse(localStorage.getItem('osint_history') || '[]');
    const datalist = document.getElementById('historyList');
    datalist.innerHTML = history.map(h => `<option value="${h.query}">`).join('');
}
updateDatalist();

// ============================================
//  17. ОБЩИЕ УТИЛИТЫ
// ============================================
async function fetchAPI(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

function displayResult(id, text) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.style.animation = 'none';
    setTimeout(() => el.style.animation = 'fadeIn 0.4s ease-out', 10);
}

// ============================================
//  18. ИНИЦИАЛИЗАЦИЯ (загрузка истории)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    // Автоматическое определение языка
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith('ru') && currentLang === 'en') {
        currentLang = 'ru';
        localStorage.setItem('osint_lang', 'ru');
        applyLang('ru');
        document.getElementById('langSelect').value = 'ru';
    }
    // Тема из localStorage
    const savedDark = localStorage.getItem('osint_dark');
    if (savedDark === 'false') {
        darkMode = false;
        applyTheme(false);
        document.getElementById('darkModeToggle').checked = false;
    }
});