document.getElementById('registerButton').addEventListener('click', async function () {
    const userid = document.getElementById('userid').value.trim();
    const password = document.getElementById('password').value.trim();
    const repeatPassword = document.getElementById('repeat-password').value.trim();
    const nickname = document.getElementById('nickname').value.trim();
    const email = document.getElementById('email').value.trim();
    const gender = document.getElementById('gender').value;
    const birthdate = document.getElementById('birthdate').value;

    if (userid === '' || password === '' || nickname === '' || email === '' || gender === '' || birthdate === '') {
        alert('All fields are required.');
        return;
    }

    if (password !== repeatPassword) {
        alert('Passwords do not match!');
        return;
    }

    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('password', password);
    formData.append('nickname', nickname);
    formData.append('email', email);
    formData.append('gender', gender);
    formData.append('birthdate', birthdate);

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            alert(`Welcome, ${nickname}!\nYou can now log in with your account!`);
            window.location.href = '/login.html';
        } else {
            alert(`Registration failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration. Please try again.');
    }
});