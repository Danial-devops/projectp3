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

    it('should display validation error for missing booking ID', () => {
      cy.get('#bookingId') // Clear the field to trigger the required error
        .clear()
        .invoke('prop', 'validationMessage')
        .should('eq', 'Please fill out this field.'); // Adjust the text to match your browser's validation message
    
      cy.get('#date').clear().type('2025-12-02');
      cy.get('button[type="submit"]').contains('Update Booking').click();
    
      // Verify that form submission was blocked (URL should not change)
      cy.url().should('include', 'edit-booking.html');
    });
    
    it('should display validation error for missing customer name', () => {
      cy.get('#bookingId').type(bookingId); // Ensure bookingId is set
      cy.get('#customerName') // Clear the field to trigger the required error
        .clear()
        .invoke('prop', 'validationMessage')
        .should('eq', 'Please fill out this field.'); // Adjust the text to match your browser's validation message
    
      cy.get('#date').clear().type('2025-12-02');
      cy.get('button[type="submit"]').contains('Update Booking').click();
    
      // Verify that form submission was blocked (URL should not change)
      cy.url().should('include', 'edit-booking.html');
    });
    
  });

  describe('Booking Validation', () => {
    it('should enforce validation rules on number of guests', () => {
      cy.visit(`http://localhost:3000/edit-booking.html?id=${bookingId}`);

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

    it('should enforce validation rules on date format', () => {
      cy.visit(`http://localhost:3000/edit-booking.html?id=${bookingId}`);

      // Stub the alert method
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      cy.get('#date').type('2021-01-21');
      cy.get('button[type="submit"]').contains('Update Booking').click();

      // Verify the alert message
      cy.get('@alertStub').should('have.been.calledOnceWith', 'The booking date cannot be before today.');
    });
  });
});
