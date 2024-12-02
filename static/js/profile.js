//Yeung Chin To 22084296D, WANG Haoyu 22102084D
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupImageUpload();
    setupFormSubmission();
});

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        displayUserInfo(currentUser);
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            if (currentUser.role === 'admin') {
                adminLink.style.display = 'block';
            } else {
                adminLink.style.display = 'none';
            }
        }
    } else {
        redirectToLogin();
    }
}


function displayUserInfo(userData) {
    document.getElementById('name').value = userData.userid || '';
    document.getElementById('email').value = userData.email || '';
    updateProfileImage(userData.userimg);
}

function updateProfileImage(userimg) {
    const profileImgs = document.querySelectorAll('#profileimg');
    if (profileImgs.length > 0) {
        if (userimg) {
            profileImgs.forEach(img => {
                img.src = userimg.startsWith('data:image') ? userimg : `data:image/jpeg;base64,${userimg}`;
            });
        } else {
            profileImgs.forEach(img => img.src = 'assets/profile.png');
        }
    }
}

function setupImageUpload() {
    document.getElementById('profileImage').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Image = e.target.result;
                updateProfileImage(base64Image);
                updateCurrentUserImage(base64Image);
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateCurrentUserImage(newImage) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        currentUser.userimg = newImage;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('User image updated in localStorage');
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

function setupFormSubmission() {
    const form = document.querySelector('form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const updatedUser = {
                ...currentUser,
                userid: name,
                email: email
            };

            if (password) {
                updatedUser.password = password;
            }

            const response = await fetch('/auth/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status === 'success') {
                    delete updatedUser.password;
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    alert("Profile updated successfully!");
                    document.getElementById('password').value = '';
                    document.getElementById('confirmPassword').value = '';
                } else {
                    alert(`Failed to update profile: ${result.message}`);
                }
            } else {
                alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert("An error occurred while updating the profile.");
        }
    });
}
