describe('Booking Management Frontend', () => {
  let bookingId;

  before(() => {
    cy.task('startServer');

    const booking = {
      customerName: 'Roob',
      date: '2024-12-01',
      time: '19:00',
      numberOfGuests: 4,
      specialRequests: 'Window seat, if possible',
    };

    cy.request('POST', 'http://localhost:3000/create-booking', booking).then((response) => {
      bookingId = response.body.bookingId;
    });
  });

  after(() => {
    cy.task('stopServer');
  });

  describe('Edit Booking', () => {

    beforeEach(() => {
      cy.visit(`http://localhost:3000/edit-booking.html?id=${bookingId}`);
    });

    it('should update an existing booking', () => {
      // Fill out the edit form
      cy.get('#customerName').clear().type('Jane Doe');
      cy.get('#date').clear().type('2026-12-02');
      cy.get('#time').clear().type('20:00');
      cy.get('#guests').clear().type('2');
      cy.get('#specialRequests').clear().type('Near the entrance');
      cy.get('button[type="submit"]').contains('Update Booking').click();

      // Verify updated booking details
      cy.get('#bookingTable').within(() => {
        cy.contains(bookingId);
        cy.contains('Jane Doe');
        cy.contains('2026-12-02');
        cy.contains('20:00');
        cy.contains('2');
        cy.contains('Near the entrance');
      });
    });

  });

  describe('Booking rules', () => {

    beforeEach(() => {
      cy.visit(`http://localhost:3000/edit-booking.html?id=${bookingId}`);
    });

    it('should enforce validation rules on date format', () => {

      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      cy.get('#date').type('2021-01-21');
      cy.get('button[type="submit"]').contains('Update Booking').click();

      // Verify the alert message
      cy.get('@alertStub').should('have.been.calledOnceWith', 'The booking date cannot be before today.');
    });

    it('should display validation error for invalid time', () => {
      // Stub the alert method to verify the message
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      // Fill the form with invalid time (before 10:00 AM)
      cy.get('#bookingId').type(bookingId);
      cy.get('#customerName').type('John Doe');
      cy.get('#date').type('2025-12-02');
      cy.get('#time').clear().type('09:30'); // Invalid time
      cy.get('#guests').clear().type('4');
      cy.get('button[type="submit"]').contains('Update Booking').click();

      // Verify alert for invalid time
      cy.get('@alertStub').should(
        'have.been.calledOnceWith',
        'Please choose a time between 10:00 AM and 10:00 PM.'
      );

      // Fill the form with another invalid time (after 10:00 PM)
      cy.get('#time').clear().type('22:30'); // Invalid time
      cy.get('button[type="submit"]').contains('Update Booking').click();

      // Verify alert for invalid time
      cy.get('@alertStub').should(
        'have.been.calledTwice'
      );
    });

    it('should enforce validation rules on number of guests', () => {

      // Stub the alert method
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      cy.get('#guests').type('20');
      cy.get('#date').clear().type('2025-12-02');
      cy.get('button[type="submit"]').contains('Update Booking').click();

      // Verify the alert message
      cy.get('@alertStub').should('have.been.calledOnceWith', 'The number of guests cannot exceed 15.');
    });
  });

  describe('Form Validation', () => {

    beforeEach(() => {
      cy.visit(`http://localhost:3000/edit-booking.html?id=${bookingId}`);
    });

    it('should display validation error for missing booking ID', () => {
      cy.get('#bookingId') // Clear the field to trigger the required errors
        .clear()
        .invoke('prop', 'validationMessage')
        .should('eq', 'Please fill out this field.');
      cy.get('#customerName').clear().type('John Doe'); 
      cy.get('#date').clear().type('2025-12-02'); 
      cy.get('#time').clear().type('19:00'); 
      cy.get('#guests').clear().type('4');
      cy.get('button[type="submit"]').contains('Update Booking').click();

      // Verify that form submission was blocked (URL should not change)s
      cy.url().should('include', 'edit-booking.html');
    });

    it('should display validation error for missing customer name', () => {
      cy.get('#bookingId').clear().type(bookingId);
      cy.get('#customerName')
        .clear()
        .invoke('prop', 'validationMessage')
        .should('eq', 'Please fill out this field.');
      cy.get('#date').clear().type('2025-12-02');
      cy.get('#time').clear().type('19:00');
      cy.get('#guests').clear().type('4');

      cy.get('button[type="submit"]').contains('Update Booking').click();
      cy.url().should('include', 'edit-booking.html');
    });

    it('should display validation error for missing date', () => {
      cy.get('#bookingId').clear().type(bookingId);
      cy.get('#customerName').clear().type('John Doe');
      cy.get('#date')
        .clear()
        .invoke('prop', 'validationMessage')
        .should('eq', 'Please fill out this field.');
      cy.get('#time').clear().type('19:00');
      cy.get('#guests').clear().type('4');

      cy.get('button[type="submit"]').contains('Update Booking').click();
      cy.url().should('include', 'edit-booking.html');
    });

    it('should display validation error for missing time', () => {
      cy.get('#bookingId').clear().type(bookingId);
      cy.get('#customerName').clear().type('John Doe');
      cy.get('#date').clear().type('2025-12-02');
      cy.get('#time')
        .clear()
        .invoke('prop', 'validationMessage')
        .should('eq', 'Please fill out this field.');
      cy.get('#guests').clear().type('4');

      cy.get('button[type="submit"]').contains('Update Booking').click();
      cy.url().should('include', 'edit-booking.html');
    });

    it('should display validation error for missing number of guests', () => {
      cy.get('#bookingId').clear().type(bookingId);
      cy.get('#customerName').clear().type('John Doe'); 
      cy.get('#date').clear().type('2025-12-02'); 
      cy.get('#time').clear().type('19:00');
      cy.get('#guests') 
        .clear()
        .invoke('prop', 'validationMessage')
        .should('eq', 'Please fill out this field.'); 

      cy.get('button[type="submit"]').contains('Update Booking').click();
      cy.url().should('include', 'edit-booking.html');
    });
  });

});

