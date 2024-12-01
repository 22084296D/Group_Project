//Yeung Chin To 22084296D, WANG Haoyu 22102084D
const availableSpaces = document.querySelectorAll('.available');
const totalPriceElement = document.getElementById('totalPrice');
let selectedSpace = null;
let currentUser = null;
let pricePerHour = 15;
let pricePerDay = 150;
let durationHours = 0;
let totalPrice = 0;
let role = 'normal';

document.addEventListener('DOMContentLoaded', () => {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
        currentUser = JSON.parse(userJson);
        updatePricing();
    } else {
        alert('Please login');
        window.location.href = 'login.html';
    }
});

function updatePricing() {
    if (currentUser.role === 'VIPuser') {
        pricePerHour = 10;
        pricePerDay = 100;
        role = 'VIP';
    } else if (currentUser.role === 'user') {
        pricePerHour = 15;
        pricePerDay = 150;
    } else {
        console.warn('Unknown user role, using default pricing');
    }
    const pricelist = document.getElementById('price_list');
    pricelist.textContent = `(${role}): $${pricePerHour} per hour, $${pricePerDay} per day (More than 10 hours)`;
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

function checkTimeSelection() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const timePrompt = document.getElementById('timePrompt');
    const svgContainer = document.getElementById('svgContainer');

    if (startTime && endTime) {
        timePrompt.style.display = 'none';
        svgContainer.style.display = 'block';
        updateTotalPrice();
    } else {
        timePrompt.style.display = 'block';
        svgContainer.style.display = 'none';
    }
}

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

    const days = Math.floor(durationHours / 24);
    const hours = durationHours % 24;
    totalPrice = days * pricePerDay;
    if (durationHours > 10) {
        totalPrice += pricePerDay;
    } else {
        // 不足一小时向上取整
        const roundedHours = Math.ceil(durationHours);
        totalPrice = Math.min(roundedHours * pricePerHour, pricePerDay);
    }

    // 更新总价显示
    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.textContent = `${totalPrice.toFixed(2)}`;
}

document.getElementById('startTime').addEventListener('change', checkTimeSelection);
document.getElementById('endTime').addEventListener('change', checkTimeSelection);

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
        endTime: document.getElementById('endTime').value,
        user: currentUser.userid
    };

    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));

    window.location.href = 'payment.html';
});
