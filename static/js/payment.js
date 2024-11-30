document.addEventListener('DOMContentLoaded', () => {
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
    if (bookingDetails) {
        document.querySelector('.card-body').innerHTML = `
            <p><strong>Parking Space:</strong> ${bookingDetails.spaceId}</p>
            <p><strong>Start Time:</strong> ${bookingDetails.startTime}</p>
            <p><strong>End Time:</strong> ${bookingDetails.endTime}</p>
            <p><strong>Total Cost:</strong> $${bookingDetails.totalCost}</p>
        `;
    }

    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const cardNumber = document.getElementById('cardNumber').value.trim();
        const cardName = document.getElementById('cardName').value.trim();
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!cardNumber || !cardName || !expiryDate || !cvv) {
            alert("Please fill out all payment fields.");
            return;
        }

        const paymentSuccessful = await processPayment(cardNumber, cardName, expiryDate, cvv);

        const paymentStatus = document.getElementById('paymentStatus');
        const electronicTicket = document.getElementById('electronicTicket');

        if (paymentSuccessful) {
            paymentStatus.innerHTML = '<div class="alert alert-success">Payment successful! Your order has been confirmed.</div>';
            electronicTicket.style.display = 'block';
        } else {
            paymentStatus.innerHTML = '<div class="alert alert-danger">Payment failed. Please try again.</div>';
        }
    });

    async function processPayment(cardNumber, cardName, expiryDate, cvv) {
        return true;
    }
});