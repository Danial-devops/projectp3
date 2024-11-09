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
