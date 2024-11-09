const Timeslot = require('./timeslot');  
const Booking = require('../models/Booking'); 


const defaultTimes = ['10:00','11:00','12:00','13:00', '14:00','15:00','16:00','17:00','18:00', '19:00', '20:00', '21:00', '22:00'];


async function populateTimeslotsForMonths(startYear, startMonth, endYear, endMonth) {
    try {
        
        for (let year = startYear; year <= endYear; year++) {
            
            let start = (year === startYear) ? startMonth : 1;  
            let end = (year === endYear) ? endMonth : 12;  

            
            for (let month = start; month <= end; month++) {
                
                const startDate = new Date(year, month - 1, 1); 
                const endDate = new Date(year, month, 0); 

                
                const allDates = [];
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    allDates.push(new Date(d)); 
                }

                for (let i = 0; i < allDates.length; i++) {
                    const date = allDates[i];
                    
                    
                    const existingTimeslots = await Timeslot.find({ date });

                    if (existingTimeslots.length === 0) {
                        
                        const newTimeslots = defaultTimes.map(time => ({
                            date,
                            time,
                            available: true
                        }));

                        await Timeslot.insertMany(newTimeslots);
                        console.log(`Timeslots for ${date.toISOString().split('T')[0]} created successfully.`);
                    }
                }
            }
        }

        console.log('Timeslots for all specified months populated successfully!');
    } catch (error) {
        console.error('Error populating timeslots for multiple months:', error);
    }
}
async function getAllAvailableTimeslots() {
    try {
        // Retrieve all timeslots
        const allTimeslots = await Timeslot.find();

        // Retrieve all bookings (or add a date filter if needed)
        const bookings = await Booking.find();

        // Get the booked times
        const bookedTimes = bookings.map(booking => ({
            date: booking.date.toISOString().split('T')[0], // Format the date to YYYY-MM-DD
            time: booking.time
        }));

        // Filter out the booked times from the available timeslots
        const availableTimeslots = allTimeslots.filter(timeslot => {
            return !bookedTimes.some(booking => 
                booking.date === timeslot.date.toISOString().split('T')[0] && booking.time === timeslot.time);
        });

        return availableTimeslots;
    } catch (error) {
        console.error('Error retrieving available timeslots:', error);
        throw new Error('Error retrieving available timeslots');
    }
}

module.exports = { populateTimeslotsForMonths, getAllAvailableTimeslots };