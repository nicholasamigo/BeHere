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
});