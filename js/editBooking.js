// Get bookingId from the URL
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('id');

// Populate the Booking ID field if it's present in the URL
if (bookingId) {
    document.getElementById("bookingId").value = bookingId;
    fetchBookingDetails(bookingId);
}

// Fetch the booking details using the booking ID
async function fetchBookingDetails(bookingId) {
    try {
        const response = await fetch(`/booking/${bookingId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const booking = await response.json();
        displayBookingDetails(booking);
    } catch (error) {
        alert(`Error fetching booking details: ${error.message}`);
    }
}

// Display booking details in the form fields
function displayBookingDetails(booking) {
    document.getElementById("customerName").value = booking.customerName;
    document.getElementById("date").value = booking.date;
    document.getElementById("time").value = booking.time;
    document.getElementById("guests").value = booking.numberOfGuests;
    document.getElementById("specialRequests").value = booking.specialRequests;
}

// Function to handle the form submission
function editBooking(event) {
    event.preventDefault();  // Prevents page reload

    const bookingId = document.getElementById("bookingId").value;
    const customerName = document.getElementById("customerName").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const numberOfGuests = document.getElementById("guests").value;
    const specialRequests = document.getElementById("specialRequests").value;

    // Get current date
    const currentDate = new Date();
    const selectedDate = new Date(date);

    // Limit the number of guests to 15
    if (numberOfGuests > 15) {
        alert("The number of guests cannot exceed 15.");
        return;
    }

    // Ensure the selected date is not before the current date
    if (selectedDate < currentDate) {
        alert("The booking date cannot be before today.");
        return;
    }

    // Time validation to between 10am - 10pm
    const [hour, minute] = time.split(':').map(Number);
    if (hour < 10 || hour > 22 || (hour === 22 && minute > 0)) {
        alert("Please choose a time between 10:00 AM and 10:00 PM.");
        return;
    }

    const bookingData = {
        customerName,
        date,
        time,
        numberOfGuests,
        specialRequests
    };

    var request = new XMLHttpRequest();
    request.open("PUT", `/edit-booking/${bookingId}`, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                alert("Booking updated successfully!");

                // Insert the updated booking details into the table
                const tableBody = document.getElementById("bookingTableBody");
                tableBody.innerHTML = `
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
                alert("Bad Request: Please check your input data.");
            } else if (request.status === 500) {
                alert("Server Error: Please try again later.");
            } else {
                alert("An error occurred: " + request.statusText);
            }
        }
    };

    request.send(JSON.stringify(bookingData));
}

