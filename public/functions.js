const apiUrl = 'http://localhost:3000/api/timeslots/available';  // Adjust the URL if needed

// DOM elements
const timeslotList = document.getElementById('timeslotList');
const dateFilter = document.getElementById('dateFilter');
const timeFilter = document.getElementById('timeFilter');
const filterButton = document.getElementById('filterButton');

// Fetch available timeslots from the backend
async function fetchTimeslots() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success) {
            renderTimeslots(data.availableTimeslots);
        } else {
            timeslotList.innerHTML = 'No available timeslots found.';
        }
    } catch (error) {
        console.error('Error fetching timeslots:', error);
        timeslotList.innerHTML = 'Failed to load timeslots. Please try again later.';
    }
}

// Render the available timeslots to the UI
function renderTimeslots(timeslots) {
    timeslotList.innerHTML = '';  // Clear previous results

    if (timeslots.length === 0) {
        timeslotList.innerHTML = '<p>No available timeslots found.</p>';
        return;
    }

    timeslots.forEach(timeslot => {
        const timeslotDiv = document.createElement('div');
        timeslotDiv.classList.add('timeslot');
        timeslotDiv.innerHTML = `
            <p><strong>Date:</strong> ${timeslot.date}</p>
            <p><strong>Time:</strong> ${timeslot.time}</p>
        `;
        timeslotList.appendChild(timeslotDiv);
    });
}

// Apply filters to the timeslots based on user input
function applyFilters() {
    const selectedDate = dateFilter.value;
    const selectedTime = timeFilter.value;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let filteredTimeslots = data.availableTimeslots;

                if (selectedDate) {
                    filteredTimeslots = filteredTimeslots.filter(timeslot => timeslot.date === selectedDate);
                }

                if (selectedTime) {
                    filteredTimeslots = filteredTimeslots.filter(timeslot => timeslot.time === selectedTime);
                }

                renderTimeslots(filteredTimeslots);
            }
        })
        .catch(error => console.error('Error applying filters:', error));
}

// Event listener for the filter button
filterButton.addEventListener('click', applyFilters);

// Load all timeslots initially
fetchTimeslots();