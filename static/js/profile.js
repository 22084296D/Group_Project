//Yeung Chin To 22084296D, WANG Haoyu 22102084D
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        displayUserInfo(currentUser);
    } else {
        redirectToLogin();
    }
}

function displayUserInfo(userData) {
    document.getElementById('name').value = userData.userid || '';
    document.getElementById('email').value = userData.email || '';
}

function redirectToLogin() {
    alert('Please log in to view your profile.');
    window.location.href = 'index.html';
}

document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        } else {
            alert("Failed to log out. Please try again.");
        }
    } catch (error) {
        alert("Error during logout: " + error.message);
        console.error('Logout error:', error);
    }
});

