describe('Google Maps Tests', () => {
  it('Has default text', () => {
    cy.visit('http://localhost:4200/');

    // make sure the right hand text has "default message"
    cy.get('#currEventTitle').should('have.text', 'Title: NA');
  });

  it('can click on a marker', () => {
    cy.visit('http://localhost:4200/');

    // wait 1.5 second for map to load
    cy.wait(1500); 

    // Click on first marker
    cy.get('map-marker').first().click();
    /*cy.get('map-marker').first().then((marker) => {
      // Get the marker object
      const markerObj = marker[0];

      // Customize the marker options
      markerObj.setOptions({
        optimized: false
      }); 
      */

    // make sure the right hand text updates
    cy.get('#currEventTitle').should('not.have.text', 'Title: NA');
  });


  // Sprint 3 Testing


  // End-to-End Testing

  // Testing whether the user can login successfully. Testing is done with the new "Create Event" template button to
  // the left of the "Login" button, and making sure it appears.
  it('Can successfully login', () => {
    cy.visit('http://localhost:4200/');

    // Wait for website to load correctly.
    cy.wait(1500);

    // Click the avatar button used for logging in.
    // cy.get('*avatar-button').first().click();
      cy.get('button').first().click();

    // Wait 2 more seconds to successfully log in.
    cy.wait(2000);

    // cy.get('#createAnEvent').should('be.visible');
    cy.get('button[id="createAnEvent"]').should('be.visible');
  });

  // Testing whether the user can logout of the page successfully. Testing is done with the disappearance of the
  // "Create Event" template button to the left of the "Login" button.
  it('Can successfully logout', () => {
    cy.visit('http://localhost:4200/');

    // Wait for website to load correctly.
    cy.wait(1500);


    // Click the avatar button used for logging in.
    cy.get('.avatar-button').first().click();

    // Wait 2 more seconds to successfully log in.
    cy.wait(2000);


    // Click the avatar button used for logging in.
    cy.get('.avatar-button').first().click();

    // Wait 2 more seconds to successfully log in.
    cy.wait(2000);


    cy.get('#createAnEvent').should('not.be.visible');

  });

  // Testing whether the user can create a new event with the temporary button. Testing is done with the inclusion of
  // a new location in the test2.db file.
  it('Can create an event successfully using the temporary "create event" button', () => {
    cy.visit('http://localhost:4200/');

    cy.wait(1500);
  });

});