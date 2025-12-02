function openTab(tabName) {
    document.querySelectorAll('.section-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    const clickedBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabName));
    if(clickedBtn) clickedBtn.classList.add('active');
}

// ДАНІ ДЛЯ МОДАЛЬНОГО ВІКНА (View Details)
const projectData = {
    1: {
        title: 'Denim Jacket "Patch"',
        price: '$120',
        // ШЛЯХ МАЄ СПІВПАДАТИ З HTML
        img: '../master_photo/photo_2025-11-25_21-20-13.jpg',
        desc: 'This jacket was created from 3 pairs of old jeans. We used the patchwork technique.',
        customerName: 'Maria K.',
        customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
        review: 'My favorite item in the wardrobe! Looks very stylish.'
    },
    2: {
        title: 'Shirt Corset',
        price: '$85',
        // ШЛЯХ МАЄ СПІВПАДАТИ З HTML
        img: '../master_photo/photo_2025-11-29_18-03-15.jpg',
        desc: 'The client brought two men\'s plaid shirts. We remade them into a trendy boned corset.',
        customerName: 'Elena V.',
        customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
        review: 'Fits perfectly, thanks for the new life for the shirts.'
    },
    3: {
        title: 'Shopper Bag',
        price: '$45',
        // ШЛЯХ МАЄ СПІВПАДАТИ З HTML
        img: '../master_photo/photo_2025-11-29_19-15-33.jpg',
        desc: 'Durable shopper made from coat production scraps. Eco-friendly and stylish.',
        customerName: 'Irene D.',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
        review: 'Very convenient bag for every day.'
    }
};

function openProject(id) {
    const data = projectData[id];
    document.getElementById('m-img').src = data.img;
    document.getElementById('m-title').innerText = data.title;
    document.getElementById('m-price').innerText = data.price;
    document.getElementById('m-desc').innerText = data.desc;
    document.getElementById('m-c-avatar').src = data.customerAvatar;
    document.getElementById('m-c-name').innerText = data.customerName;
    document.getElementById('m-c-review').innerText = `"${data.review}"`;
    
    // Перехід на чат при кліку на кнопку
    const btn = document.querySelector('.modal-action-btn');
    if(btn) {
        btn.onclick = function() {
            window.location.href = '../html/chat.html';
        };
    }
    
    document.getElementById('projectModal').style.display = 'flex';
}

function closeProject(event, force) {
    if (force || event.target.id === 'projectModal') {
        document.getElementById('projectModal').style.display = 'none';
    }
}

function toggleSubscribe() {
    const btn = document.getElementById('subBtn');
    if (btn.classList.contains('subscribed')) {
        btn.classList.remove('subscribed');
        btn.innerText = 'Subscribe';
    } else {
        btn.classList.add('subscribed');
        btn.innerText = 'Subscribed ✓';
    }
}

function toggleLike() {
    const btn = document.getElementById('likeBtn');
    btn.classList.toggle('liked');
}










яяя