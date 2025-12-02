function switchTab(tabId) {
    // Hide all
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    // Show selected
    document.getElementById(tabId).classList.add('active');
    
    // Activate button (find button with onclick containing tabId)
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const activeBtn = btns.find(b => b.getAttribute('onclick').includes(tabId));
    if(activeBtn) activeBtn.classList.add('active');
}

// Simple function to remove item from DOM (Simulation)
function removeCard(btn) {
    if(confirm("Remove this item from your favorites?")) {
        // Find parent card (differs based on section)
        let card = btn.closest('.idea-card') || btn.closest('.crafter-card') || btn.closest('.product-card');
        if(card) {
            card.style.opacity = '0';
            setTimeout(() => card.remove(), 300);
        }
    }
}