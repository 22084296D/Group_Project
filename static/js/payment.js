//Yeung Chin To 22084296D, WANG Haoyu 22102084D
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
            updateElectronicTicket(bookingDetails);
            electronicTicket.style.display = 'block';
        } else {
            paymentStatus.innerHTML = '<div class="alert alert-danger">Payment failed. Please try again.</div>';
        }
    });

    async function processPayment(cardNumber, cardName, expiryDate, cvv) {
        return true;
    }

    function updateElectronicTicket(details) {
        const ticketContainer = document.getElementById('electronicTicket');
        ticketContainer.innerHTML = `
            <h4>Electronic Ticket</h4>
            <p><strong>Parking Space:</strong> ${details.spaceId}</p>
            <p><strong>Date:</strong> ${new Date(details.startTime).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(details.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
               ${new Date(details.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Order Status:</strong> Confirmed</p>
        `;
    }
});