//Yeung Chin To 22084296D,WANG Haoyu 22102084D
document.addEventListener("DOMContentLoaded", () => {
    const parkingSpaces = initializeParkingSpaces();

    document.querySelectorAll('.available').forEach(space => {
        space.addEventListener('click', () => {
            const spaceId = space.id;
            toggleSpaceAvailability(spaceId);
        });
    });

    const priceEditLink = document.querySelector('.edit-link');
    priceEditLink.addEventListener('click', (event) => {
        event.preventDefault();
    });
});

function initializeParkingSpaces() {
    const spaces = {};
    document.querySelectorAll('.available, .space').forEach(space => {
        spaces[space.id] = {
            id: space.id,
            available: true
        };
    });
    return spaces;
}

function toggleSpaceAvailability(spaceId) {
    const space = document.getElementById(spaceId);
    if (space.classList.contains('available')) {
        space.classList.remove('available');
        space.classList.add('occupied');
        alert(`Space ${spaceId} is now occupied.`);
    } else {
        space.classList.remove('occupied');
        space.classList.add('available');
        alert(`Space ${spaceId} is now available.`);
    }
}