const contactsList = require('../../fixtures/server/contacts/list.json');
const contactsSingle = require('../../fixtures/server/contacts/single.json');

describe('Delete contacts', () => {
  it('deletes from detail page', () => {
    cy.intercept('GET', '/v2/contacts/1', contactsSingle);
    cy.login();
    cy.visit('/contacts/1');

    cy.get('[data-cy="contact-trigger-1"').click();
    cy.contains(/Delete/).click();

    cy.intercept('DELETE', '/v2/contacts/1', {});
    cy.intercept('GET', '/v2/contacts', contactsList);
    cy.get('button[title="Confirm deletion"]').click();

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/contacts');
    });
    cy.get('#the-toast').contains('Contact successfully deleted');
  });

  it('deletes from list page', () => {
    cy.intercept('GET', '/v2/contacts', contactsList);
    cy.login();
    cy.visit('/contacts');

    cy.get('[data-cy="contact-trigger-2"').click();
    cy.contains(/Delete/).click();

    cy.intercept('DELETE', '/v2/contacts/2', {});
    cy.get('button[title="Confirm deletion"]').click();

    cy.contains(/Gregor Mendel/).should('not.exist');
    cy.get('#the-toast').contains('Contact successfully deleted');
  });
});
