//Yeung Chin To 22084296D, WANG Haoyu 22102084D
document.addEventListener('DOMContentLoaded', function() {
  updateHeaderProfileImage();
});
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('localTime').textContent = `HKT ${hours}:${minutes}`;
}

setInterval(updateTime, 30000); // Update every 30 seconds
updateTime(); // Initial call

function updateHeaderProfileImage() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const profileImgs = document.querySelectorAll('#profileimg');

  profileImgs.forEach(img => {
      if (currentUser && currentUser.userimg) {
          // 使用用户的头像
          img.src = currentUser.userimg.startsWith('data:image') 
              ? currentUser.userimg 
              : `data:image/jpeg;base64,${currentUser.userimg}`;
      } else {
          // 使用默认头像
          img.src = 'assets/profile.png';
      }
  });
}