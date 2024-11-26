fetch('/auth/me').then(response => {
    if (!response.ok) {
        alert("Please login");
        window.open('/login.html', '_self');
    }
});

document.getElementById('logoutButton').addEventListener('click', function() {
    const confirmLogout = confirm("Confirm to logout?");
    if (confirmLogout) {
        fetch('/auth/logout', {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                window.open('/login.html', '_self');
            } 
        })
    }
});