
function openWithdrawModal() {
    document.getElementById('withdrawModal').style.display = 'flex';
}

function openSettingsModal() {
    document.getElementById('settingsModal').style.display = 'flex';
}

// --- Close Function ---
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Очищення помилок при закритті
    document.querySelectorAll('input').forEach(input => input.classList.remove('error-border'));
}

// --- Logic 1: Withdraw ---
function confirmWithdraw() {
    const amount = document.getElementById('withdrawAmount').value;
    if(amount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
    }
    alert(`Success! Withdrawal of $${amount} is processing. It usually takes 1-3 business days.`);
    closeModal('withdrawModal');
}

// --- Logic 2: Save Settings (VALIDATION) ---
function saveSettings() {
    const bankInput = document.getElementById('setting-bank');
    const ibanInput = document.getElementById('setting-iban');
    const nameInput = document.getElementById('setting-name');

    let isValid = true;

    // 1. Validate Bank Name (Not empty)
    if (bankInput.value.trim().length < 3) {
        bankInput.classList.add('error-border');
        isValid = false;
    } else {
        bankInput.classList.remove('error-border');
    }

    // 2. Validate IBAN/Card (Basic check: digits or UA format)
    // Regex: 16 digits OR "UA" followed by 27 digits
    const cardRegex = /^\d{16}$/;
    const ibanRegex = /^UA\d{27}$/;
    const val = ibanInput.value.replace(/\s/g, ''); // remove spaces

    if (!cardRegex.test(val) && !ibanRegex.test(val)) {
        ibanInput.classList.add('error-border');
        isValid = false;
    } else {
        ibanInput.classList.remove('error-border');
    }

    // 3. Validate Name (At least 2 words)
    if (nameInput.value.trim().split(' ').length < 2) {
        nameInput.classList.add('error-border');
        isValid = false;
    } else {
        nameInput.classList.remove('error-border');
    }

    if (isValid) {
        alert("Bank details saved successfully!");
        closeModal('settingsModal');
    } else {
        alert("Please check the highlighted fields. \n- Bank Name: min 3 chars\n- Number: 16 digits or valid IBAN (UA...)\n- Name: First and Last name");
    }
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
        document.querySelectorAll('input').forEach(input => input.classList.remove('error-border'));
    }
}
