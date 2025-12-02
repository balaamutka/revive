// Authentication system
let currentUser = null;

// Check if functions exist before calling
function safeInitialize() {
    if (typeof initializeUsers === 'function') {
        initializeUsers();
    } else {
        console.error('initializeUsers function not found!');
    }
}

// Initialize on load
safeInitialize();

function login(username, password) {
    console.log('Login function called with:', username);
    
    // Check if function exists
    if (typeof loadUsersFromLocalStorage !== 'function') {
        console.error('loadUsersFromLocalStorage function not found!');
        return false;
    }
    
    const users = loadUsersFromLocalStorage();
    console.log('Loaded users count:', users.length);
    
    const user = users.find(u => {
        console.log('Checking user:', u.login, 'against:', username);
        return u.login === username && u.password === password;
    });
    
    if (user) {
        console.log('User found:', user.name);
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Set remember me if checked
        const rememberMe = document.getElementById('remember');
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        return true;
    }
    
    console.log('No user found with these credentials');
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '../html/home.html';
}

function getCurrentUser() {
    if (!currentUser) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        }
    }
    return currentUser;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function updateNavigation() {
    const user = getCurrentUser();
    const navAuth = document.getElementById('navAuth');
    const userProfile = document.getElementById('userProfile');
    
    if (navAuth && userProfile) {
        if (user) {
            // User is logged in - show profile, hide auth buttons
            navAuth.style.display = 'none';
            userProfile.style.display = 'flex';
            
            // Update profile image and name
            const profileImg = document.getElementById('navProfileImg');
            const profileName = document.getElementById('navProfileName');
            
            if (profileImg) {
                // Fix image path - add ../ if needed
                let imagePath = user.image;
                if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('../')) {
                    imagePath = '../' + imagePath;
                }
                
                profileImg.src = imagePath || '../images/default-avatar.jpg';
                profileImg.alt = user.name;
                
                // Add error handling for images
                profileImg.onerror = function() {
                    console.warn('Failed to load profile image:', this.src);
                    this.src = '../images/default-avatar.jpg';
                    // Create fallback with initials
                    createFallbackAvatar(profileImg, user.name);
                };
                
                // Add load handler
                profileImg.onload = function() {
                    console.log('Profile image loaded successfully:', this.src);
                };
            }
            
            if (profileName) {
                profileName.textContent = user.name;
            }
        } else {
            // User is not logged in - show auth buttons, hide profile
            navAuth.style.display = 'flex';
            userProfile.style.display = 'none';
        }
    }
}

// Create fallback avatar with initials
function createFallbackAvatar(imgElement, name) {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['#6686AC', '#1A2940', '#4CAF50', '#FF9800', '#E91E63'];
    const color = colors[name.length % colors.length];
    
    // Create SVG as data URL
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="${color}" rx="50"/>
            <text x="50" y="55" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text>
        </svg>
    `;
    
    imgElement.src = 'data:image/svg+xml;base64,' + btoa(svg);
}

// Check authentication on page load
function checkAuthOnLoad() {
    updateNavigation();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuthOnLoad);
} else {
    checkAuthOnLoad();
}

// Check if user should be redirected from auth pages
function checkAuthRedirect() {
    const user = getCurrentUser();
    const currentPage = window.location.pathname;
    
    // If user is logged in and tries to access signin/signup pages, redirect to home
    if (user && (currentPage.includes('signin.html') || currentPage.includes('signup.html'))) {
        window.location.href = '../html/home.html';
    }
    
    // If user is not logged in and tries to access protected pages, redirect to signin
    if (!user && currentPage.includes('profile.html')) {
        window.location.href = '../html/signin.html';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

function checkAuth() {
    const userJSON = localStorage.getItem('currentUser');
    const navAuth = document.getElementById('navAuth'); // Кнопки входу
    const userProfileNav = document.getElementById('userProfile'); // Меню профілю

    if (userJSON) {
        // --- КОРИСТУВАЧ ЗАЛОГІНЕНИЙ ---
        const user = JSON.parse(userJSON);
        
        // 1. Перемикаємо видимість
        if (navAuth) navAuth.style.display = 'none';
        if (userProfileNav) {
            userProfileNav.style.display = 'flex';
            
            // 2. Оновлюємо ім'я в шапці
            const navName = document.getElementById('navProfileName');
            if (navName) navName.textContent = user.name;

            // 3. Оновлюємо фото в шапці
            const navImg = document.getElementById('navProfileImg');
            if (navImg) {
                navImg.src = getGlobalImagePath(user.image);
                // Якщо фото не знайдено - ставимо Майка
                navImg.onerror = function() { 
                    this.src = '../profile_photo/mike.jpg'; 
                };
            }
        }
    } else {
        // --- КОРИСТУВАЧ НЕ ЗАЛОГІНЕНИЙ ---
        if (navAuth) navAuth.style.display = 'flex';
        if (userProfileNav) userProfileNav.style.display = 'none';
    }
}

// --- УНІВЕРСАЛЬНА ФУНКЦІЯ ДЛЯ ФОТО (Та сама, що і в profile.js) ---
function getGlobalImagePath(imagePath) {
    const fallback = '../profile_photo/mike.jpg'; 

    if (!imagePath) return fallback;
    
    // Якщо це base64 або url
    if (imagePath.startsWith('data:image') || imagePath.startsWith('http')) return imagePath;

    // Якщо шлях вже правильний (починається з ../)
    if (imagePath.startsWith('../')) {
        // Виправляємо можливі помилки з назвою папки
        if (imagePath.includes('profile/')) {
            return imagePath.replace('profile/', 'profile_photo/');
        }
        return imagePath;
    }

    let filename = imagePath.split(/[/\\]/).pop();
    let lowerName = filename.toLowerCase();

    // 1. Перевірка імен для папки profile_photo
    if (lowerName.includes('anna')) return '../profile_photo/anna.jpg';
    if (lowerName.includes('petro')) return '../profile_photo/petro.jpg';
    if (lowerName.includes('julie')) return '../profile_photo/julie.jpg';
    if (lowerName.includes('mike')) return '../profile_photo/mike.jpg';
    if (lowerName.includes('alex')) return '../profile_photo/alex.jpg';

    // 2. Фото робіт -> pictures
    if (lowerName.includes('photo_')) return `../pictures/${filename}`;

    // 3. За замовчуванням -> profile_photo
    return `../profile_photo/${filename}`;
}

// Функція виходу
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../html/signin.html';
}

// Call this on auth pages
checkAuthRedirect();