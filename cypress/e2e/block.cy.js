describe('template spec', () => {
  it('blocks', () => {
    cy.visit('http://localhost:4200/feed')
    cy.viewport(1600, 1200) 
    cy.contains('lock')
  })
})