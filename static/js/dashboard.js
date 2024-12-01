//Yeung Chin To 22084296D, WANG Haoyu 22102084D
let events = [
    {
        "title": "Free Car Wash",
        "dateTime": "2026-10-10, 10:00 AM - 12:00 PM",
        "description": "Free Car Wash is provided for all teaching fellows.",
        "venue": "A zone"
    },
    {
        "title": "Free Car Parking",
        "dateTime": "2026-11-10, 10:00 AM - 11:00 PM",
        "description": "Free Car Parking is provided for all teaching fellows.",
        "venue": "All zone"
    },
    {
        "title": "Overhaul of equipment",
        "dateTime": "2026-12-10, 10:00 AM - 12:00 PM",
        "description": "C zone is temporarily closed for maintenance.",
        "venue": "C zone"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
        alert('Please login');
        window.location.href = 'login.html';
    }
});

function displayEvents(eventList) {
    const listGroup = document.querySelector('.list-group');
    listGroup.innerHTML = '';

    eventList.forEach(event => {
        const eventItem = document.createElement('a');
        eventItem.className = 'list-group-item list-group-item-action';
        eventItem.href = '#';

        eventItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${event.title}</h5>
                <small>${event.dateTime}</small>
            </div>
            <p class="mb-1">${event.description}</p>
            <small>${event.venue}</small>
        `;

        listGroup.appendChild(eventItem);
    });
}

function filterEvents() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchInput) ||
        event.description.toLowerCase().includes(searchInput) ||
        event.venue.toLowerCase().includes(searchInput)
    );
    displayEvents(filteredEvents);
}

document.getElementById('search').addEventListener('input', filterEvents);

displayEvents(events);

// fetch('events.json')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         events = data;
//         displayEvents(events);
//     })
//     .catch(error => console.error('Error fetching events:', error));