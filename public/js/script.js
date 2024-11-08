function createBooking(){


    const bookingData = new Object()
    bookingData.customerName = document.getElementById("customerName").value
    bookingData.date = document.getElementById("date").value
    bookingData.time = document.getElementById("time").value
    bookingData.numberOfGuests = document.getElementById("guests").value
    bookingData.specialRequests = document.getElementById("specialRequests").value
    

    var request = new XMLHttpRequest()
    request.open("POST","/create-booking",true)
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function() {
        if (request.readyState === 4) {  
            if (request.status === 200) {
                alert("Successfully Booked!");
            } else {
                if (request.status === 400) {
                    alert("Bad Request: Please check your input data.");
                } else if (request.status === 500) {
                    alert("Server Error: Please try again later.");
                } else {
                    alert("An error occurred: " + request.statusText);
                }
            }
        }
    };
    
    request.send(JSON.stringify(bookingData));


}

//for main1 and main2

function togglePage() {
window.location.href = window.location.href.includes('main1') ? 'main2.html' : 'main1.html';
}

//for booking 

async function fetchBookings() {
    try {
        const response = await fetch('http://localhost:3000/bookings');
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
        <table>
            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Special Requests</th>
                    <th>Edit</th>
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
                <td>${booking.specialRequests}</td>
                <td>
                    <a href="edit-booking/${booking._id}" class="edit-button">Edit</a>
                </td>
            </tr>
        `;
    });

    table += '</tbody></table>';
    document.getElementById('bookings-container').innerHTML = table;
}

fetchBookings();