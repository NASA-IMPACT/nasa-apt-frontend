const contact = require('../../fixtures/server/contacts/single.json');

describe('Edit contacts', () => {
  it('updates a contact', () => {
    cy.intercept('GET', '/v2/contacts/1', contact);

    cy.login();
    cy.visit('/contacts/1/edit');

    cy.get('#first_name').should('have.value', 'Leonardo');
    cy.get('#last_name').should('have.value', 'Davinci');

    cy.get('#url').type('http://example.com');

    cy.intercept('POST', '/v2/contacts/1', {
      ...contact,
      url: 'http://example.com'
    }).as('updateContactRequest');
    cy.contains(/Save/).click();
    cy.wait('@updateContactRequest')
      .its('request.body')
      .then(({ url }) => url)
      .should('equal', 'http://example.com');

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/contacts/1');
    });
    cy.contains('http://example.com').should('exist');
  });

  it('handles API error', () => {
    cy.intercept('GET', '/v2/contacts/1', contact);

    cy.login();
    cy.visit('/contacts/1/edit');

    cy.get('#first_name').should('have.value', 'Leonardo');
    cy.get('#last_name').should('have.value', 'Davinci');

    cy.get('#url').type('http://example.com');

    cy.intercept('POST', '/v2/contacts/1', {
      statusCode: 400,
      body: {
        detail: 'Error occurred'
      }
    });
    cy.contains(/Save/).click();

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/contacts/1/edit');
    });
    cy.get('#the-toast').contains(
      'An error occurred: Request failed with status code 400'
    );
  });
});
