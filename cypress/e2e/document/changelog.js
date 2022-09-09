import * as atbd from '../../fixtures/server/atbd.json';
import * as atbdVersions from '../../fixtures/server/atbd-versions.json';

describe('Changelog', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept('GET', '/v2/atbds/test-atbd-1/versions/v1.1', atbdVersions);
  });

  it('renders', () => {
    cy.visit('documents/test-atbd-1/v1.1');
    cy.contains(/Test ATBD 1/).should('exist');

    cy.get('[data-cy="options-trigger"]').click();
    cy.contains('View changelog...').click();

    cy.get('[data-cy="changelog-modal"]')
      .should('contain', 'Major version 1')
      .should('contain', 'Major version 2');
  });
});
