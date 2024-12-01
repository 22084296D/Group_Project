//Yeung Chin To 22084296D, WANG Haoyu 22102084D
document.addEventListener('DOMContentLoaded', () => {
    const dateTime = new Date().toLocaleString();

    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
    if (bookingDetails) {
        document.querySelector('.card-body').innerHTML = `
            <p><strong>Parking Space:</strong> ${bookingDetails.spaceId}</p>
            <p><strong>Start Time:</strong> ${new Date(bookingDetails.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> ${new Date(bookingDetails.endTime).toLocaleString()}</p>
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
        <div style="
            border: 2px solid #007bff;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            background-color: #f8f9fa;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        ">
            <h4 style="color: #007bff; margin-bottom: 15px;">Electronic Ticket</h4>
            <p><strong>Parking Space:</strong> ${details.spaceId}</p>
            <p><strong>Start Time:</strong> ${new Date(bookingDetails.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> ${new Date(bookingDetails.endTime).toLocaleString()}</p>
            <p><strong>Order Status:</strong> Confirmed</p>
        `;
    }
});