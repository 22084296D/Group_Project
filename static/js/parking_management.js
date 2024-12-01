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

    if (!startTime || !endTime) {
        alert('Please select both start and end times.');
        return;
    }

    // 将时间转换为 ISO 格式
    const startISO = new Date(startTime).toISOString();
    const endISO = new Date(endTime).toISOString();

    fetch(`/parking-management/check-availability?startTime=${encodeURIComponent(startISO)}&endTime=${encodeURIComponent(endISO)}`)
        .then(response => response.json())
        .then(bookedSpaces => {
            document.querySelectorAll('.available, .booked').forEach(space => {
                space.classList.remove('booked');
                space.classList.add('available');
            });

            bookedSpaces.forEach(spaceId => {
                const space = document.getElementById(spaceId);
                if (space) {
                    space.classList.remove('available');
                    space.classList.add('booked');
                }
            });
        })
        .catch(error => console.error('Error checking availability:', error));
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
        userId: 'admin', // 使用固定的 admin 用户 ID
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
