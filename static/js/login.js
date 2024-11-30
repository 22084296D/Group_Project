//Yeung Chin To 22084296D, WANG Haoyu 22102084D
document.getElementById('loginButton').addEventListener('click', async () => {
    const userid = document.getElementById('userid').value;
    const password = document.getElementById('password').value;

    if (!userid || !password) {
        alert("User ID and password cannot be empty");
        return;
    }

    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('password', password);

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Logged as '${data.user.userid}'(${data.user.role})`);
            window.location.href = '/dashboard.html';
        } else {
            alert(data.message || "Unknown error");
        }
    } catch (error) {
        alert("Unknown error");
        console.error('Login error:', error);
    }
});