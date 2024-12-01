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
    updateProfileImage(userData.userid);
}

function updateProfileImage(userid) {
    const profileImgs = document.querySelectorAll('#profileimg');
    if (profileImgs.length > 0) {
        // 设置默认头像
        let imagePath = 'assets/profile.png';
        
        // 如果用户ID存在，尝试加载对应的头像
        if (userid) {
            imagePath = `assets/${userid}.jpg`;
        }
        
        // 检查图片是否存在，如果不存在则使用默认头像
        fetch(imagePath)
            .then(response => {
                if (response.ok) {
                    profileImgs.forEach(img => img.src = imagePath);
                } else {
                    console.log('User specific image not found, using default.');
                    profileImgs.forEach(img => img.src = 'assets/profile.png');
                }
            })
            .catch(error => {
                console.error('Error loading profile image:', error);
                profileImgs.forEach(img => img.src = 'assets/profile.png');
            });
    }
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