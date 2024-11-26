function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('localTime').textContent = `HKT ${hours}:${minutes}`;
}

setInterval(updateTime, 30000); // Update every 30 seconds
updateTime(); // Initial call
