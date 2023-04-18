describe('template spec', () => {
  it('blocks', () => {
    cy.visit('http://localhost:4200/feed')
    cy.viewport(1600, 1200) 
    cy.get('#blockIcon').should('exist')

    cy.contains('Log In').click()
    //beherelogin@gmail.com
    //password0905
  })

  it('login', () => {
    cy.visit('http://localhost:4200/feed')
    cy.viewport(1600, 1200) 



    cy.contains('Log In').click()

    //beherelogin@gmail.com
    //password0905
  })

  it('createEvent', () => {
    cy.visit('http://localhost:4200/feed')
    cy.viewport(1600, 1200) 

    cy.get('#createEventButton').click()

    cy.get('#eName').type('Cypress Name')

    cy.get('#eDate').type('Cypress Date')

    cy.get('#eTime').type('Cypress Time')

    cy.get('#eBio').type('Cypress Bio')

    cy.get('#createGoogleMap').click(0,10)

    cy.get('#finalizeCreate').click()

    //beherelogin@gmail.com
    //password0905
  })

  it('clickMarker', () => {
    cy.visit('http://localhost:4200/feed')
    cy.viewport(1600, 1200) 

    cy.get('#gmimap5').click({ force: true })

    //beherelogin@gmail.com
    //password0905
  })

  it('clickMarker', () => {
    cy.visit('http://localhost:4200/feed')
    cy.viewport(1600, 1200) 

    cy.get('#gmimap5').click({ force: true })

    //beherelogin@gmail.com
    //password0905
  })


  
})