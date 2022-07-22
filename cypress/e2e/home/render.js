describe('Home page', () => {
  it('renders', () => {
    cy.visit('/');
    cy.contains(/The Algorithm Publication Tool/).should('exist');
  });
});
