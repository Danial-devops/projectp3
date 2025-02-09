const logger = require('./logger'); 

const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('id');

if (bookingId) {
    document.getElementById("bookingId").value = bookingId;
    logger.info(`Booking ID found in URL: ${bookingId}`);
    fetchBookingDetails(bookingId);
}

async function fetchBookingDetails(bookingId) {
    try {
        logger.info(`Fetching booking details for ID: ${bookingId}`);
        const response = await fetch(`/booking/${bookingId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const booking = await response.json();
        logger.info(`Booking details fetched successfully for ID: ${bookingId}`);
        displayBookingDetails(booking);
    } catch (error) {
        logger.error(`Error fetching booking details: ${error.message}`);
        alert(`Error fetching booking details: ${error.message}`);
    }
}

function displayBookingDetails(booking) {
    logger.info(`Displaying booking details for ${booking.customerName}`);
    document.getElementById("customerName").value = booking.customerName;
    document.getElementById("date").value = booking.date;
    document.getElementById("time").value = booking.time;
    document.getElementById("guests").value = booking.numberOfGuests;
    document.getElementById("specialRequests").value = booking.specialRequests;
}

function editBooking(event) {
    event.preventDefault();
    
    const bookingId = document.getElementById("bookingId").value;
    const customerName = document.getElementById("customerName").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const numberOfGuests = document.getElementById("guests").value;
    const specialRequests = document.getElementById("specialRequests").value;

    const currentDate = new Date();
    const selectedDate = new Date(date);

    if (numberOfGuests > 15) {
        logger.warn(`Guest limit exceeded: ${numberOfGuests} (Max: 15)`);
        alert("The number of guests cannot exceed 15.");
        return;
    }

    if (selectedDate < currentDate) {
        logger.warn(`Invalid booking date: ${date} (Past date not allowed)`);
        alert("The booking date cannot be before today.");
        return;
    }

    const [hour, minute] = time.split(':').map(Number);
    if (hour < 10 || hour > 22 || (hour === 22 && minute > 0)) {
        logger.warn(`Invalid booking time: ${time} (Allowed: 10:00 AM - 10:00 PM)`);
        alert("Please choose a time between 10:00 AM and 10:00 PM.");
        return;
    }

    const bookingData = { customerName, date, time, numberOfGuests, specialRequests };

    logger.info(`Updating booking ID: ${bookingId}`);
    
    var request = new XMLHttpRequest();
    request.open("PUT", `/edit-booking/${bookingId}`, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                logger.info(`Booking updated successfully for ID: ${bookingId}`);
                alert("Booking updated successfully!");

                document.getElementById("bookingTableBody").innerHTML = `
                    <tr>
                        <td>${response.updatedBooking._id}</td>
                        <td>${response.updatedBooking.customerName}</td>
                        <td>${response.updatedBooking.date}</td>
                        <td>${response.updatedBooking.time}</td>
                        <td>${response.updatedBooking.numberOfGuests}</td>
                        <td>${response.updatedBooking.specialRequests}</td>
                    </tr>
                `;
            } else if (request.status === 400) {
                logger.warn(`Bad request while updating booking ID: ${bookingId}`);
                alert("Bad Request: Please check your input data.");
            } else if (request.status === 500) {
                logger.error(`Server error while updating booking ID: ${bookingId}`);
                alert("Server Error: Please try again later.");
            } else {
                logger.error(`Unexpected error: ${request.statusText}`);
                alert("An error occurred: " + request.statusText);
            }
        }
    };

    request.send(JSON.stringify(bookingData));
}
