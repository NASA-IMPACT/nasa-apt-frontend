const atbds = require('../../fixtures/server/atbds.json');
const stats = require('../../fixtures/server/stats.json');
const atbdCreated = require('../../fixtures/server/atbd-create.json');
const atbdNew = require('../../fixtures/server/atbd-new.json');
const atbdVersionNew = require('../../fixtures/server/atbd-version-new.json');
const atbdStatsNew = require('../../fixtures/server/atbd-version-new.json');

describe('Document', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v2/atbds?role=owner', atbds);
    cy.intercept('GET', '/v2/threads/stats?atbds=1_v2.0&atbds=2_v1.0', stats);
  });

  it('creates new', () => {
    cy.intercept('POST', '/v2/atbds', atbdCreated);
    cy.intercept('GET', '/v2/atbds/3', atbdNew);
    cy.intercept('GET', '/v2/atbds/3/versions/v1.0', atbdVersionNew);
    cy.intercept('GET', '/v2/threads/stats?atbds=3_v1.0', atbdStatsNew);
    cy.intercept('PUT', '/v2/atbds/3/versions/v1.0/lock?override=false', {
      email: 'curator@example.com',
      preferred_username: 'Carlos Curator'
    });

    cy.login();
    cy.visit('/dashboard');

    cy.contains(/Create/).click();
    cy.get('[data-cy="document-tracker-modal"]').contains(/Close/).click();

    cy.get('input#title').should('have.value', 'Untitled Document');
  });
});
