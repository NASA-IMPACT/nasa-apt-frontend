const atbds = require('../../fixtures/server/atbds.json');
const stats = require('../../fixtures/server/stats.json');
const atbd = require('../../fixtures/server/atbd.json');
const atbdVersions = require('../../fixtures/server/atbd-versions.json');
const atbdEvent = require('../../fixtures/server/atbd-event.json');

function versionWithStatus(version, status) {
  return {
    ...version,
    versions: version.versions.map((v) => {
      if (v.major === 1 && v.minor === 1) {
        return {
          ...v,
          status
        };
      } else {
        return v;
      }
    })
  };
}

describe('Publish workflow', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v2/atbds?role=owner', atbds);
    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
  });

  it('owner requests review', () => {
    const draftAtbdVersions = versionWithStatus(atbdVersions, 'DRAFT');

    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );

    cy.login('owner');
    cy.visit('/documents/test-atbd-1/v1.1');

    cy.intercept('POST', '/v2/events', atbdEvent).as('reviewRequest');
    cy.contains(/Request review/).click();
    cy.get('#the-toast').contains('Review requested successfully');

    cy.get('@reviewRequest').its('request.body').should('deep.equal', {
      atbd_id: 'test-atbd-1',
      version: 'v1.1',
      action: 'request_closed_review',
      payload: {}
    });
  });

  it('owner cannot request review if not draft', () => {
    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept('GET', '/v2/atbds/test-atbd-1/versions/v1.1', atbdVersions);

    cy.login('owner');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Request review/).should('not.exist');
  });

  it('curator cannot request review', () => {
    const draftAtbdVersions = versionWithStatus(atbdVersions, 'DRAFT');

    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );

    cy.login('curator');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Request review/).should('not.exist');
  });

  it('contributor cannot request review', () => {
    const draftAtbdVersions = versionWithStatus(atbdVersions, 'DRAFT');

    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );

    cy.login('contributor');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Request review/).should('not.exist');
  });

  it('owner cancels review request', () => {
    const draftAtbdVersions = versionWithStatus(
      atbdVersions,
      'CLOSED_REVIEW_REQUESTED'
    );

    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );

    cy.login('owner');
    cy.visit('/documents/test-atbd-1/v1.1');

    cy.intercept('POST', '/v2/events', atbdEvent).as('reviewRequest');
    cy.contains(/Cancel request/).click();
    cy.get('#the-toast').contains('Review request cancelled successfully');

    cy.get('@reviewRequest').its('request.body').should('deep.equal', {
      atbd_id: 'test-atbd-1',
      version: 'v1.1',
      action: 'cancel_closed_review_request',
      payload: {}
    });
  });

  it('owner cannot cancel review request if not review is not requested', () => {
    const draftAtbdVersions = versionWithStatus(atbdVersions, 'DRAFT');

    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );

    cy.login('owner');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Cancel request/).should('not.exist');
  });

  it('curator cannot cancel review request', () => {
    const draftAtbdVersions = versionWithStatus(
      atbdVersions,
      'CLOSED_REVIEW_REQUESTED'
    );

    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );

    cy.login('curator');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Cancel request/).should('not.exist');
  });

  it('contributor cannot cancel review request', () => {
    const draftAtbdVersions = versionWithStatus(
      atbdVersions,
      'CLOSED_REVIEW_REQUESTED'
    );

    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );

    cy.login('contributor');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Cancel request/).should('not.exist');
  });
});
