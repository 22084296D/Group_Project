//Yeung Chin To 22084296D, WANG Haoyu 22102084D
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/auth/me', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const data = await response.json();

        if (data.status === "success") {
            document.getElementById('name').value = data.user.nickname;
            document.getElementById('email').value = data.user.email;
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Error fetching user details: " + error.message);
        console.error('Fetch error:', error);
    }

});