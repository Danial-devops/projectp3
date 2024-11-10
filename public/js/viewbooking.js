async function fetchBookings() {
    try {
        const response = await fetch('/bookings');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const bookings = await response.json();
        displayBookings(bookings);
    } catch (error) {
        document.getElementById('bookings-container').innerHTML = `<p>${error.message}</p>`;
    }
}

function displayBookings(bookings) {
    if (bookings.length === 0) {
        document.getElementById('bookings-container').innerHTML = '<p>No bookings found.</p>';
        return;
    }

    let table = `
        <table class="view-table">
            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
    `;

    bookings.forEach(booking => {
        table += `
            <tr>
                <td>${booking.customerName}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td>${booking.numberOfGuests}</td>
                <td>
                    <a href="booking-details.html?id=${booking._id}" class="view-details-button">Details</a>
                </td>
            </tr>
        `;
    });

    table += '</tbody></table>';
    document.getElementById('bookings-container').innerHTML = table;
}

fetchBookings();