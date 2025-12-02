const USERS = {
    client: { name: "You (Client)", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
    crafter: { name: "Alexander (Crafter)", avatar: "../profile_photo/petro.jpg" },
    client_partner: { name: "Alexander (Crafter)", role: "Order in progress", avatar: "../profile_photo/petro.jpg" },
    crafter_partner: { name: "Maria (Client)", role: "Customer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }
};

const STAGES = [
    { title: "Order Created", hint: "Greet and ask for fabric photos" },
    { title: "Material Check", hint: "Evaluate client's fabric" },
    { title: "Material Shipped", hint: "Waiting for client shipment..." },
    { title: "Material Received", hint: "Confirm receipt" },
    { title: "Design Approval", hint: "Send Final Offer" },
    { title: "Waiting for Payment", hint: "Waiting for payment..." },
    { title: "In Progress", hint: "Upload result photo" },
    { title: "Ready to Ship", hint: "Order Completed" }
];

let myRole = '';
let currentStep = 0;

// --- AUTO-LOGIN FROM AUTH SYSTEM ---
window.onload = function() {
    // Check if user is logged in
    const user = getCurrentUser();
    
    if (!user) {
        // User is not logged in, redirect to signin
        window.location.href = '../html/signin.html';
        return;
    }
    
    // Determine role based on user type
    myRole = user.type.toLowerCase() === 'tailor' ? 'crafter' : 'client';
    
    // Check if coming from orders page
    const savedStep = localStorage.getItem('revive_chat_step');
    if (savedStep !== null) {
        currentStep = parseInt(savedStep);
        localStorage.removeItem('revive_chat_step');
    }
    
    // Initialize chat with current user
    initializeChatWithUser(user);
};

function initializeChatWithUser(user) {
    // Update user data in USERS based on current user
    const userAvatar = user.image || '../profile_photo/petro.jpg';
    
    if (myRole === 'client') {
        USERS.client.name = `${user.name} (Client)`;
        USERS.client.avatar = userAvatar;
        USERS.client_partner.name = "Alexander (Crafter)";
    } else {
        USERS.crafter.name = `${user.name} (Crafter)`;
        USERS.crafter.avatar = userAvatar;
        USERS.crafter_partner.name = "Maria (Client)";
    }
    
    document.getElementById('app-container').style.display = 'flex';
    setupHeader();
    renderTimeline();
    updateCrafterToolbar();
    addSystemMsg(`Chat started with ${user.name}.`);
}

function setupHeader() {
    const headerBlock = document.getElementById('header-profile-block');
    const user = getCurrentUser();
    
    if (!user) return;
    
    let myProfileData = (myRole === 'client') ? USERS.client : USERS.crafter;
    let roleTitle = (myRole === 'client') ? 'Your Profile' : 'Workshop';
    
    headerBlock.innerHTML = `
        <div class="header-info">
            <div class="header-role">${user.name}</div>
            <div style="color: #666;">${roleTitle}</div>
        </div>
        <img src="${myProfileData.avatar}" class="header-avatar" alt="${user.name}">
    `;
    headerBlock.onclick = goToProfile;
}

function goToProfile() {
    window.location.href = 'profile.html';
}

function renderTimeline() {
    const container = document.getElementById('timeline-container');
    container.innerHTML = '';
    STAGES.forEach((stage, index) => {
        let statusClass = 'timeline-item';
        if (index < currentStep) statusClass += ' completed';
        if (index === currentStep) statusClass += ' active';
        container.innerHTML += `
            <div class="${statusClass}">
                <div class="timeline-date">${index <= currentStep ? 'Updated' : 'Pending'}</div>
                <div class="timeline-title">${stage.title}</div>
            </div>
        `;
    });
}

function updateCrafterToolbar() {
    const toolbar = document.getElementById('crafter-toolbar');
    if (myRole !== 'crafter') { 
        toolbar.style.display = 'none'; 
        return; 
    }
    
    toolbar.style.display = 'flex';
    document.getElementById('crafter-hint').innerText = STAGES[currentStep].hint || "Waiting...";
    
    const isCrafterAction = [0, 1, 3, 4, 6].includes(currentStep);
    document.getElementById('crafter-action-btn').style.display = isCrafterAction ? 'block' : 'none';
}

function sendMessage() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return;
    addMessageRow(text, true);
    input.value = '';
}

function addMessageRow(text, isMe, isSystemCard = false) {
    const list = document.getElementById('chat-history');
    if (isSystemCard) {
        const card = document.createElement('div');
        card.className = 'system-card';
        card.innerHTML = text;
        list.appendChild(card);
    } else {
        const row = document.createElement('div');
        row.className = `message-row ${isMe ? 'me' : ''}`;
        const myData = myRole === 'client' ? USERS.client : USERS.crafter;
        const partnerData = myRole === 'client' ? USERS.client_partner : USERS.crafter_partner;
        row.innerHTML = `<img src="${isMe ? myData.avatar : partnerData.avatar}" class="msg-avatar"><div class="message-bubble">${text}</div>`;
        list.appendChild(row);
    }
    list.scrollTop = list.scrollHeight;
}

function addSystemMsg(text) {
    const list = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.style.textAlign = 'center'; 
    div.style.fontSize = '12px'; 
    div.style.color = '#999'; 
    div.style.margin = '5px 0';
    div.innerHTML = text;
    list.appendChild(div);
}

// --- CRAFTER LOGIC ---
function handleCrafterAction() {
    if (currentStep === 0) {
        addMessageRow("Hello! Thanks for the order. The sketch looks interesting. Please send a photo of your fabric/clothes so I can evaluate if it works.", true);
        simulateClientResponse('photo'); 
    }
    else if (currentStep === 1) {
        addMessageRow("Great, the fabric works! The material is dense, color is nice. You can ship it now.", true);
        simulateClientResponse('shipping');
        nextStep();
    }
    else if (currentStep === 3) {
        addMessageRow("Package received! Everything is here. Starting work on the detailed design.", true);
        nextStep();
    }
    else if (currentStep === 4) {
        document.getElementById('offer-modal').style.display = 'flex';
    }
    else if (currentStep === 6) {
        addMessageRow("Work done! Here is a photo of the finished item 📸", true);
        nextStep();
    }
}

function closeModal() { 
    document.getElementById('offer-modal').style.display = 'none'; 
}

function submitCrafterOffer() {
    const price = document.getElementById('offer-price').value;
    const time = document.getElementById('offer-time').value;
    closeModal();
    const offerHTML = `<h4>📋 Final Offer</h4><p>Total Cost: <b>$${price}</b><br>Duration: ${time}</p><button class="pay-btn" disabled>Waiting for client payment</button>`;
    addMessageRow(offerHTML, true, true);
    simulateClientResponse('payment');
    nextStep();
}

// --- CLIENT SIMULATION ---
function simulateClientResponse(type) {
    setTimeout(() => {
        if (type === 'photo') {
            addMessageRow(`Here is my fabric. It's old jeans and a shirt.<br>
            
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <img src="master_photo/photo_2025-11-30_09-06-34.jpg" class="photo-msg" style="width: 140px; height: 140px; object-fit: cover;">
                <img src="master_photo/photo_2025-11-30_09-06-35.jpg" class="photo-msg" style="width: 140px; height: 140px; object-fit: cover;">
            </div>`, false);
            
            nextStep();
        } 
        else if (type === 'shipping') {
            addSystemMsg("Client shipped the package. Tracking: #204500112233");
            nextStep();
        }
        else if (type === 'payment') {
            if (myRole === 'client') {
                addMessageRow(`<h4>📋 Final Offer</h4><p>Crafter sent an offer</p><button class="pay-btn" onclick="clientPay(this)">💳 Pay Now</button>`, false, true);
            } else {
                setTimeout(() => {
                    addSystemMsg("Client successfully paid for the order.");
                    nextStep();
                }, 3000);
            }
        }
    }, 2000);
}

function clientPay(btn) {
    btn.innerText = "✅ Paid"; 
    btn.disabled = true; 
    btn.style.background = "#ccc";
    addSystemMsg("Payment successful."); 
    currentStep = 6; 
    renderTimeline(); 
    updateCrafterToolbar();
}

function nextStep() {
    currentStep++; 
    renderTimeline(); 
    updateCrafterToolbar();
}

document.getElementById('msgInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});