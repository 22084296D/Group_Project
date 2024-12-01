//Yeung Chin To 22084296D, WANG Haoyu 22102084D
const availableSpaces = document.querySelectorAll('.available');
const totalPriceElement = document.getElementById('totalPrice');
let selectedSpace = null;
let currentUser = null;
let pricePerHour = 15;
let pricePerDay = 150;
let durationHours = 0;
let totalPrice = 0;

document.addEventListener('DOMContentLoaded', () => {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
        currentUser = JSON.parse(userJson);
        updatePricing();
    } else {
        console.error('No user logged in');
        // 可以在这里添加重定向到登录页面的逻辑
    }
});

function updatePricing() {
    if (currentUser.role === 'VIPuser') {
        pricePerHour = 10;
        pricePerDay = 100;
    } else if (currentUser.role === 'user') {
        pricePerHour = 15;
        pricePerDay = 150;
    } else {
        console.warn('Unknown user role, using default pricing');
    }
}

availableSpaces.forEach(space => {
    space.addEventListener('click', () => {
        if (selectedSpace) {
            selectedSpace.classList.remove('selected');
        }
        selectedSpace = space;
        selectedSpace.classList.add('selected');
        updateTotalPrice();
    });
});

function updateTotalPrice() {
    if (!currentUser) {
        console.error('No user logged in');
        return;
    }

    const startTime = new Date(document.getElementById('startTime').value);
    const endTime = new Date(document.getElementById('endTime').value);
    if(!isNaN(startTime) && !isNaN(endTime)){
        durationHours = (endTime - startTime) / (1000 * 60 * 60);
    }

    while(durationHours > 24){
        durationHours -= 24;
        totalPrice += pricePerDay;
    }

    if (durationHours > 10) {
        totalPrice = pricePerDay;
    } else {
        // 不足一小时向上取整
        const roundedHours = Math.ceil(durationHours);
        totalPrice = Math.min(roundedHours * pricePerHour, pricePerDay);
    }

    // 更新总价显示
    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = `${totalPrice.toFixed(2)}`;
}

document.getElementById('startTime').addEventListener('change', updateTotalPrice);
document.getElementById('endTime').addEventListener('change', updateTotalPrice);

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selectedSpace) {
        alert('Please select a parking space before proceeding to payment.');
        return;
    }

    const bookingDetails = {
        spaceId: selectedSpace.id,
        totalCost: totalPriceElement.textContent,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value
    };

    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));

    window.location.href = 'payment.html';
});