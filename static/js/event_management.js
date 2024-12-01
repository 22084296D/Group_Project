document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('search').addEventListener('input', filterEvents);
    document.querySelector('#createEventModal form').addEventListener('submit', createEvent);
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
            <button class="btn btn-danger btn-sm float-end delete-event" data-id="${event.id}">Delete</button>
        `;
        eventList.appendChild(eventElement);
    });
    document.querySelectorAll('.delete-event').forEach(button => {
        button.addEventListener('click', deleteEvent);
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

async function createEvent(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/event/create', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            alert('Event created successfully');
            loadEvents();
            // 使用条件检查来关闭模态框
            const modal = document.getElementById('createEventModal');
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                    bootstrapModal.hide();
                }
            } else {
                // 如果 bootstrap 不可用，尝试使用原生方法隐藏模态框
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
            }
        } else {
            alert('Failed to create event');
        }
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Error creating event');
    }
}


async function deleteEvent(e) {
    const eventId = e.target.dataset.id;
    if (confirm('Are you sure you want to delete this event?')) {
        try {
            const response = await fetch(`/event/delete/${eventId}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                alert('Event deleted successfully');
                loadEvents();
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event');
        }
    }
}
