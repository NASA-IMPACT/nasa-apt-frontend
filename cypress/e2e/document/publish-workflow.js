const stats = require('../../fixtures/server/stats.json');
const atbd = require('../../fixtures/server/atbd.json');
const atbdVersions = require('../../fixtures/server/atbd-versions.json');
const atbdEvent = require('../../fixtures/server/atbd-event.json');
const atbdReviewerList = require('../../fixtures/server/atbd-reviewer-list.json');

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
  it('owner requests review', () => {
    const draftAtbdVersions = versionWithStatus(atbdVersions, 'DRAFT');

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
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
    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept('GET', '/v2/atbds/test-atbd-1/versions/v1.1', atbdVersions);

    cy.login('owner');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Request review/).should('not.exist');
  });

  it('curator cannot request review', () => {
    const draftAtbdVersions = versionWithStatus(atbdVersions, 'DRAFT');

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
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

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
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

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
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

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
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

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
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

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
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

  it('curator approves review request', () => {
    const draftAtbdVersions = versionWithStatus(
      atbdVersions,
      'CLOSED_REVIEW_REQUESTED'
    );

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );
    cy.intercept(
      'GET',
      '/v2/users?atbd_id=1&version=v1.1&user_filter=invite_reviewers',
      atbdReviewerList
    );

    cy.intercept('POST', '/v2/events', atbdEvent).as('reviewRequest');

    cy.login('curator');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Approve request/).click();
    cy.contains(/Allow.../).click();
    cy.contains(/Approve review request/).should('exist');

    cy.contains('Ricardo Reviewer').click();
    cy.get('[title="Approve review request of document"]').click();
    cy.get('#the-toast').contains('Review request approved successfully');

    cy.get('@reviewRequest')
      .its('request.body')
      .should('deep.equal', {
        atbd_id: 'test-atbd-1',
        version: 'v1.1',
        action: 'accept_closed_review_request',
        payload: {
          reviewers: ['6844a7fe-2bbd-4648-a9b4-5b1a6884038e']
        }
      });
  });

  it('curator cancels review request', () => {
    const draftAtbdVersions = versionWithStatus(
      atbdVersions,
      'CLOSED_REVIEW_REQUESTED'
    );

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );
    cy.intercept(
      'GET',
      '/v2/users?atbd_id=1&version=v1.1&user_filter=invite_reviewers',
      atbdReviewerList
    );

    cy.intercept('POST', '/v2/events', atbdEvent).as('reviewRequest');

    cy.login('curator');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Approve request/).click();
    cy.contains(/Deny.../).click();
    cy.contains(/Deny review request/).should('exist');

    cy.get('#comment').type('Not ready');
    cy.get('[title="Deny request"]').click();
    cy.get('#the-toast').contains('Review request denied successfully');

    cy.get('@reviewRequest')
      .its('request.body')
      .should('deep.equal', {
        atbd_id: 'test-atbd-1',
        version: 'v1.1',
        action: 'deny_closed_review_request',
        payload: {
          comment: 'Not ready'
        }
      });
  });

  it('owner cannot approve review request', () => {
    const draftAtbdVersions = versionWithStatus(
      atbdVersions,
      'CLOSED_REVIEW_REQUESTED'
    );

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );
    cy.intercept(
      'GET',
      '/v2/users?atbd_id=1&version=v1.1&user_filter=invite_reviewers',
      atbdReviewerList
    );

    cy.intercept('POST', '/v2/events', atbdEvent).as('reviewRequest');

    cy.login('owner');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Approve request/).should('not.exist');
  });

  it('contributor cannot approve review request', () => {
    const draftAtbdVersions = versionWithStatus(
      atbdVersions,
      'CLOSED_REVIEW_REQUESTED'
    );

    cy.intercept('GET', '/v2/threads/stats?atbds=1_v1.1', stats);
    cy.intercept('GET', '/v2/atbds/test-atbd-1', atbd);
    cy.intercept(
      'GET',
      '/v2/atbds/test-atbd-1/versions/v1.1',
      draftAtbdVersions
    );
    cy.intercept(
      'GET',
      '/v2/users?atbd_id=1&version=v1.1&user_filter=invite_reviewers',
      atbdReviewerList
    );

    cy.intercept('POST', '/v2/events', atbdEvent).as('reviewRequest');

    cy.login('contributor');
    cy.visit('/documents/test-atbd-1/v1.1');
    cy.contains(/Approve request/).should('not.exist');
  });
});
