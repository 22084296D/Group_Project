document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('search').addEventListener('input', filterEvents);
}

async function loadEvents() {
    try {
        const response = await fetch('/event/all');
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function displayEvents(events) {
    const eventList = document.querySelector('.list-group');
    eventList.innerHTML = '';
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'list-group-item';
        eventElement.innerHTML = `
            <h5>${event.id}. ${event.title}</h5>
            <p>Date: ${event.date}, Time: ${event.startTime} - ${event.endTime}</p>
            <p>Venue: ${event.venue}</p>
            <p>${event.description}</p>
        `;
        eventList.appendChild(eventElement);
    });
}

function filterEvents() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const events = document.querySelectorAll('.list-group-item');
    events.forEach(event => {
        const text = event.textContent.toLowerCase();
        event.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}
