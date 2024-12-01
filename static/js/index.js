//Yeung Chin To 22084296D, WANG Haoyu 22102084D
document.addEventListener('DOMContentLoaded', function() {
    const headerContent = document.getElementById('headerContent');
    const logintext = document.getElementById('logintext');
    function isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    if (isLoggedIn()) {
        headerContent.innerHTML = `
            <a href="dashboard.html" class="mx-3 nav-link">Dashboard</a>
            <a href="booking.html" class="mx-3 nav-link">Booking</a>
        `;
        logintext.classList.add('d-none');
    } else {
        
        headerContent.textContent = 'Login to unlock your parking experiment';
    }
});