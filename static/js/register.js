document.getElementById('registerButton').addEventListener('click', async () => {
    const userid = document.getElementById('userid').value.trim();
    const password = document.getElementById('password').value.trim();
    const repeatPassword = document.getElementById('repeat-password').value.trim();
    const nickname = document.getElementById('nickname').value.trim();
    const email = document.getElementById('email').value.trim();
    const gender = document.getElementById('gender').value;
    const birthdate = document.getElementById('birthdate').value;
    const profileImage = document.getElementById('profileImage').files[0];

    if (!userid || !password || !nickname || !email || !gender || !birthdate) {
        alert("All fields are required");
        return;
    }

    if (password !== repeatPassword) {
        alert("Password mismatch!");
        return;
    }

    const formData = new FormData();
    formData.append('username', userid);
    formData.append('password', password);
    formData.append('repeat_password', repeatPassword);
    formData.append('nickname', nickname);
    formData.append('email', email);
    formData.append('gender', gender);
    formData.append('birthdate', birthdate);

    if (profileImage) {
        formData.append('profileImage', profileImage);
    }

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Welcome, ${nickname}!\nYou can login with your account now!`);
            window.location.href = '/login.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error during registration. Please try again.');
    }
});