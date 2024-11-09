const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('id');

async function fetchBookingDetails() {
    try {
        const response = await fetch(`http://localhost:3000/booking/${bookingId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const booking = await response.json();
        displayBookingDetails(booking);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function displayBookingDetails(booking) {
    document.getElementById('customer-name').textContent = booking.customerName;
    document.getElementById('booking-date').textContent = booking.date;
    document.getElementById('booking-time').textContent = booking.time;
    document.getElementById('guests').textContent = booking.numberOfGuests;
    document.getElementById('special-requests').textContent = booking.specialRequests;
}

fetchBookingDetails();

document.getElementById('back-button').addEventListener('click', function () {
    window.location.href = '/booking.html';
});

document.getElementById('edit-button').addEventListener('click', function () {
    window.location.href = `/edit-booking/${bookingId}`;
});