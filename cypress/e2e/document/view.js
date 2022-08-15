const atbds = require('../../fixtures/server/atbds.json');
const stats = require('../../fixtures/server/stats.json');
const atbd = require('../../fixtures/server/atbd.json');
const atbdVersions = require('../../fixtures/server/atbd-versions.json');

describe('Document View', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v2/atbds?role=owner', atbds);
    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept('GET', '/v2/atbds/test-atbd-1/versions/v1.1', atbdVersions);
  });

  it('Displays ATBD', () => {
    cy.login();
    cy.visit('/documents/test-atbd-1/v1.1');

    cy.get('#doc-header').contains('Test ATBD 1');
    cy.get('#abstract')
      .next() // Get the next sibling after the abstract headline
      .contains(
        /A brief and interesting overview of the themes presented in this document are as follows:/
      );
    cy.get('#plain_summary')
      .next() // Get the next sibling after the abstract headline
      .contains(
        /A brief and interesting overview of the themse presented in this document, but this time, without jargon/
      );
  });
});
