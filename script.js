// ============================================
// 1. АНИМИРОВАННЫЙ ФОН
// ============================================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height, stars = [];
const STAR_COUNT = 150;

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
// 2. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
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
// 3. УТИЛИТЫ
// ============================================
function copyResult(id) {
    const el = document.getElementById(id);
    if (!el || !el.textContent) return alert('Нет данных');
    navigator.clipboard.writeText(el.textContent).then(() => alert('✅ Скопировано!'));
}

async function fetchAPI(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

function displayResult(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
}

// ============================================
// 4. IP-ЛОКАТОР (ip-api.com)
// ============================================
document.getElementById('ipBtn').addEventListener('click', async () => {
    const ip = document.getElementById('ipInput').value.trim();
    if (!ip) return displayResult('ipResult', '❌ Введите IP');
    displayResult('ipResult', '⏳ Загрузка...');
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,lat,lon,timezone,org,as,query`);
        const data = await response.json();
        if (data.status === 'success') {
            displayResult('ipResult', `
📍 IP: ${data.query}
🌍 Страна: ${data.country}
🏙️ Регион: ${data.regionName}
🗺️ Город: ${data.city}
📡 Провайдер: ${data.isp}
📌 Координаты: ${data.lat}, ${data.lon}
🗺️ Карта: https://www.google.com/maps?q=${data.lat},${data.lon}
            `.trim());
        } else {
            displayResult('ipResult', `❌ ${data.message || 'Ошибка'}`);
        }
    } catch (e) {
        displayResult('ipResult', `❌ Ошибка: ${e.message}`);
    }
});

// ============================================
// 5. PHONE-ИНФО (через apilayer)
// ============================================
document.getElementById('phoneBtn').addEventListener('click', async () => {
    const phone = document.getElementById('phoneInput').value.trim();
    if (!phone) return displayResult('phoneResult', '❌ Введите номер');
    displayResult('phoneResult', '⏳ Загрузка...');
    try {
        const data = await fetchAPI(`https://api.apilayer.com/number_verification/validate?number=${phone}`);
        displayResult('phoneResult', `
📞 Номер: ${data.international_format || phone}
🌍 Страна: ${data.country_name || 'Неизвестно'}
🏙️ Регион: ${data.location || 'Неизвестно'}
📡 Оператор: ${data.carrier || 'Неизвестно'}
📱 Тип: ${data.line_type || 'Неизвестно'}
        `.trim());
    } catch (e) {
        displayResult('phoneResult', `❌ Ошибка: ${e.message}`);
    }
});

// ============================================
// 6. СОЦ-ЧЕКЕР
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
});

// ============================================
// 7. IP-ЛОГГЕР (Grabify)
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
            displayResult('loggerResult', `
✅ Ссылка создана!
🔗 Ссылка: ${link}
📊 Панель: ${link}
🆔 Код: ${data.tracking_code}
            `.trim());
        } else {
            displayResult('loggerResult', `❌ ${data.message || 'Ошибка'}`);
        }
    } catch (e) {
        displayResult('loggerResult', `❌ ${e.message}`);
    }
});