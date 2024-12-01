//Yeung Chin To 22084296D, WANG Haoyu 22102084D
document.addEventListener('DOMContentLoaded', () => {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
        alert('Please login');
        window.location.href = 'login.html';
    }
    if(JSON.parse(userJson).role !== 'admin'){
        alert('You are not admin');
        window.location.href = 'index.html';
    }
});