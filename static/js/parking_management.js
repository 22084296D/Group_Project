document.addEventListener("DOMContentLoaded", () => {
    const checkAvailabilityBtn = document.getElementById('checkAvailability');
    checkAvailabilityBtn.addEventListener('click', checkAvailability);

    document.querySelectorAll('.available').forEach(space => {
        space.addEventListener('click', () => {
            const spaceId = space.id;
            bookSpace(spaceId);
        });
    });
});

function checkAvailability() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    if (new Date(startTime) >= new Date(endTime)) {
        alert('End time must be after start time.');
        window.location.href = 'parking_management.html';
        return;
    }
    if (!startTime || !endTime) {
        alert('Please select both start and end times.');
        return;
    }

    // Convert times to ISO format
    const startISO = new Date(startTime).toISOString();
    const endISO = new Date(endTime).toISOString();

    console.log('Sending request with times:', { startISO, endISO });

    fetch(`/parking-management/check-availability?startTime=${encodeURIComponent(startISO)}&endTime=${encodeURIComponent(endISO)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(bookedSpaces => {
            console.log('Received booked spaces:', bookedSpaces);

            // Reset all spaces to available
            for (let row = 'A'.charCodeAt(0); row <= 'F'.charCodeAt(0); row++) {
                for (let col = 0; col <= 9; col++) {
                    const spaceId = `${String.fromCharCode(row)}${col}`;
                    const space = document.getElementById(spaceId);
                    if (space) {
                        space.classList.remove('booked');
                        space.classList.add('available');
                    }
                }
            }

            // Set conflicting spaces to booked
            bookedSpaces.forEach(spaceId => {
                const space = document.getElementById(spaceId);
                if (space) {
                    space.classList.remove('available');
                    space.classList.add('booked');
                }
            });
        })
        .catch(error => {
            console.error('Error checking availability:', error);
            alert('Error checking availability. Please try again.');
        });
}



function bookSpace(spaceId) {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    if (!startTime || !endTime) {
        alert('Please select both start and end times before booking.');
        return;
    }

    const bookingDetails = {
        spaceId: spaceId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        userId: 'admin',
        status: 'booked'
    };

    fetch('/parking-management/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const space = document.getElementById(spaceId);
            space.classList.remove('available');
            space.classList.add('booked');
            document.getElementById('bookingStatus').innerHTML = `<div class="alert alert-success">Space ${spaceId} has been booked successfully.</div>`;
        } else {
            document.getElementById('bookingStatus').innerHTML = `<div class="alert alert-danger">Failed to book space ${spaceId}. ${data.error}</div>`;
        }
    })
    .catch(error => {
        console.error('Error booking space:', error);
        document.getElementById('bookingStatus').innerHTML = `<div class="alert alert-danger">An error occurred while booking the space.</div>`;
    });
}
