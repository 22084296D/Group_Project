const availableSpaces = document.querySelectorAll('.available');
const totalPriceElement = document.getElementById('totalPrice');
let selectedSpace = null;
const pricePerSpace = 50;

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
    if (selectedSpace) {
        totalPriceElement.textContent = (pricePerSpace).toFixed(2);
    } else {
        totalPriceElement.textContent = '0.00';
    }
}

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