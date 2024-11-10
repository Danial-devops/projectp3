const apiUrl = '/api/timeslots/available';

// DOM elements
const timeslotList = document.getElementById('timeslotList');
const dateFilter = document.getElementById('dateFilter');
const timeFilter = document.getElementById('timeFilter');
const filterButton = document.getElementById('filterButton');

// Render the available timeslots to the UI
function renderTimeslots(timeslots) {
    timeslotList.innerHTML = '';  // Clear previous results

    if (timeslots.length === 0) {
        timeslotList.innerHTML = '<p>No available timeslots found.</p>';
        return;
    }

    // Limit the number of timeslots displayed to 20
    const limitedTimeslots = timeslots.slice(0, 20);

    limitedTimeslots.forEach(timeslot => {
        const timeslotDiv = document.createElement('div');
        timeslotDiv.classList.add('timeslot');
        timeslotDiv.innerHTML = `
            <p><strong>Date:</strong> ${new Date(timeslot.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${timeslot.time}</p>
        `;
        timeslotList.appendChild(timeslotDiv);
    });
}
// Apply filters to the timeslots based on user input
async function applyFilters() {
    const selectedDate = dateFilter.value;
    const selectedTime = timeFilter.value;

    // Only fetch data if at least one filter is applied
    if (!selectedDate && !selectedTime) {
        timeslotList.innerHTML = '<p>Please select a date, time, or both to filter.</p>';
        return;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success) {
            let filteredTimeslots = data.availableTimeslots;

            if (selectedDate) {
                const selectedDateObj = new Date(selectedDate);
                filteredTimeslots = filteredTimeslots.filter(timeslot => {
                    const timeslotDate = new Date(timeslot.date);
                    return (
                        timeslotDate.getFullYear() === selectedDateObj.getFullYear() &&
                        timeslotDate.getMonth() === selectedDateObj.getMonth() &&
                        timeslotDate.getDate() === selectedDateObj.getDate()
                    );
                });
            }

            if (selectedTime) {
                filteredTimeslots = filteredTimeslots.filter(timeslot => timeslot.time === selectedTime);
            }

            renderTimeslots(filteredTimeslots);
        }
    } catch (error) {
        console.error('Error applying filters:', error);
        timeslotList.innerHTML = 'Failed to load timeslots. Please try again later.';
    }
}

// Event listener for the filter button
filterButton.addEventListener('click', applyFilters);

// Initial empty state
timeslotList.innerHTML = '<p>Please select a date, time, or both to view available timeslots.</p>';
