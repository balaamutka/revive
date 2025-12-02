document.addEventListener('DOMContentLoaded', function() {
    // 1. Перевіряємо, чи користувач увійшов
    const currentUserJSON = localStorage.getItem('currentUser');
    
    if (!currentUserJSON) {
        // Якщо не увійшов - кидаємо на вхід
        window.location.href = '../html/signin.html';
        return;
    }

    const currentUser = JSON.parse(currentUserJSON);

    // 2. Запускаємо заповнення сторінки
    loadProfileData(currentUser);
    
    // Ініціалізація календаря (твоя стара логіка)
    initCalendar();
});

// --- ФУНКЦІЯ ШЛЯХІВ ДО ФОТО ---
function getCorrectImagePath(imagePath) {
    const fallback = '../profile_photo/mike.jpg'; 
    if (!imagePath) return fallback;
    
    // Якщо це base64 (нове завантажене фото)
    if (imagePath.startsWith('data:image')) return imagePath;

    // Чистимо шлях
    let filename = imagePath.split(/[/\\]/).pop();
    let lowerName = filename.toLowerCase();

    // Перевірка імен
    if (lowerName.includes('anna')) return '../profile_photo/anna.jpg';
    if (lowerName.includes('petro')) return '../profile_photo/petro.jpg';
    if (lowerName.includes('julie')) return '../profile_photo/julie.jpg';
    if (lowerName.includes('mike')) return '../profile_photo/mike.jpg';
    if (lowerName.includes('alex')) return '../profile_photo/alex.jpg';

    // За замовчуванням
    return `../profile_photo/${filename}`;
}

// --- ЗАВАНТАЖЕННЯ ДАНИХ НА СТОРІНКУ ---
function loadProfileData(user) {
    // 1. Заповнюємо бокову панель (Welcome Section)
    const welcomeName = document.getElementById('welcome-name');
    const welcomeTagline = document.getElementById('welcome-tagline');
    const welcomeEmail = document.getElementById('welcome-email');
    const welcomeLocation = document.getElementById('welcome-location');
    const profileImage = document.getElementById('profile-image');

    if (welcomeName) welcomeName.textContent = user.name;
    if (welcomeTagline) welcomeTagline.textContent = user.quote || "Sustainable Fashion Enthusiast";
    if (welcomeEmail) welcomeEmail.textContent = user.email;
    if (welcomeLocation) welcomeLocation.textContent = user.location || "Kyiv, Ukraine";
    
    // Фото
    if (profileImage) {
        profileImage.src = getCorrectImagePath(user.image);
        profileImage.onerror = function() { this.src = '../profile_photo/mike.jpg'; };
    }

    // 2. Заповнюємо поля форми
    const names = (user.name || "").split(' ');
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(' ') || "";

    setVal('first-name', firstName);
    setVal('last-name', lastName);
    setVal('email', user.email);
    setVal('phone', user.phone || "+380 00 000 0000");
    setVal('location', user.location || "Kyiv");
    setVal('tagline', user.quote || "");
    setVal('address', user.address || "");
    setVal('about', user.bio || "");
}

// Допоміжна функція, щоб код не падав, якщо якогось поля немає в HTML
function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

// --- ЗБЕРЕЖЕННЯ ДАНИХ (SAVE CHANGES) ---
const form = document.getElementById('profile-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Отримуємо поточного юзера
        let user = JSON.parse(localStorage.getItem('currentUser'));

        // Зчитуємо нові дані з полів
        const fName = document.getElementById('first-name').value;
        const lName = document.getElementById('last-name').value;

        user.name = `${fName} ${lName}`.trim();
        user.email = document.getElementById('email').value;
        user.phone = document.getElementById('phone').value;
        user.location = document.getElementById('location').value;
        user.quote = document.getElementById('tagline').value; // quote = tagline
        user.address = document.getElementById('address').value;
        user.bio = document.getElementById('about').value;

        // 1. Зберігаємо поточного користувача
        localStorage.setItem('currentUser', JSON.stringify(user));

        // 2. Оновлюємо його в загальній базі users (щоб не злетіло при виході)
        let allUsers = JSON.parse(localStorage.getItem('reviveUsers')) || [];
        const index = allUsers.findIndex(u => u.email === user.email);
        if (index !== -1) {
            allUsers[index] = user;
            localStorage.setItem('reviveUsers', JSON.stringify(allUsers));
        }

        // Оновлюємо вигляд сторінки
        loadProfileData(user);
        
        // Показуємо повідомлення
        showSuccessMessage('Profile updated successfully!');
        
        // Оновлюємо шапку (якщо там є скрипт auth-system)
        if (typeof checkAuth === 'function') checkAuth();
    });
}

// --- МОДАЛКА ДЛЯ ФОТО ---
const editPhotoBtn = document.getElementById('edit-photo-btn');
const photoModal = document.getElementById('photo-modal');
const cancelPhotoBtn = document.getElementById('cancel-photo');
const uploadOption = document.getElementById('upload-photo');

if (editPhotoBtn && photoModal) {
    editPhotoBtn.addEventListener('click', () => photoModal.classList.add('active'));
}
if (cancelPhotoBtn && photoModal) {
    cancelPhotoBtn.addEventListener('click', () => photoModal.classList.remove('active'));
}

// Завантаження нового фото
if (uploadOption) {
    uploadOption.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = event => {
                    // Одразу зберігаємо фото
                    let user = JSON.parse(localStorage.getItem('currentUser'));
                    user.image = event.target.result; // base64
                    
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    
                    // Оновлюємо сторінку
                    loadProfileData(user);
                    photoModal.classList.remove('active');
                    showSuccessMessage('New photo saved!');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
}

// --- ПОВІДОМЛЕННЯ ПРО УСПІХ ---
function showSuccessMessage(msg) {
    const el = document.getElementById('successMessage');
    if (el) {
        el.querySelector('span').textContent = msg;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 3000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        alert(msg);
    }
}

// --- КАЛЕНДАР (Спрощена версія для ініціалізації) ---
function initCalendar() {
    // Тут можна залишити код календаря, який був раніше, 
    // або просто ініціалізувати випадаючі списки
    const yearSelect = document.getElementById('year-select');
    if (yearSelect) {
        const currentYear = new Date().getFullYear();
        for (let i = 1900; i <= 2030; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            if (i === 1990) opt.selected = true;
            yearSelect.appendChild(opt);
        }
    }
    
    const toggle = document.getElementById('calendar-toggle');
    const calendar = document.getElementById('calendar');
    if (toggle && calendar) {
        toggle.addEventListener('click', () => {
            calendar.style.display = calendar.style.display === 'block' ? 'none' : 'block';
        });
    }
}