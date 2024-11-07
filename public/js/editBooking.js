function editBooking(event) {
    event.preventDefault();  // Prevents page reload

    const bookingId = document.getElementById("bookingId").value; // Retrieve booking ID
    const bookingData = {
        customerName: document.getElementById("customerName").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        numberOfGuests: document.getElementById("guests").value,
        specialRequests: document.getElementById("specialRequests").value
    };

    var request = new XMLHttpRequest();
    request.open("PUT", `/edit-booking/${bookingId}`, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200) {
                alert("Booking updated successfully!");
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
