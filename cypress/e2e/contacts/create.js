const contactsList = require('../../fixtures/server/contacts/list.json');
const contactsCreate = require('../../fixtures/server/contacts/create.json');

describe('Create contacts', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v2/contacts', contactsList);
  });

  it('creates a contact', () => {
    cy.intercept('POST', '/v2/contacts', contactsCreate);
    cy.intercept('GET', '/v2/contacts/3', contactsCreate);

    cy.login();
    cy.visit('/contacts');

    cy.contains(/Create/).click();

    cy.url().should('contain', '/contacts/3/edit');
    cy.get('#first_name').should('have.value', 'New');
    cy.get('#last_name').should('have.value', 'Contact');
  });
});
