document.addEventListener('DOMContentLoaded', function() {
    console.log('Signin page loaded');
    
    // Check if required functions exist
    if (typeof getCurrentUser !== 'function') {
        console.error('getCurrentUser function not found!');
        return;
    }
    
    if (typeof login !== 'function') {
        console.error('login function not found!');
        return;
    }
    
    const signinForm = document.getElementById('signinForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (!signinForm) {
        console.error('Signin form not found!');
        return;
    }
    
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        console.log('User already logged in, redirecting to home...');
        window.location.href = '../html/home.html';
        return;
    }
    
    // Check for remembered username
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        document.getElementById('remember').checked = true;
    }
    
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value;
        const password = passwordInput.value;
        const usernameError = document.getElementById('usernameError');
        const passwordError = document.getElementById('passwordError');
        const loginError = document.getElementById('loginError');
        
        // Reset error messages
        if (usernameError) usernameError.style.display = 'none';
        if (passwordError) passwordError.style.display = 'none';
        if (loginError) loginError.style.display = 'none';
        
        let isValid = true;
        
        // Username validation
        if (!username.trim()) {
            if (usernameError) usernameError.style.display = 'block';
            isValid = false;
        }
        
        // Password validation
        if (password.length < 6) {
            if (passwordError) passwordError.style.display = 'block';
            isValid = false;
        }
        
        if (isValid) {
            console.log('Attempting login with:', username);
            
            // Show loading state
            const signinBtn = document.querySelector('.signin-btn');
            if (signinBtn) {
                const originalText = signinBtn.textContent;
                signinBtn.textContent = 'Signing In...';
                signinBtn.disabled = true;
            }
            
            // Simulate API call delay
            setTimeout(() => {
                // Attempt login
                if (login(username, password)) {
                    console.log('Login successful! Redirecting...');
                    // Success - redirect to home
                    window.location.href = '../html/home.html';
                } else {
                    console.log('Login failed');
                    // Show login error
                    if (loginError) loginError.style.display = 'block';
                    passwordInput.value = '';
                    passwordInput.focus();
                    
                    // Reset button state
                    if (signinBtn) {
                        signinBtn.textContent = originalText;
                        signinBtn.disabled = false;
                    }
                }
            }, 1000);
        }
    });
    
    // Real-time validation
    usernameInput.addEventListener('input', function() {
        if (this.value.trim() && usernameError) {
            usernameError.style.display = 'none';
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (this.value.length >= 6 && passwordError) {
            passwordError.style.display = 'none';
        }
    });
});